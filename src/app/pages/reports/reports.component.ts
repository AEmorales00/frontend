import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ReportsService } from '../../shared/services/reports.service';

@Component({ 
  selector: 'app-reports', 
  templateUrl: './reports.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ReportsComponent implements OnInit {
  loading = true; err = '';
  kpis: any = { today: {}, month: {} };
  series: { labels: string[]; revenue: number[]; margin: number[] } = { labels: [], revenue: [], margin: [] };
  top: any[] = []; sellers: any[] = []; low: any[] = [];

  constructor(private api: ReportsService) {}
  ngOnInit() {
    forkJoin({
      kpis: this.api.overview(),
      byDay: this.api.salesByDay(),
      top: this.api.topProducts(),
      sellers: this.api.salesBySeller(),
      low: this.api.lowStock()
    }).subscribe({
      next: ({ kpis, byDay, top, sellers, low }) => {
        this.kpis = kpis;
        this.series.labels = (byDay || []).map((d: any) => new Date(d.date).toLocaleDateString());
        this.series.revenue = (byDay || []).map((d: any) => d.revenue);
        this.series.margin = (byDay || []).map((d: any) => d.margin);
        this.top = top || [];
        this.sellers = sellers || [];
        this.low = low || [];
        this.loading = false;
      },
      error: () => { this.err = 'No se pudieron cargar los reportes'; this.loading = false; }
    });
  }
}

