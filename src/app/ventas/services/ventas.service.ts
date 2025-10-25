import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { ProductsService, Product } from '../../core/services/products.service';
import { SalesService } from '../../core/services/sales.service';

export interface Producto {
  id: number;
  name: string;
  description?: string;
  barcode?: string | null;
  price: number;
  stock: number;
}

export interface SaleItemDTO {
  productId: number;
  quantity: number;
  price: number;       // unitario
  subtotal: number;    // price * quantity
}

export interface CreateSaleDTO { items: SaleItemDTO[]; notes?: string; }

export interface Sale {
  id: number;
  total: number;
  createdAt: string;
  userName?: string;
  items: Array<{ name?: string; price?: number; quantity?: number; subtotal?: number }>;
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private api = (environment as any).api ?? (environment as any).apiBase;

  constructor(
    private http: HttpClient,
    private products: ProductsService,
    private sales: SalesService
  ) {}

  buscarProductos(q: string, limit = 20) {
    const term = (q || '').toLowerCase();
    return this.products.list().pipe(
      map(arr => arr.filter(p => (p.name || '').toLowerCase().includes(term)).slice(0, limit)),
      map(arr => arr.map(this.mapProducto))
    );
  }

  listarProductos(limit = 50) {
    return this.products.list().pipe(
      map(arr => arr.slice(0, limit)),
      map(arr => arr.map(this.mapProducto))
    );
  }

  crearVenta(dto: CreateSaleDTO) {
    // Adapt to existing SalesService.create signature
    const payload = {
      items: dto.items.map(it => ({ productId: it.productId, quantity: it.quantity, price: it.price }))
    };
    return this.sales.create(payload);
  }

  listarVentas(opts: { from?: string; to?: string; page?: number; limit?: number } = {}) {
    return this.sales.list().pipe(
      map((res: any) => {
        const data = Array.isArray(res) ? res : (res?.data ?? []);
        return { data: data as Sale[], total: data.length };
      })
    );
  }

  private mapProducto(p: Product): Producto {
    return {
      id: p.id!,
      name: p.name,
      description: p.description,
      barcode: p.barcode ?? null,
      price: Number(p.price ?? 0),
      stock: Number(p.stock ?? p.quantity ?? 0)
    };
  }
}

