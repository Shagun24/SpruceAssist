import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(credentials: LoginCredentials): Observable<User> {
    return new Observable((observer) => {
      // Simulate login delay
      setTimeout(() => {
        const user: User = {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.email,
        };

        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);

        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}
