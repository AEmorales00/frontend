// src/app/productos/productos-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { List } from './pages/list';
import { Create } from './pages/create';
import { Edit } from './pages/edit';
import { RoleGuard } from '../core/guards/role-guard';
// import { Importar } from './pages/importar';

const routes: Routes = [
  { path: '', component: List },
  { path: 'crear', component: Create, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'editar/:id', component: Edit, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } }
  // { path: 'importar', component: Importar }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ProductosRoutingModule {}
