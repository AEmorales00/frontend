// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { AuthGuard } from './core/guards/auth-guard';

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
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule) },
      { path: 'productos', loadChildren: () => import('./productos/productos-module').then(m => m.ProductosModule) },
      { path: 'ventas', loadChildren: () => import('./ventas/ventas-module').then(m => m.VentasModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Por defecto, si no hay nada, te mando a login
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
