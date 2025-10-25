import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BodegaRoutingModule } from './bodega-routing.module';
import { IngresosListComponent } from './pages/ingresos-list/ingresos-list.component';
import { IngresosCreateComponent } from './pages/ingresos-create/ingresos-create.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BodegaRoutingModule, IngresosListComponent, IngresosCreateComponent],
})
export class BodegaModule {}

