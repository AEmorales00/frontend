import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../core/services/sales.service';
import { ProductsService, Product } from '../../core/services/products.service';

@Component({
  selector: 'app-detalle-venta',
  standalone: false,
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss'
})
export class Detalle implements OnInit {
  loading = false;
  error: string | null = null;
  venta: any = null;
  productosIdx = new Map<number, Product>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sales: SalesService,
    private products: ProductsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'ID inválido'; return; }
    this.loading = true;
    // Cargar productos para enriquecer nombres si el detalle no los trae
    this.products.list().subscribe({
      next: (list) => list.forEach(p => { if (p.id != null) this.productosIdx.set(p.id, p); }),
      error: () => {}
    });

    this.sales.get(id).subscribe({
      next: (res: any) => {
        this.venta = res?.data ?? res;
        const items = this.venta?.items;
        if (!items || !Array.isArray(items) || items.length === 0) {
          // Fallback: pedir items por separado si el detalle no los incluye o el endpoint falla
          this.sales.items(id).subscribe({
            next: (arr: any) => {
              const list = Array.isArray(arr) ? arr : (arr?.data ?? []);
              this.venta = { ...(this.venta || { id }), items: list };
              this.loading = false;
            },
            error: (_e) => {
              // Último fallback: usar cache local si la venta fue creada desde esta UI
              const cached = this.sales.cachedItems(id);
              if (cached) {
                this.venta = { ...(this.venta || { id }), items: cached };
              }
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (e: any) => { this.error = e?.status === 404 ? 'Venta no encontrada' : 'Error al cargar detalle'; this.loading = false; }
    });
  }

  total(): number {
    const items = this.venta?.items ?? [];
    return items.reduce((acc: number, it: any) => acc + Number(it.price ?? 0) * Number(it.quantity ?? 0), 0);
  }

  nameFor(it: any): string {
    return it?.product?.name || it?.productName || this.productosIdx.get(it?.productId || -1)?.name || `ID ${it?.productId ?? ''}`;
  }
}
