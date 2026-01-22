import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, DashboardData } from '../../../../services/finance.service';
import { ChatTabComponent } from '../chat-tab/chat-tab.component';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule, ChatTabComponent],
  templateUrl: './overview-tab.component.html',
  styleUrls: ['./overview-tab.component.scss'],
})
export class OverviewTabComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.financeService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  }
}
