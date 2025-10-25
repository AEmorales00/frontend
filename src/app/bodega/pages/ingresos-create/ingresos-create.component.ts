import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../services/warehouse.service';
import { ProductsService, Product } from '../../../core/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresos-create',
  templateUrl: './ingresos-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class IngresosCreateComponent {
  loading = false;
  error?: string;
  foundProducts: Product[] = [];
  cacheProducts: Product[] | null = null;
  form!: ReturnType<typeof this.createForm>;

  get items() { return this.form.get('items') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private wh: WarehouseService,
    private products: ProductsService,
    private router: Router
  ) {
    this.form = this.createForm();
    this.addItem();
  }

  private createForm() {
    return this.fb.group({
      supplierId: this.fb.control<number | null>(null),
      note: this.fb.control<string>(''),
      items: this.fb.array([])
    });
  }

  addItem() {
    this.items.push(this.fb.group({
      productId: [null, Validators.required],
      productName: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitCost: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  private ensureCache(cb: () => void) {
    if (this.cacheProducts) { cb(); return; }
    this.products.list().subscribe({
      next: list => { this.cacheProducts = list; cb(); },
      error: () => { this.cacheProducts = []; cb(); }
    });
  }

  search(i: number, term: string) {
    if (!term || term.length < 2) { this.foundProducts = []; return; }
    this.ensureCache(() => {
      const q = term.toLowerCase();
      this.foundProducts = (this.cacheProducts || []).filter(p => (p.name || '').toLowerCase().includes(q));
    });
  }

  pickProduct(i: number, p: Product) {
    const g = this.items.at(i);
    g.patchValue({ productId: p.id, productName: p.name, unitCost: p.price ?? 0 });
    this.foundProducts = [];
  }

  get total() {
    return this.items.value.reduce((acc: number, it: any) => acc + (Number(it?.quantity)||0) * (Number(it?.unitCost)||0), 0);
  }

  submit() {
    this.error = undefined;
    if (this.form.invalid || this.items.length === 0) {
      this.error = 'Completa al menos un ítem válido.';
      return;
    }
    const payload = {
      supplierId: this.form.value.supplierId ?? undefined,
      note: this.form.value.note ?? '',
      items: this.items.value.map((it: any) => ({
        productId: Number(it.productId),
        quantity: Number(it.quantity),
        unitCost: Number(it.unitCost)
      }))
    };

    this.loading = true;
    this.wh.createPurchase(payload).subscribe({
      next: _ => { this.loading = false; this.router.navigate(['/bodega/ingresos']); },
      error: err => { this.loading = false; this.error = err?.error?.message || 'Error al guardar'; }
    });
  }
}

