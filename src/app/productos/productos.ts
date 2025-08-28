import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../core/services/products.service';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class Productos implements OnInit {
  productos: any[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productsService.list().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productsService.remove(id).subscribe({
        next: () => {
          this.loadProductos(); // Reload the list
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }
}
