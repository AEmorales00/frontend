import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../core/services/products.service';
import { SalesService } from '../core/services/sales.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  ventasHoy = 0;
  productos = 0;
  stockBajo = 0;
  loading = false;
  error: string | null = null;

  constructor(private products: ProductsService, private sales: SalesService) {}

  ngOnInit(): void {
    this.loading = true;
    // Productos: cantidad total y stock bajo (<=3)
    this.products.list().subscribe({
      next: (list: Product[]) => {
        this.productos = list.length;
        this.stockBajo = list.filter(p => Number((p as any).stock ?? (p as any).quantity ?? 0) <= 3).length;
        this.loading = false;
      },
      error: (_e) => {
        this.error = 'No se pudo cargar inventario';
        this.loading = false;
      }
    });

    // Ventas de hoy: filtra por fecha (createdAt o date)
    this.sales.list().subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : (res?.data ?? []);
        const hoy = new Date();
        const y = hoy.getFullYear(), m = hoy.getMonth(), d = hoy.getDate();
        this.ventasHoy = arr.filter((v: any) => {
          const raw = v?.createdAt || v?.date;
          if (!raw) return false;
          const dt = new Date(raw);
          return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
        }).length;
      },
      error: (_e) => { this.error = this.error || 'No se pudo cargar ventas'; }
    });
  }
}
