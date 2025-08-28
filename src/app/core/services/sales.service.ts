import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private BASE = environment.apiBase;
  constructor(private http: HttpClient) {}

  create(payload: { items: { productId?: number; barcode?: string; quantity: number }[] }) {
    return this.http.post(`${this.BASE}/sales`, payload);
  }

  list() { return this.http.get(`${this.BASE}/sales`); } // si lo expones
}