import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminUser, CreateUserDto, UpdateUserDto, UserStatus, Role } from '../models/user-admin.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private base = `${environment.api}/admin/users`;
  constructor(private http: HttpClient) {}

  list(): Observable<AdminUser[]> { return this.http.get<AdminUser[]>(this.base); }
  get(id: number): Observable<AdminUser> { return this.http.get<AdminUser>(`${this.base}/${id}`); }
  getById(id: number): Observable<AdminUser> { return this.get(id); }
  create(dto: CreateUserDto) { return this.http.post<AdminUser>(this.base, dto); }
  update(id: number, dto: UpdateUserDto) { return this.http.patch(`${this.base}/${id}`, dto); }
  setRoles(id: number, roles: Role[]) { return this.http.patch(`${this.base}/${id}/roles`, { roles }); }
  setStatus(id: number, status: UserStatus) { return this.http.patch(`${this.base}/${id}/status`, { status }); }
  changePassword(id: number, password: string) { return this.http.patch(`${this.base}/${id}/password`, { password }); }
  delete(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
