import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private BASE = environment.apiBase;
  private CACHE_KEY = 'sales_cache';
  constructor(private http: HttpClient) {}

  private postWithFallback<T>(paths: string[], body: any): Observable<T> {
    const [first, ...rest] = paths;
    return this.http.post<T>(`${this.BASE}${first}`, body).pipe(
      catchError((err) => {
        if ((err?.status === 404 || err?.status === 405) && rest.length) {
          return this.postWithFallback<T>(rest, body);
        }
        return throwError(() => err);
      })
    );
  }

  private getWithFallback<T>(paths: string[]): Observable<T> {
    const [first, ...rest] = paths;
    return this.http.get<T>(`${this.BASE}${first}`).pipe(
      catchError((err) => {
        if ((err?.status === 404 || err?.status === 405) && rest.length) {
          return this.getWithFallback<T>(rest);
        }
        return throwError(() => err);
      })
    );
  }

  create(payload: { items: { productId?: number; barcode?: string; quantity: number; price?: number }[] }) {
    // Intenta /sales y alternativas comunes
    return this.postWithFallback<any>(['/sales', '/venta', '/sale', '/ventas'], payload).pipe(
      tap((res: any) => {
        const id = res?.id || res?.data?.id;
        if (id) {
          this.saveCache(id, { items: payload.items, createdAt: new Date().toISOString() });
        }
      })
    );
  }

  list() { return this.getWithFallback<any>(['/sales', '/venta', '/sale', '/ventas']); }

  get(id: number) {
    const detailPaths = [`/sales/${id}`, `/venta/${id}`, `/sale/${id}`, `/ventas/${id}`];
    return this.getWithFallback<any>(detailPaths).pipe(
      catchError((err) => {
        // Si el backend falla internamente (500), intenta obtener el listado y filtrar por id
        if (err?.status === 500) {
          return this.list().pipe(
            map((res: any) => {
              const arr = Array.isArray(res) ? res : (res?.data ?? []);
              const found = arr.find((v: any) => `${v?.id}` === `${id}`);
              // Devuelve algo razonable para que la UI pueda mostrar al menos metadatos
              return found ?? { id, items: [] };
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  items(saleId: number) {
    const candidates = [
      `/sales/${saleId}/items`,
      `/venta/${saleId}/items`,
      `/sale/${saleId}/items`,
      `/ventas/${saleId}/items`,
      `/sale-items?saleId=${saleId}`,
      `/sale-items?saleld=${saleId}`,
      `/items?saleId=${saleId}`
    ];
    return this.getWithFallback<any>(candidates).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  // ---- Local cache helpers (fallback cuando el backend no devuelve detalle) ----
  private readCache(): Record<string, any> {
    try { return JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}'); } catch { return {}; }
  }
  private writeCache(obj: Record<string, any>) { localStorage.setItem(this.CACHE_KEY, JSON.stringify(obj)); }
  private saveCache(id: number | string, data: any) { const c = this.readCache(); c[String(id)] = data; this.writeCache(c); }
  cachedItems(id: number): any[] | null { const c = this.readCache(); return c[String(id)]?.items ?? null; }
}
