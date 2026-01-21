import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, Transaction } from '../../../../services/finance.service';

@Component({
  selector: 'app-transactions-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions-tab.component.html',
  styleUrls: ['./transactions-tab.component.scss'],
})
export class TransactionsTabComponent implements OnInit {
  transactions: Transaction[] = [];
  isLoading = true;
  sortBy: 'date' | 'amount' = 'date';
  filterType: 'all' | 'income' | 'expense' = 'all';

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.financeService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
    });
  }

  getFilteredTransactions(): Transaction[] {
    let filtered = this.transactions;

    if (this.filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === this.filterType);
    }

    if (this.sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (this.sortBy === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    return filtered;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }

  setFilter(type: 'all' | 'income' | 'expense'): void {
    this.filterType = type;
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value as 'date' | 'amount';
  }

  setSortBy(sortBy: 'date' | 'amount'): void {
    this.sortBy = sortBy;
  }
}
