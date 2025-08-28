import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../../core/services/products.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  loading = false;
  error: string | null = null;
  productos: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productsService.list().subscribe({
      next: (products) => {
        this.productos = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productsService.remove(id).subscribe({
        next: () => {
          // Remove the product from the local array
          this.productos = this.productos.filter(p => p.id !== id);
        },
        error: (err) => {
          alert('Error al eliminar el producto');
          console.error('Error deleting product:', err);
        }
      });
    }
  }
}
