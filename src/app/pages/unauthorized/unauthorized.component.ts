import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `<div class="container py-5 text-center">
    <h2>Acceso denegado</h2>
    <p>No tienes permisos para ver este contenido.</p>
    <a routerLink="/" class="btn btn-primary mt-3">Ir al inicio</a>
  </div>`
})
export class UnauthorizedComponent {}

