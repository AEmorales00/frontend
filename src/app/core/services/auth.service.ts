import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, map, catchError, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtUserPayload, LoginResponse, Role } from '../../shared/models/auth.models';

function decode<T = any>(token: string): T | null {
  try {
    const b = token.split('.')[1];
    return JSON.parse(atob(b));
  } catch { return null; }
}

function normalizeUser(raw: any | null | undefined): JwtUserPayload | null {
  if (!raw) return null;
  const roleSource: any = raw.roles ?? raw.role ?? raw.rol ?? raw.authorities ?? raw.permisos ?? raw.rolesNames;
  let roles: string[] = [];
  if (Array.isArray(roleSource)) {
    roles = roleSource.map((r: any) => typeof r === 'string' ? r : (r?.name ?? r?.role ?? '')).filter(Boolean);
  } else if (typeof roleSource === 'string') {
    roles = [roleSource];
  }
  roles = roles
    .map(r => String(r).toUpperCase().replace(/^ROLE_/, ''))
    .map(r => (r === 'USER' ? 'VENDEDOR' : r));
  const allowed: Role[] = ['ADMIN','JEFE','BODEGUERO','VENDEDOR'];
  const finalRoles: Role[] = roles.filter((r): r is Role => allowed.includes(r as Role));

  const u: JwtUserPayload = {
    sub: Number(raw.sub ?? raw.id ?? 0),
    name: String(raw.name ?? raw.fullName ?? raw.username ?? ''),
    email: String(raw.email ?? ''),
    status: (raw.status ?? 'ACTIVO') as any,
    roles: finalRoles,
    exp: raw.exp
  };
  return u;
}

function deriveRolesFromToken(): Role[] {
  try {
    const t = localStorage.getItem('token');
    if (!t) return [];
    const p = decode<any>(t) || {};
    let src: any = p.roles ?? p.auth_roles ?? p.authorities ?? p.scopes ?? p.scope;
    let roles: string[] = [];
    if (Array.isArray(src)) roles = src;
    else if (typeof src === 'string') roles = src.split(/[ ,]/).filter(Boolean);
    roles = roles.map(r => String(r).toUpperCase().replace(/^ROLE_/, ''))
                 .map(r => (r === 'USER' ? 'VENDEDOR' : r));
    const allowed: Role[] = ['ADMIN','JEFE','BODEGUERO','VENDEDOR'];
    return roles.filter((r): r is Role => allowed.includes(r as Role));
  } catch { return []; }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.api;
  private state$ = new BehaviorSubject<JwtUserPayload | null>(null);

  constructor(private http: HttpClient) {
    // Initialize state from existing token
    const t = this.token;
    if (t) {
      const payload = normalizeUser(decode<any>(t));
      if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
        const tokenRoles = (payload.roles && payload.roles.length) ? payload.roles : deriveRolesFromToken();
        this.state$.next({ ...payload, roles: tokenRoles });
      } else {
        this.token = null;
      }
    }
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<any>(`${this.base}/auth/login`, payload).pipe(
      switchMap((res: any) => {
        const token: string | undefined = res?.token || res?.accessToken;
        if (token) {
          this.token = token;
          localStorage.setItem('token', token);  // Ensure consistency
        }
        const fromResp = normalizeUser(res?.user) || normalizeUser(decode<any>(token || ''));
        const tokenRolesImmediate = deriveRolesFromToken();
        if (fromResp) {
          const mergedRoles: Role[] = Array.from(new Set([...(fromResp.roles || []), ...tokenRolesImmediate])) as Role[];
          if (mergedRoles.length) {
            const finalUser = { ...fromResp, roles: mergedRoles } as JwtUserPayload;
            this.state$.next(finalUser);
            try {
              if (token) localStorage.setItem('tec-auth', JSON.stringify({ token, user: finalUser }));
              localStorage.setItem('auth_user', JSON.stringify(finalUser));
            } catch {}
            return of(finalUser);
          }
        }
        // Fallback to /auth/me if roles are missing
        return this.http.get<any>(`${this.base}/auth/me`).pipe(
          catchError(() => of(null)),
          tap((me: any) => {
            let user = normalizeUser(me) || fromResp || null;
            if (user && (!user.roles || user.roles.length === 0)) {
              const tokenRoles = deriveRolesFromToken();
              user = { ...user, roles: tokenRoles } as JwtUserPayload;
            }
            if (user) {
              this.state$.next(user);
              try {
                const t = this.token;
                if (t) localStorage.setItem('tec-auth', JSON.stringify({ token: t, user }));
                localStorage.setItem('auth_user', JSON.stringify(user));
              } catch {}
            }
          })
        );
      })
    );
  }

  register(payload: { name: string; email: string; password: string }) {
    return this.http.post(`${this.base}/auth/register`, payload);
  }

  get token(): string | null { return localStorage.getItem('token'); }
  set token(v: string | null) { v ? localStorage.setItem('token', v) : localStorage.removeItem('token'); }

  logout() {
    this.token = null;
    this.state$.next(null);
    localStorage.removeItem('tec-auth');
    localStorage.removeItem('auth_user');
  }

  user$() { return this.state$.asObservable(); }
  currentUser(): JwtUserPayload | null { return this.state$.value; }
  hasRole(...expected: Role[]): boolean {
    const u = this.state$.value ?? this.getUserSafe();
    if (!u) return false;
    return expected.length === 0 || u.roles?.some(r => expected.includes(r)) || false;
  }
  hasAnyRole(expected: string[]): boolean {
    const u = this.state$.value ?? this.getUserSafe();
    if (!u) return false;
    const roles = u.roles || [];
    return expected.length === 0 || roles.some(r => expected.includes(r));
  }
  isLogged(): boolean { return !!this.state$.value; }
  isLoggedIn(): boolean { return this.isLogged() || !!this.token; }

  // Robust fallback reader for guards/navigation refresh scenarios
  private readUserFromStorage(): JwtUserPayload | null {
    console.log('[AuthService] readUserFromStorage() - reading from localStorage');
    const raw = localStorage.getItem('tec-auth');
    console.log('[AuthService] tec-auth raw:', raw);
    if (raw) {
      try {
        const { token, user } = JSON.parse(raw);
        const payload = token ? normalizeUser(decode<any>(token)) : null;
        if (payload?.exp && payload.exp * 1000 < Date.now()) return null;
        const candidate = normalizeUser(user);
        if (candidate) {
          const merged: JwtUserPayload = {
            ...candidate,
            roles: (candidate.roles && candidate.roles.length ? candidate.roles : (payload?.roles ?? [])) as Role[],
          } as JwtUserPayload;
          return merged;
        }
        return payload ?? null;
      } catch { /* ignore */ }
    }
    // Check alternative storage key used by some flows
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try { return normalizeUser(JSON.parse(authUser)); } catch { /* ignore */ }
    }
    // Fallback to decoding raw token key if present
    const t = this.token;
    if (!t) return null;
    const payload = normalizeUser(decode<any>(t));
    if (payload?.exp && payload.exp * 1000 < Date.now()) return null;
    return payload ?? null;
  }

  getUserSafe(): JwtUserPayload | null {
    const current = this.currentUser();
    const fromStorage = this.readUserFromStorage();
    const result = current ?? fromStorage;
    console.log('[AuthService] getUserSafe() - current:', current, 'fromStorage:', fromStorage, 'result:', result);
    return result;
  }

  // Explicit hydrator for app bootstrap to ensure guards/directives see user
  hydrateFromStorage(): void {
    const u = this.readUserFromStorage();
    if (u) this.state$.next(u);
  }

  // Attempt to fetch current user from backend if roles are missing but token exists
  fetchMe(): Observable<JwtUserPayload | null> {
    const t = this.token;
    if (!t) return of(null);
    const decoded = normalizeUser(decode<any>(t));
    return this.http.get<any>(`${this.base}/auth/me`).pipe(
      map(res => {
        const me = normalizeUser(res);
        if (!me) {
          if (decoded && (!decoded.roles || decoded.roles.length === 0)) {
            decoded.roles = deriveRolesFromToken();
          }
          return decoded ?? null;
        }
        let roles: Role[] = me.roles as Role[];
        if (!roles || roles.length === 0) roles = (decoded?.roles as Role[] ?? []);
        if (!roles || roles.length === 0) roles = deriveRolesFromToken();
        return { ...me, roles } as JwtUserPayload;
      }),
      tap(user => {
        if (user) {
          this.state$.next(user);
          try {
            const raw = localStorage.getItem('tec-auth');
            const token = this.token;
            if (token) localStorage.setItem('tec-auth', JSON.stringify({ token, user }));
            localStorage.setItem('auth_user', JSON.stringify(user));
          } catch {}
        }
      }),
      catchError(() => of(null))
    );
  }

  ensureUserRoles(): Observable<JwtUserPayload | null> {
    const u = this.getUserSafe();
    console.log('[AuthService] ensureUserRoles() - current user:', u);
    if (u && Array.isArray(u.roles) && u.roles.length > 0) {
      console.log('[AuthService] Roles already present:', u.roles);
      return of(u);
    }
    // Try token-derived roles before calling API
    const tokenRoles = deriveRolesFromToken();
    if (u && tokenRoles.length) {
      const merged = { ...u, roles: tokenRoles } as JwtUserPayload;
      this.state$.next(merged);
      try { localStorage.setItem('auth_user', JSON.stringify(merged)); } catch {}
      console.log('[AuthService] Derived roles from token:', tokenRoles);
      return of(merged);
    }
    console.log('[AuthService] No roles, fetching from /auth/me');
    return this.fetchMe();
  }
}
