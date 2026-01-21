import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .get<any[]>('assets/mock-data/users.json')
      .pipe(
        map((users) => {
          const matched = users.find(
            (u) =>
              u.email_id === credentials.email &&
              u.login_password === credentials.password &&
              (u.is_active === undefined || u.is_active === true)
          );

          if (!matched) {
            throw new Error('Invalid credentials');
          }

          const name =
            matched.preferred_name ||
            [matched.first_name, matched.last_name].filter(Boolean).join(' ') ||
            credentials.email;

          const user: User = {
            id: matched.user_id ?? '1',
            name,
            email: matched.email_id ?? credentials.email,
            avatar:
              'https://api.dicebear.com/7.x/avataaars/svg?seed=' +
              (matched.email_id ?? credentials.email),
          };

          localStorage.setItem('authToken', 'mock-token-' + Date.now());
          localStorage.setItem('currentUser', JSON.stringify(user));

          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);

          return user;
        })
      );
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
