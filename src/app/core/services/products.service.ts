import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  barcode?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private BASE = environment.apiBase;

  list(): Observable<Product[]> {
    // Solicita activos si el backend soporta el filtro (?active=true);
    // si no, filtramos en el cliente.
    return this.http.get<any>(`${this.BASE}/inventory?active=true`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.data ?? res?.items ?? [])),
      map((arr: any[]) => arr.map((it: any) => ({
        id: it.id,
        name: it.name,
        description: it.description ?? '',
        barcode: it.barcode ?? null,
        price: Number(it.price ?? 0),
        stock: Number(it.stock ?? it.quantity ?? 0),
        active: (it.active === undefined ? true : !!it.active)
      } as Product))),
      map((arr: Product[]) => arr.filter(p => p.active !== false))
    );
  }

  private normalizeOne(input: any): Product {
    const it = Array.isArray(input) ? (input[0] ?? {}) : (input?.data ?? input);
    return {
      id: it.id,
      name: it.name,
      description: it.description ?? '',
      barcode: it.barcode ?? null,
      price: Number(it.price ?? 0),
      stock: Number(it.stock ?? it.quantity ?? 0),
      active: (it.active === undefined ? true : !!it.active)
    } as Product;
  }

  get(id: number): Observable<Product> {
    const base = this.BASE;
    return this.http.get<any>(`${base}/inventory/${id}`).pipe(
      map((res) => this.normalizeOne(res)),
      catchError((err) => {
        if (err?.status === 404) {
          // Fallbacks por si el backend no expone /inventory/:id
          return this.http.get<any>(`${base}/inventory?id=${id}`).pipe(
            map((res) => this.normalizeOne(res))
          );
        }
        return throwError(() => err);
      })
    );
  }
  getByBarcode(barcode: string) { return this.http.get<any>(`${this.BASE}/inventory/barcode/${barcode}`); }
  create(data: any) { return this.http.post(`${this.BASE}/inventory`, data); }

  update(id: number, d: any) { return this.http.put(`${this.BASE}/inventory/${id}`, d); }

  // Soft delete: marca el producto como inactivo
  remove(id: number) { return this.update(id, { active: false }); }

  constructor(private http: HttpClient) {}
}
