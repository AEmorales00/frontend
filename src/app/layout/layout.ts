import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  menuItems = [
    { title: 'Dashboard', icon: 'pie-chart-outline', link: '/dashboard' },
    { title: 'Productos', icon: 'cube-outline', link: '/productos' },
    { title: 'Ventas', icon: 'file-text-outline', link: '/ventas' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  toggleSidebar() {
    // Sidebar functionality can be implemented later with a different UI library
    console.log('Toggle sidebar');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  // Nebular handles menu interactions; no manual close needed
}
