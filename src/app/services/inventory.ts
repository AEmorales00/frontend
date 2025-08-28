import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:4000/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  getInventory(): Observable<any> {
    return this.http.get(API_URL);
  }

  createInventory(data: { name: string; description?: string; quantity: number }): Observable<any> {
    return this.http.post(API_URL, data);
  }

  eliminarInventario(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  updateInventory(id: number, data: { name: string; description?: string; quantity: number }): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, data);
  }
}
