import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './directives/has-role.directive';
import { HasAnyRoleDirective } from './directives/has-any-role.directive';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HasRoleDirective,
    HasAnyRoleDirective
  ],
  exports: [
    HasRoleDirective,
    HasAnyRoleDirective
  ]
})
export class SharedModule { }
