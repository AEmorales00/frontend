import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../core/services/sales.service';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.html',
  styleUrl: './historial.scss'
})
export class Historial implements OnInit {
  loading = false;
  error: string | null = null;
  ventas: any[] = [];

  constructor(private sales: SalesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.sales.list().subscribe({
      next: (res: any) => { this.ventas = Array.isArray(res) ? res : (res?.data ?? []); this.loading = false; },
      error: (e: any) => { this.error = 'No se pudo cargar el historial'; this.loading = false; }
    });
  }
}
