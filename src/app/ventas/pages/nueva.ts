import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService, Product } from '../../core/services/products.service';
import { SalesService } from '../../core/services/sales.service';
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-nueva',
  standalone: false,
  templateUrl: './nueva.html',
  styleUrl: './nueva.scss'
})
export class Nueva implements OnInit {
  productos: Product[] = [];
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private salesService: SalesService,
    private alerts: AlertService
  ) {
    this.form = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.productsService.list().subscribe({
      next: (prods) => {
        this.productos = prods;
        if (this.items.length === 0) this.addItem();
      },
      error: (e) => {
        console.error('Error cargando productos', e);
        this.error = 'No se pudieron cargar los productos';
      }
    });
  }

  get items(): FormArray<FormGroup> { return this.form.get('items') as FormArray<FormGroup>; }

  addItem(): void {
    this.items.push(this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [null] // opcional; si no se envía, backend usa price del producto
    }));
  }

  removeItem(i: number): void {
    this.items.removeAt(i);
    if (this.items.length === 0) this.addItem();
  }

  productById(id: number | null): Product | undefined {
    return this.productos.find(p => p.id === id!);
  }

  onProductChange(i: number): void {
    const g = this.items.at(i) as FormGroup;
    // Si no hay precio manual, rellena con el del producto seleccionado
    const prod = this.productById(g.value.productId);
    if (prod && (g.value.price == null || g.value.price === '')) {
      g.patchValue({ price: prod.price ?? null }, { emitEvent: false });
    }
  }

  itemPrice(i: number): number {
    const g = this.items.at(i) as FormGroup;
    const manual = g.value.price;
    if (manual != null && manual !== '') return Number(manual);
    const prod = this.productById(g.value.productId);
    return Number(prod?.price ?? 0);
  }

  lineTotal(i: number): number {
    const g = this.items.at(i) as FormGroup;
    const price = this.itemPrice(i);
    const qty = Number(g.value.quantity ?? 0);
    return price * qty;
  }

  total(): number {
    return this.items.controls.reduce((acc, _, i) => acc + this.lineTotal(i), 0);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true; this.error = null; this.success = null;
    const payload = {
      items: this.items.value.map((r: any) => ({
        productId: r.productId,
        quantity: Number(r.quantity),
        // price es opcional; si se llenó manualmente lo mandamos
        ...(r.price != null && r.price !== '' ? { price: Number(r.price) } : {})
      }))
    };
    this.salesService.create(payload).subscribe({
      next: () => {
        this.alerts.success('Venta registrada correctamente');
        this.success = null; // evita texto en pantalla; usamos modal
        // reinicia dejando una fila lista
        while (this.items.length) this.items.removeAt(0);
        this.addItem();
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'No se pudo registrar la venta';
        this.loading = false;
      }
    });
  }
}
