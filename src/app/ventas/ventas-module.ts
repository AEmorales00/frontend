import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VentasRoutingModule } from './ventas-routing-module';
import { Ventas } from './ventas';
import { Nueva } from './pages/nueva';
import { Historial } from './pages/historial';
import { Detalle } from './pages/detalle';

@NgModule({
  declarations: [
    Ventas,
    Nueva,
    Historial,
    Detalle
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
