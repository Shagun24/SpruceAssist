import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferredName?: string;
  mobileNumber?: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginApiResponse {
  token: string;
  expiresAt: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly defaultApiBaseUrl = 'http://localhost:8000/api';
  private readonly fallbackApiBaseUrls = ['http://localhost:8050/api', 'http://localhost:8040/api', 'http://localhost:8030/api'];
  private readonly apiKey = 'dev-api-key-12345';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getApiBaseUrl(): string {
    return localStorage.getItem('spruceassist_api_base_url') || this.defaultApiBaseUrl;
  }

  private setApiBaseUrl(apiBaseUrl: string): void {
    localStorage.setItem('spruceassist_api_base_url', apiBaseUrl);
  }

  private postWithApiFallback<T>(endpoint: string, body: unknown): Observable<T> {
    const preferred = this.getApiBaseUrl();
    const candidates = [
      preferred,
      this.defaultApiBaseUrl,
      ...this.fallbackApiBaseUrls,
    ].filter((value: string, index: number, array: string[]) => array.indexOf(value) === index);

    const tryPost = (index: number): Observable<T> => {
      const baseUrl = candidates[index];

      return this.http
        .post<T>(`${baseUrl}${endpoint}`, body, {
          headers: { 'X-API-Key': this.apiKey },
        })
        .pipe(
          tap(() => this.setApiBaseUrl(baseUrl)),
          catchError((error) => {
            if (index >= candidates.length - 1) {
              return throwError(() => error);
            }
            return tryPost(index + 1);
          })
        );
    };

    return tryPost(0);
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.postWithApiFallback<LoginApiResponse>('/auth/login', credentials)
      .pipe(
        map((response) => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authTokenExpiresAt', response.expiresAt);

          const user = response.user;
          localStorage.setItem('currentUser', JSON.stringify(user));

          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);

          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiresAt');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  updateUserProfile(updates: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}
