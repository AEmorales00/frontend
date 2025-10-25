import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAdminService } from '../../../shared/services/user-admin.service';
import { AdminUser, Role, UserStatus } from '../../../shared/models/user-admin.models';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UsersEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(UserAdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id!: number;
  loading = false;
  error = '';

  roles: Role[] = ['ADMIN','JEFE','BODEGUERO','VENDEDOR'];
  statuses: UserStatus[] = ['ACTIVO','BLOQUEADO','BAJA'];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roles: [[] as Role[]],
    status: ['ACTIVO' as UserStatus],
    newPassword: ['']
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) { this.router.navigateByUrl('/admin/usuarios'); return; }
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getById(this.id).subscribe({
      next: (u: AdminUser) => {
        this.form.reset({
          name: u.name,
          email: u.email,
          roles: u.roles,
          status: u.status,
          newPassword: ''
        });
        this.loading = false;
      },
      error: () => { this.error = 'No se pudo cargar el usuario'; this.loading = false; }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email, roles, status, newPassword } = this.form.value as any;
    this.loading = true;
    this.api.update(this.id, { name, email }).subscribe({
      next: () => {
        this.api.setRoles(this.id, roles).subscribe({
          next: () => {
            const afterStatus = () => this.router.navigateByUrl('/admin/usuarios');
            if (newPassword) {
              this.api.changePassword(this.id, newPassword).subscribe({ next: () => this.api.setStatus(this.id, status).subscribe({ next: afterStatus, error: () => { this.error = 'Error actualizando estado'; this.loading = false; } }), error: () => { this.error = 'Error cambiando password'; this.loading = false; } });
            } else {
              this.api.setStatus(this.id, status).subscribe({ next: afterStatus, error: () => { this.error = 'Error actualizando estado'; this.loading = false; } });
            }
          },
          error: () => { this.error = 'Error actualizando roles'; this.loading = false; }
        });
      },
      error: () => { this.error = 'Error actualizando datos'; this.loading = false; }
    });
  }
}
