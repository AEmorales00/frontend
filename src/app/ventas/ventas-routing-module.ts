import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ventas } from './ventas';
import { Nueva } from './pages/nueva';
import { Historial } from './pages/historial';
import { Detalle } from './pages/detalle';
import { RoleGuard } from '../core/guards/role-guard';

const routes: Routes = [
  {
    path: '',
    component: Ventas,
    children: [
      { path: 'nueva', component: Nueva, canActivate: [RoleGuard], data: { roles: ['ADMIN','VENDEDOR'] } },
      { path: 'historial', component: Historial, canActivate: [RoleGuard], data: { roles: ['ADMIN','VENDEDOR','JEFE'] } },
      { path: 'historial/:id', component: Detalle, canActivate: [RoleGuard], data: { roles: ['ADMIN','VENDEDOR','JEFE'] } },
      { path: '', redirectTo: 'nueva', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
