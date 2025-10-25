import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../services/warehouse.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresos-list',
  templateUrl: './ingresos-list.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class IngresosListComponent implements OnInit {
  loading = true;
  data: any[] = [];
  error?: string;

  constructor(private wh: WarehouseService, private router: Router) {}

  ngOnInit(): void {
    this.wh.listPurchases().subscribe({
      next: res => { this.data = res || []; this.loading = false; },
      error: _ => { this.error = 'No se pudieron cargar los ingresos'; this.loading = false; }
    });
  }
}

