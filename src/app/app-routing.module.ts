// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
  // Rutas públicas (SIN layout)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },

  // Rutas protegidas (CON layout)
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule), canActivate: [RoleGuard], canMatch: [RoleGuard], data: { roles: ['ADMIN','JEFE'] } },
      { path: 'productos', loadChildren: () => import('./productos/productos-module').then(m => m.ProductosModule), canActivate: [RoleGuard], canMatch: [RoleGuard], data: { roles: ['ADMIN','JEFE','BODEGUERO','VENDEDOR'] } },
      { path: 'ventas', loadChildren: () => import('./ventas/ventas-module').then(m => m.VentasModule), canActivate: [RoleGuard], canMatch: [RoleGuard], data: { roles: ['ADMIN','VENDEDOR','JEFE'] } },
      { path: 'bodega', loadChildren: () => import('./bodega/bodega.module').then(m => m.BodegaModule), canActivate: [RoleGuard], canMatch: [RoleGuard], data: { roles: ['ADMIN','BODEGUERO'] } },
      { path: 'reportes', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule), canActivate: [RoleGuard], canMatch: [RoleGuard], data: { roles: ['ADMIN','JEFE'] } },
      { path: 'admin/usuarios', loadChildren: () => import('./pages/admin/users/users.module').then(m => m.UsersModule), canActivate: [RoleGuard], canMatch: [RoleGuard], data: { roles: ['ADMIN'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: 'unauthorized', component: UnauthorizedComponent },

  // Por defecto, si no hay nada, te mando a login
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
