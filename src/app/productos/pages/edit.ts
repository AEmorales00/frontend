import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, Product } from '../../core/services/products.service';
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-product-edit',
  standalone: false,
  templateUrl: './edit.html',
  styleUrls: ['./edit.scss']
})
export class Edit implements OnInit {
  loading = false;
  loadingData = true;
  error = '';
  id!: number;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private products: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private alerts: AlertService
  ) {
    this.form = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      barcode:     [''],
      price:       [0,  [Validators.required, Validators.min(0)]],
      stock:       [0,  [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.products.get(this.id).subscribe({
      next: (p: Product) => {
        // Ajusta estas claves a lo que te devuelve tu API
        this.form.patchValue({
          name: p.name,
          description: p.description || '',
          barcode: p.barcode || '',
          price: Number(p.price),
          stock: (p as any).stock ?? (p as any).quantity ?? 0
        });
        this.loadingData = false;
      },
      error: (e: any) => {
        this.error = e?.status === 404 ? 'Producto no encontrado' : (e?.error?.message || 'No se pudo cargar el producto');
        this.loadingData = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';

    // Payload esperado por la API
    const payload: any = {
      name: this.form.value.name!,
      price: Number(this.form.value.price),
      stock: Math.trunc(Number(this.form.value.stock))
    };
    const desc = (this.form.value.description || '').trim();
    const code = (this.form.value.barcode || '').trim();
    if (desc) payload.description = desc;
    if (code) payload.barcode = code;

    this.products.update(this.id, payload).subscribe({
      next: () => {
        this.alerts.success('Producto actualizado ✔');
        this.router.navigateByUrl('/productos');
      },
      error: (e: any) => { this.error = e?.error?.message || 'No se pudo actualizar'; this.loading = false; }
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
