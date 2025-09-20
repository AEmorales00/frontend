import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory';
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class InventoryComponent implements OnInit {
  formularioInventario: FormGroup;
  inventario: any[] = [];
  editando: any | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alerts: AlertService
  ) {
    this.formularioInventario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      cantidad: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.inventoryService.getInventory().subscribe({
      next: (datos: any) => this.inventario = datos,
      error: (err: any) => console.error('Error al obtener inventario:', err)
    });
  }

  guardarInventario(): void {
    if (this.formularioInventario.invalid) return;

    const formData = this.formularioInventario.value;
    this.inventoryService.createInventory({
      name: formData.nombre,
      description: formData.descripcion,
      quantity: formData.cantidad,
    }).subscribe({
      next: (response: any) => {
        this.alerts.success('Inventario guardado');
        this.formularioInventario.reset({ cantidad: 0 });
        this.cargarInventario(); // Recargar inventario después de guardar
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.alerts.error('Error al guardar inventario');
      }
    });
  }

  editarInventario(item: any): void {
    // clonamos para no tocar la fila original
    this.editando = { ...item };
    console.log('Editar:', this.editando);
  }

  guardarCambios(): void {
    if (!this.editando) return;
    const { id, name, description, quantity } = this.editando;
    this.inventoryService.updateInventory(id, { name, description, quantity }).subscribe({
      next: (_: any) => {
        this.editando = null;
        this.cargarInventario();
      },
      error: (err: any) => console.error('Error al actualizar:', err)
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  async eliminarInventario(id: number): Promise<void> {
    const ok = await this.alerts.confirm('¿Eliminar este registro?');
    if (!ok) return;
    this.inventoryService.eliminarInventario(id).subscribe({
      next: (_: any) => this.cargarInventario(),
      error: (err: any) => console.error('Error al eliminar:', err)
    });
  }
}
