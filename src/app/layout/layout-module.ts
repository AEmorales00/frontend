import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutRoutingModule } from './layout-routing-module';
import { Layout } from './layout';

@NgModule({
  declarations: [
    Layout
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule
  ],
  exports: [
    Layout
  ]
})
export class LayoutModule { }
