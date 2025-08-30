import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ventas } from './ventas';
import { Nueva } from './pages/nueva';
import { Historial } from './pages/historial';
import { Detalle } from './pages/detalle';

const routes: Routes = [
  {
    path: '',
    component: Ventas,
    children: [
      { path: 'nueva', component: Nueva },
      { path: 'historial', component: Historial },
      { path: 'historial/:id', component: Detalle },
      { path: '', redirectTo: 'nueva', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
