import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, DashboardData } from '../../../../services/finance.service';
import { ChatTabComponent } from '../chat-tab/chat-tab.component';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-tab.component.html',
  styleUrls: ['./overview-tab.component.scss'],
})
export class OverviewTabComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;
  donutSegments: { color: string; dashArray: string; dashOffset: number }[] = [];
  monthOptions: { label: string; value: string; year: number; month: number }[] = [];
  selectedMonthKey: string | null = null;
  selectedExpenseSplit: { category: string; amount: number; percentage: number }[] = [];
  selectedMonthlyExpense = 0;

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.financeService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.dashboardData = data;
        this.buildMonthOptionsAndSelectDefault(data);
        this.recalculateForSelectedMonth();
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

  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedMonthKey = target.value;
    this.recalculateForSelectedMonth();
  }

  private buildDonutSegments(
    expenseSplit: { category: string; amount: number; percentage: number }[]
  ): { color: string; dashArray: string; dashOffset: number }[] {
    if (!expenseSplit || !expenseSplit.length) {
      return [];
    }

    const CIRCUMFERENCE = 377; // matches existing SVG dasharray base

    const sorted = [...expenseSplit].sort((a, b) => b.amount - a.amount);
    const top = sorted.slice(0, 6);

    let accumulated = 0;

    return top.map((item) => {
      const segmentLength = (CIRCUMFERENCE * item.percentage) / 100;
      const dashArray = `${segmentLength} ${CIRCUMFERENCE - segmentLength}`;
      const dashOffset = -accumulated;
      accumulated += segmentLength;

      return {
        color: this.getCategoryColor(item.category),
        dashArray,
        dashOffset,
      };
    });
  }

  private buildMonthOptionsAndSelectDefault(data: DashboardData): void {
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const monthMap = new Map<string, { year: number; month: number }>();

    data.transactions.forEach((tx) => {
      const d = new Date(tx.date);
      if (d >= oneYearAgo && d <= now) {
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthMap.has(key)) {
          monthMap.set(key, { year: d.getFullYear(), month: d.getMonth() });
        }
      }
    });

    const entries = Array.from(monthMap.values()).sort((a, b) => {
      if (a.year === b.year) {
        return a.month - b.month;
      }
      return a.year - b.year;
    });

    this.monthOptions = entries.map((m) => ({
      year: m.year,
      month: m.month,
      value: `${m.year}-${m.month}`,
      label: this.formatMonthLabel(m.year, m.month),
    }));

    if (this.monthOptions.length) {
      this.selectedMonthKey = this.monthOptions[this.monthOptions.length - 1].value;
    } else {
      this.selectedMonthKey = null;
    }
  }

  private recalculateForSelectedMonth(): void {
    if (!this.dashboardData || !this.selectedMonthKey) {
      this.selectedExpenseSplit = [];
      this.selectedMonthlyExpense = 0;
      this.donutSegments = [];
      return;
    }

    const selected = this.monthOptions.find((m) => m.value === this.selectedMonthKey);
    if (!selected) {
      this.selectedExpenseSplit = [];
      this.selectedMonthlyExpense = 0;
      this.donutSegments = [];
      return;
    }

    const monthExpenses = this.dashboardData.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === selected.month && d.getFullYear() === selected.year && t.type === 'expense';
    });

    const totalExpense = monthExpenses.reduce((sum, t) => sum + t.amount, 0);

    const byCategory = new Map<string, number>();
    monthExpenses.forEach((t) => {
      byCategory.set(t.category, (byCategory.get(t.category) || 0) + t.amount);
    });

    const splitArray = Array.from(byCategory.entries()).map(([category, amount]) => ({
      category,
      amount,
    }));

    const split = splitArray.map((item) => ({
      category: item.category,
      amount: item.amount,
      percentage: totalExpense ? Math.round((item.amount / totalExpense) * 100) : 0,
    }));

    this.selectedExpenseSplit = split;
    this.selectedMonthlyExpense = totalExpense;
    this.donutSegments = this.buildDonutSegments(split);
  }

  private formatMonthLabel(year: number, month: number): string {
    const date = new Date(year, month, 1);
    const monthStr = date.toLocaleString('en-US', { month: 'short' });
    return `${monthStr},${year}`;
  }

  getCategoryColor(category: string): string {
    const map: { [key: string]: string } = {
      'Food & Dining': '#FFD93D',
      Restaurants: '#FFD93D',
      'Fast Food': '#FFD93D',
      Groceries: '#34D399',
      Entertainment: '#60A5FA',
      'Movies & DVDs': '#60A5FA',
      Vacation: '#A78BFA',
      Transport: '#A78BFA',
      Transportation: '#A78BFA',
      'Public Transportation': '#A78BFA',
      Utilities: '#FBBF24',
      'Mortgage & Rent': '#F472B6',
      'Kids Activities': '#4ADE80',
      Deposit: '#22C55E',
      Salary: '#10B981',
    };

    return map[category] || '#9CA3AF';
  }
}
