import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.auth.hydrateFromStorage();
    // Si no hay roles en memoria pero hay token, intenta /auth/me
    this.auth.ensureUserRoles().subscribe();
  }
}
