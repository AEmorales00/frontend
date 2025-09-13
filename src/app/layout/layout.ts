import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  userOpen = false;
  sidebarOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.userOpen = !this.userOpen;
  }

  toggleSidebar(event?: Event) {
    if (event) event.stopPropagation();
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  @HostListener('document:click')
  closeMenus() { this.userOpen = false; this.sidebarOpen = false; }
}
