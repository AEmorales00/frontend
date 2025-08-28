import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryComponent } from './inventory/inventory';

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InventoryComponent
  ]
})
export class PagesModule { }
