import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  menuItems: Array<{ title: string; icon: string; link: string }> = [];
  sidebarOpen = true;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const u = this.auth.getUserSafe();
    const roles: string[] = u?.roles || [];
    const isAdmin = roles.includes('ADMIN');
    const isJefe = roles.includes('JEFE');
    const isBodeguero = roles.includes('BODEGUERO');
    const isVendedor = roles.includes('VENDEDOR');

    // Construir menú desde cero según rol
    if (isAdmin || isJefe) {
      this.menuItems.push({ title: 'Dashboard', icon: 'pie-chart-outline', link: '/dashboard' });
    }
    this.menuItems.push({ title: 'Productos', icon: 'cube-outline', link: '/productos' });
    if (isAdmin || isVendedor) {
      this.menuItems.push({ title: 'Ventas', icon: 'file-text-outline', link: '/ventas' });
    }
    if (isAdmin || isBodeguero) {
      this.menuItems.push({ title: 'Bodega', icon: 'archive-outline', link: '/bodega/ingresos' });
    }
    if (isAdmin || isJefe) {
      this.menuItems.splice(1, 0, { title: 'Reportes', icon: 'bar-chart-2-outline', link: '/reportes' });
    }
    if (isAdmin) {
      this.menuItems.push({ title: 'Administración', icon: 'settings-2-outline', link: '/admin/usuarios' });
    }
  }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  // Nebular handles menu interactions; no manual close needed
}
