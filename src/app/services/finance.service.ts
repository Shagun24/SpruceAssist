import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

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
  weeklyIncome: number;
  weeklyExpense: number;
  lastMonthNetRevenue: number;
  revenueFlow: { label: string; net: number; netPercent: number; year: number; month: number }[];
  transactions: Transaction[];
  expenseSplit: { category: string; amount: number; percentage: number }[];
}

interface RawTransaction {
  transaction_id: string;
  user_id: string;
  date: string;
  category: string;
  direction: 'credit' | 'debit';
  amount: number;
  current_balance: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
}

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private http: HttpClient) {}

  private loadRawTransactions(): Observable<RawTransaction[]> {
    return this.http
      .get<RawTransaction[]>('assets/mock-data/transactions.json')
      .pipe(delay(200));
  }

  getDashboardData(): Observable<DashboardData> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.loadRawTransactions().pipe(
      map((raw) => {
        // assume data is ordered by date ascending; if not, sort
        const sorted = [...raw].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const totalBalance = sorted.length
          ? sorted[sorted.length - 1].current_balance
          : 0;

        const transactions: Transaction[] = sorted.map((t): Transaction => ({
          id: t.transaction_id,
          type: (t.direction === 'credit' ? 'income' : 'expense') as
            | 'income'
            | 'expense',
          description: t.description,
          amount: t.amount,
          date: new Date(t.date),
          status: t.status,
          category: t.category,
        }));

        const currentMonthTx = sorted.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const monthlyIncome = currentMonthTx
          .filter((t) => t.direction === 'credit')
          .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpense = currentMonthTx
          .filter((t) => t.direction === 'debit')
          .reduce((sum, t) => sum + t.amount, 0);

        // Weekly income/expense: last 7 days including today
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const weekTx = sorted.filter((t) => {
          const d = new Date(t.date);
          return d >= oneWeekAgo && d <= now;
        });

        const weeklyIncome = weekTx
          .filter((t) => t.direction === 'credit')
          .reduce((sum, t) => sum + t.amount, 0);

        const weeklyExpense = weekTx
          .filter((t) => t.direction === 'debit')
          .reduce((sum, t) => sum + t.amount, 0);

        // Last month net revenue (income - expense)
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        const lastMonthTx = sorted.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
        });

        const lastMonthIncome = lastMonthTx
          .filter((t) => t.direction === 'credit')
          .reduce((sum, t) => sum + t.amount, 0);

        const lastMonthExpense = lastMonthTx
          .filter((t) => t.direction === 'debit')
          .reduce((sum, t) => sum + t.amount, 0);

        const lastMonthNetRevenue = lastMonthIncome - lastMonthExpense;

        const expenseByCategoryMap = new Map<string, number>();
        currentMonthTx
          .filter((t) => t.direction === 'debit')
          .forEach((t) => {
            expenseByCategoryMap.set(
              t.category,
              (expenseByCategoryMap.get(t.category) || 0) + t.amount
            );
          });

        const expenseSplitArray = Array.from(expenseByCategoryMap.entries()).map(
          ([category, amount]) => ({ category, amount })
        );

        const totalExpenseForSplit = expenseSplitArray.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        const expenseSplit = expenseSplitArray.map((item) => ({
          category: item.category,
          amount: item.amount,
          percentage: totalExpenseForSplit
            ? Math.round((item.amount / totalExpenseForSplit) * 100)
            : 0,
        }));

        // Revenue flow for last 6 months (including current), by month net
        const revenueFlowRaw: { label: string; net: number; year: number; month: number }[] = [];

        for (let i = 5; i >= 0; i--) {
          const dateForMonth = new Date(currentYear, currentMonth - i, 1);
          const m = dateForMonth.getMonth();
          const y = dateForMonth.getFullYear();

          const monthTx = sorted.filter((t) => {
            const d = new Date(t.date);
            return d.getMonth() === m && d.getFullYear() === y;
          });

          const monthIncome = monthTx
            .filter((t) => t.direction === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

          const monthExpense = monthTx
            .filter((t) => t.direction === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

          const net = monthIncome - monthExpense;
          const label = dateForMonth.toLocaleString('en-US', { month: 'short' });

          revenueFlowRaw.push({ label, net, year: y, month: m });
        }

        const maxAbsNet = revenueFlowRaw.reduce(
          (max, item) => Math.max(max, Math.abs(item.net)),
          0
        );

        const revenueFlow = revenueFlowRaw.map((item) => ({
          label: item.label,
          net: item.net,
          netPercent: maxAbsNet ? Math.round((Math.abs(item.net) / maxAbsNet) * 100) : 0,
          year: item.year,
          month: item.month,
        }));

        return {
          totalBalance,
          monthlyIncome,
          monthlyExpense,
          weeklyIncome,
          weeklyExpense,
          lastMonthNetRevenue,
          revenueFlow,
          transactions,
          expenseSplit,
        };
      })
    );
  }

  getTransactions(): Observable<Transaction[]> {
    return this.loadRawTransactions().pipe(
      map((raw) =>
        raw
          .map((t): Transaction => ({
            id: t.transaction_id,
            type: (t.direction === 'credit' ? 'income' : 'expense') as
              | 'income'
              | 'expense',
            description: t.description,
            amount: t.amount,
            date: new Date(t.date),
            status: t.status,
            category: t.category,
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime())
      )
    );
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    // For now, simply echo back the transaction as a mock behavior.
    return new Observable((observer) => {
      setTimeout(() => {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        };
        observer.next(newTransaction);
        observer.complete();
      }, 500);
    });
  }
}
