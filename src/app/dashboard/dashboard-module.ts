import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Dashboard } from './dashboard';
import { RoleGuard } from '../core/guards/role-guard';

const routes: Routes = [
  { path: '', component: Dashboard, canActivate: [RoleGuard], data: { roles: ['ADMIN','JEFE'] } }
];

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
