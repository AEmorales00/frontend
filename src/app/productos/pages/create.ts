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

    // Payload esperado por la API: name, description, barcode, price, stock
    const payload: any = {
      name: this.form.value.name!,
      price: Number(this.form.value.price),
      stock: Math.trunc(Number(this.form.value.stock))
    };
    const desc = (this.form.value.description || '').trim();
    const code = (this.form.value.barcode || '').trim();
    if (desc) payload.description = desc;
    if (code) payload.barcode = code;

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
