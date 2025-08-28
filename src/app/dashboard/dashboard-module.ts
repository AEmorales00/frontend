import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Dashboard } from './dashboard';

const routes: Routes = [
  { path: '', component: Dashboard }
];

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
