import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role-guard';
import { IngresosListComponent } from './pages/ingresos-list/ingresos-list.component';
import { IngresosCreateComponent } from './pages/ingresos-create/ingresos-create.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN','BODEGUERO'] },
    children: [
      { path: '', redirectTo: 'ingresos', pathMatch: 'full' },
      { path: 'ingresos', component: IngresosListComponent, data: { title: 'Ingresos a bodega' } },
      { path: 'ingresos/nuevo', component: IngresosCreateComponent, data: { title: 'Nuevo ingreso' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodegaRoutingModule {}

