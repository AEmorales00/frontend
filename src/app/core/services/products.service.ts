import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  barcode?: string | null;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private BASE = environment.apiBase;

  constructor(private http: HttpClient) {}

  list()                { return this.http.get<Product[]>(`${this.BASE}/inventory`); }
  get(id: number)       { return this.http.get<Product>(`${this.BASE}/inventory/${id}`); }
  create(data: any)     { return this.http.post(`${this.BASE}/inventory`, data); }
  update(id: number, d: any){ return this.http.put(`${this.BASE}/inventory/${id}`, d); }
  remove(id: number)    { return this.http.delete(`${this.BASE}/inventory/${id}`); }

  getByBarcode(code: string) {
    return this.http.get<Product>(`${this.BASE}/inventory/by-barcode/${code}`);
  }

  bulk(items: any[])    { return this.http.post(`${this.BASE}/inventory/bulk`, items); }
}