import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private api = environment.api;

  constructor(private http: HttpClient) {}

  listPurchases() {
    return this.http.get<any[]>(`${this.api}/warehouse/purchases`);
  }

  createPurchase(payload: {
    supplierId?: number;
    note?: string;
    items: Array<{ productId: number; quantity: number; unitCost: number }>;
  }) {
    return this.http.post(`${this.api}/warehouse/purchases`, payload);
  }
}

