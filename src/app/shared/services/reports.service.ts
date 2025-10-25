import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private base = `${environment.api}/reports`;
  constructor(private http: HttpClient) {}
  overview() { return this.http.get<any>(`${this.base}/overview`); }
  salesByDay() { return this.http.get<any[]>(`${this.base}/sales-by-day`); }
  topProducts() { return this.http.get<any[]>(`${this.base}/top-products`); }
  salesBySeller() { return this.http.get<any[]>(`${this.base}/sales-by-seller`); }
  lowStock() { return this.http.get<any[]>(`${this.base}/low-stock`); }
}
