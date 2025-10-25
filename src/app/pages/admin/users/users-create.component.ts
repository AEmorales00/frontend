import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAdminService } from '../../../shared/services/user-admin.service';
import { Role, UserStatus } from '../../../shared/models/user-admin.models';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UsersCreateComponent {
  private fb = inject(FormBuilder);
  private api = inject(UserAdminService);
  private router = inject(Router);

  loading = false;
  error = '';

  roles: Role[] = ['ADMIN','JEFE','BODEGUERO','VENDEDOR'];
  statuses: UserStatus[] = ['ACTIVO','BLOQUEADO','BAJA'];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: [[] as Role[]],
    status: ['ACTIVO' as UserStatus],
  });

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const dto: any = { ...this.form.value };
    if (typeof dto.roles === 'string') dto.roles = [dto.roles];
    this.api.create(dto).subscribe({
      next: () => this.router.navigateByUrl('/admin/usuarios'),
      error: () => { this.error = 'No se pudo crear'; this.loading = false; }
    });
  }
}
