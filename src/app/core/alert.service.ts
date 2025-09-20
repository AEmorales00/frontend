import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  fire(options: SweetAlertOptions) {
    return Swal.fire(options);
  }

  success(text: string, title = 'Éxito') {
    return this.fire({ icon: 'success', title, text, confirmButtonText: 'Aceptar' });
  }

  error(text: string, title = 'Error') {
    return this.fire({ icon: 'error', title, text, confirmButtonText: 'Entendido' });
  }

  info(text: string, title = 'Información') {
    return this.fire({ icon: 'info', title, text, confirmButtonText: 'Ok' });
  }

  confirm(text: string, title = 'Confirmar') {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(r => r.isConfirmed);
  }
}

