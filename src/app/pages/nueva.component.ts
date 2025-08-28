import { Component, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../core/services/products.service';
import { SalesService } from '../core/services/sales.service';
import { BrowserMultiFormatReader } from '@zxing/browser';

type CartItem = { product: Product; quantity: number; subtotal: number };

@Component({
  selector: 'app-venta-nueva',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.scss']
})
export class NuevaComponent implements OnDestroy {
  reader = new BrowserMultiFormatReader();
  scanning = false;
  controls: any = null;

  barcodeManual = '';
  cantidad = 1;

  cart: CartItem[] = [];
  total = 0;

  constructor(private products: ProductsService, private sales: SalesService) {}

  ngOnDestroy(): void { this.stopScan(); }

  async startScan() {
    this.scanning = true;
    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId; // puedes elegir la trasera
      this.controls = await this.reader.decodeFromVideoDevice(deviceId, 'video-preview', (result) => {
        if (result) {
          const code = result.getText();
          this.onBarcode(code);
          this.stopScan(); // si quieres lectura continua, comenta esta línea
        }
      });
    } catch (error) {
      console.error('Error starting scan:', error);
      this.scanning = false;
    }
  }

  stopScan() { 
    try { 
      if (this.controls) {
        this.controls.stop();
        this.controls = null;
      }
    } catch (error) {
      console.error('Error stopping scan:', error);
    } 
    this.scanning = false; 
  }

  onBarcode(code: string) {
    this.products.getByBarcode(code).subscribe({
      next: (p: Product) => this.addToCart(p, this.cantidad || 1),
      error: () => alert(`Código ${code} no encontrado`)
    });
  }

  buscarManual() {
    if (!this.barcodeManual) return;
    this.onBarcode(this.barcodeManual.trim());
    this.barcodeManual = '';
    this.cantidad = 1;
  }

  addToCart(product: Product, qty: number) {
    const found = this.cart.find(ci => ci.product.id === product.id);
    if (found) {
      found.quantity += qty;
      found.subtotal = Number(found.product.price) * found.quantity;
    } else {
      this.cart.push({ product, quantity: qty, subtotal: Number(product.price) * qty });
    }
    this.recalc();
  }

  changeQty(i: number, qty: number | Event) {
    const quantity = typeof qty === 'number' ? qty : Number((qty.target as HTMLInputElement).value);
    if (quantity <= 0) return this.remove(i);
    this.cart[i].quantity = quantity;
    this.cart[i].subtotal = Number(this.cart[i].product.price) * quantity;
    this.recalc();
  }

  remove(i: number) { this.cart.splice(i, 1); this.recalc(); }
  recalc() { this.total = this.cart.reduce((a, it) => a + it.subtotal, 0); }

  confirmarVenta() {
    if (!this.cart.length) return;
    const items = this.cart.map(ci => ({ productId: ci.product.id, quantity: ci.quantity }));
    this.sales.create({ items }).subscribe({
      next: (_: any) => { alert('Venta registrada ✔'); this.cart = []; this.total = 0; },
      error: (e: any) => alert('Error al crear venta: ' + (e?.error?.message || ''))
    });
  }
}