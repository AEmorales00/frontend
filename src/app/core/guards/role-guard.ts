import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree, CanMatch, Route, UrlSegment } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../../shared/models/auth.models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate, CanMatch {
  constructor(private auth: AuthService, private router: Router) {}

  private check(expected: Role[]): boolean | UrlTree | Observable<boolean | UrlTree> {
    const immediate = this.auth.getUserSafe();
    console.log('[RoleGuard] check() - immediate user:', immediate);
    console.log('[RoleGuard] expected roles:', expected);
    
    const decide = (u: any): boolean | UrlTree => {
      const user = u ?? this.auth.getUserSafe();
      console.log('[RoleGuard] decide() - user:', user);
      console.log('[RoleGuard] user.roles:', user?.roles);
      if (!user) return this.router.parseUrl('/auth/login');
      let roles: any[] = user.roles ?? [];
      console.log('[RoleGuard] parsed roles from user:', roles);
      
      // Fallback 1: roles desde el token si user.roles está vacío
      if (!roles?.length) {
        try {
          const t = localStorage.getItem('token');
          const p = t ? JSON.parse(atob(t.split('.')[1])) : null;
          let src: any = p?.roles ?? p?.auth_roles ?? p?.authorities ?? p?.scopes ?? p?.scope;
          if (Array.isArray(src)) roles = src;
          else if (typeof src === 'string') roles = src.split(/[ ,]/).filter(Boolean);
          roles = (roles as string[]).map(r => r.toUpperCase().replace(/^ROLE_/, '')).map(r => r === 'USER' ? 'VENDEDOR' : r);
          console.log('[RoleGuard] token-derived roles:', roles);
        } catch { /* noop */ }
      }

      // Dev fallback: permite forzar roles desde localStorage mientras se corrige backend
      if (!roles?.length) {
        console.warn('[RoleGuard] No roles found, checking force_roles fallback');
        const rawForced = localStorage.getItem('force_roles');
        if (rawForced) {
          let forced: any[] = [];
          try {
            const parsed = JSON.parse(rawForced);
            if (Array.isArray(parsed)) forced = parsed;
          } catch {
            // Si no es JSON, acepta CSV: "ADMIN,JEFE"
            forced = rawForced.split(',').map(s => s.trim()).filter(Boolean);
          }
          if (Array.isArray(forced) && forced.length) {
            roles = (forced as string[])
              .map(r => r.toUpperCase().replace(/^ROLE_/, ''))
              .map(r => (r === 'USER' ? 'VENDEDOR' : r));
            console.log('[RoleGuard] Using forced roles:', roles);
          }
        }
      }
      
      const ok = expected.length === 0 || roles.some((r: any) => expected.includes(r as Role));
      console.log('[RoleGuard] decision - ok:', ok, 'expected:', expected, 'has:', roles);
      return ok ? true : this.router.parseUrl('/unauthorized');
    };

    // Si no tenemos roles cargados aún, intenta recuperar desde /auth/me
    if (!immediate || !Array.isArray(immediate.roles) || immediate.roles.length === 0) {
      console.log('[RoleGuard] No immediate roles, fetching from /auth/me');
      return this.auth.ensureUserRoles().pipe(map(decide));
    }
    console.log('[RoleGuard] Using immediate roles');
    return decide(immediate);
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const expected: Role[] = route.data['roles'] || [];
    return this.check(expected);
  }

  canMatch(route: Route, _segments: UrlSegment[]) {
    const expected: Role[] = (route.data as any)?.roles || [];
    return this.check(expected);
  }
}
