import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SharedModule } from '../shared/shared-module';

import { Productos } from './productos';
import { ProductosRoutingModule } from './productos-routing-module';
import { List } from './pages/list';
import { Create } from './pages/create';
import { Edit } from './pages/edit';
// import { Importar } from './pages/importar';

@NgModule({
  declarations: [
    Productos,
    List,
    Create,
    Edit
    // Importar
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    ProductosRoutingModule
  ],
  providers: [
    CurrencyPipe,
    DecimalPipe
  ]
})
export class ProductosModule { }
