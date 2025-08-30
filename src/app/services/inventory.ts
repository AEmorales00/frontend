import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiBase}/inventory`;

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

  updateInventory(id: number, data: { name: string; description?: string; quantity: number }): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, data);
  }

  eliminarInventario(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  obtenerInventario(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }
}
