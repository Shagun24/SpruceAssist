import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: Date;
  status: 'success' | 'pending' | 'failed';
  category: string;
}

export interface BudgetItem {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
}

export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  transactions: Transaction[];
  expenseSplit: { category: string; amount: number; percentage: number }[];
  budgets: BudgetItem[];
}

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private mockData: DashboardData = {
    totalBalance: 24580.5,
    monthlyIncome: 8500,
    monthlyExpense: 3200,
    transactions: [
      {
        id: '1',
        type: 'income',
        description: 'Salary Deposit',
        amount: 8500,
        date: new Date(2026, 0, 15),
        status: 'success',
        category: 'Salary',
      },
      {
        id: '2',
        type: 'expense',
        description: 'Grocery Store',
        amount: 250,
        date: new Date(2026, 0, 18),
        status: 'success',
        category: 'Food & Dining',
      },
      {
        id: '3',
        type: 'expense',
        description: 'Electric Bill',
        amount: 120,
        date: new Date(2026, 0, 19),
        status: 'success',
        category: 'Utilities',
      },
      {
        id: '4',
        type: 'expense',
        description: 'Restaurant',
        amount: 85.5,
        date: new Date(2026, 0, 20),
        status: 'success',
        category: 'Food & Dining',
      },
      {
        id: '5',
        type: 'income',
        description: 'Freelance Project',
        amount: 1200,
        date: new Date(2026, 0, 21),
        status: 'pending',
        category: 'Freelance',
      },
      {
        id: '6',
        type: 'expense',
        description: 'Online Shopping',
        amount: 450,
        date: new Date(2026, 0, 21),
        status: 'success',
        category: 'Shopping',
      },
      {
        id: '7',
        type: 'expense',
        description: 'Gas Station',
        amount: 75,
        date: new Date(2026, 0, 21),
        status: 'success',
        category: 'Transport',
      },
      {
        id: '8',
        type: 'expense',
        description: 'Gym Membership',
        amount: 50,
        date: new Date(2026, 0, 21),
        status: 'success',
        category: 'Health & Fitness',
      },
    ],
    expenseSplit: [
      { category: 'Food & Dining', amount: 335.5, percentage: 31 },
      { category: 'Utilities', amount: 120, percentage: 11 },
      { category: 'Shopping', amount: 450, percentage: 42 },
      { category: 'Transport', amount: 75, percentage: 7 },
      { category: 'Health & Fitness', amount: 50, percentage: 5 },
    ],
    budgets: [
      { category: 'Dining', limit: 500, spent: 380, percentage: 76 },
      { category: 'Bills', limit: 1200, spent: 950, percentage: 79 },
      { category: 'Shopping', limit: 350, spent: 290, percentage: 83 },
      { category: 'Transport', limit: 300, spent: 180, percentage: 60 },
      { category: 'Entertainment', limit: 200, spent: 145, percentage: 73 },
    ],
  };

  constructor() {}

  getDashboardData(): Observable<DashboardData> {
    return of(this.mockData).pipe(delay(500));
  }

  getTransactions(): Observable<Transaction[]> {
    return of(this.mockData.transactions).pipe(delay(400));
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return new Observable((observer) => {
      setTimeout(() => {
        const newTransaction: Transaction = {
          ...transaction,
          id: String(this.mockData.transactions.length + 1),
        };
        this.mockData.transactions.unshift(newTransaction);
        observer.next(newTransaction);
        observer.complete();
      }, 500);
    });
  }
}
