import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../../core/guards/role-guard';

const routes: Routes = [
  { path: '', loadComponent: () => import('./users-list.component').then(m => m.UsersListComponent), canMatch: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'nuevo', loadComponent: () => import('./users-create.component').then(m => m.UsersCreateComponent), canMatch: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: ':id', loadComponent: () => import('./users-edit.component').then(m => m.UsersEditComponent), canMatch: [RoleGuard], data: { roles: ['ADMIN'] } }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class UsersRoutingModule {}
