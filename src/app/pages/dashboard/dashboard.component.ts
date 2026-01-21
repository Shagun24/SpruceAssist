import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { OverviewTabComponent } from './components/overview-tab/overview-tab.component';
import { TransactionsTabComponent } from './components/transactions-tab/transactions-tab.component';
import { ChatTabComponent } from './components/chat-tab/chat-tab.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, OverviewTabComponent, TransactionsTabComponent, ChatTabComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: 'overview' | 'transactions' | 'chat' = 'overview';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  setActiveTab(tab: 'overview' | 'transactions' | 'chat'): void {
    this.activeTab = tab;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
