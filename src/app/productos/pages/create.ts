import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './create.html',
  styleUrls: ['./create.scss']
})
export class Create {
  loading = false;
  error = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private products: ProductsService, private router: Router) {
    this.form = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      barcode:     [''],                       // opcional
      price:       [0,  [Validators.required, Validators.min(0)]],
      stock:       [0,  [Validators.required, Validators.min(0)]],
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';

    // adapta las claves a tu backend si usa quantity vs stock
    const payload = {
      name: this.form.value.name!,
      description: this.form.value.description || '',
      barcode: this.form.value.barcode || null,
      price: Number(this.form.value.price),
      quantity: Number(this.form.value.stock)   // <- si tu API espera "quantity"
      // stock: Number(this.form.value.stock)   // <- si tu API espera "stock"
    };

    this.products.create(payload).subscribe({
      next: () => {
        alert('Producto creado ✔');
        this.router.navigateByUrl('/productos');
      },
      error: (e: any) => {
        this.error = e?.error?.message || 'No se pudo crear el producto';
        this.loading = false;
      }
    });
  }

  get f() { 
    return {
      name: this.form.controls['name'],
      description: this.form.controls['description'],
      barcode: this.form.controls['barcode'],
      price: this.form.controls['price'],
      stock: this.form.controls['stock']
    };
  }
}