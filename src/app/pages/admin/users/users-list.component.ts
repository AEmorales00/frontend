import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserAdminService } from '../../../shared/services/user-admin.service';
import { AdminUser, Role, UserStatus } from '../../../shared/models/user-admin.models';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UsersListComponent implements OnInit {
  private api = inject(UserAdminService);
  users: AdminUser[] = [];
  loading = false;
  error = '';

  roles: Role[] = ['ADMIN','JEFE','BODEGUERO','VENDEDOR'];
  statuses: UserStatus[] = ['ACTIVO','BLOQUEADO','BAJA'];

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.list().subscribe({
      next: (u) => { this.users = u; this.loading = false; },
      error: () => { this.error = 'Error cargando usuarios'; this.loading = false; }
    });
  }

  remove(u: AdminUser) {
    if (!confirm(`Eliminar ${u.email}?`)) return;
    this.api.delete(u.id).subscribe({ next: () => this.load() });
  }
}
