import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  login(payload: { email: string; password: string }) {
    return this.http.post<{ accessToken: string }>(`${this.base}/auth/login`, payload);
  }

  register(payload: { name: string; email: string; password: string }) {
    return this.http.post(`${this.base}/auth/register`, payload);
  }

  get token(): string | null { return localStorage.getItem('token'); }
  set token(v: string | null) { v ? localStorage.setItem('token', v) : localStorage.removeItem('token'); }

  logout() { this.token = null; }
  isLoggedIn(): boolean { return !!this.token;}
}