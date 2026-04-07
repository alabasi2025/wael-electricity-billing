// ===============================================
// خدمة المصادقة (Authentication Service)
// ===============================================
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  userId: number;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Signals for reactive state
  isLoggedIn = signal(false);
  currentUser = signal<User | null>(null);
  userPermissions = signal<string[]>([]);
  
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
      this.isLoggedIn.set(true);
      const perms = JSON.parse(localStorage.getItem('permissions') || '[]');
      this.userPermissions.set(perms);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            const { user, token, permissions } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('permissions', JSON.stringify(permissions));
            this.currentUser.set(user);
            this.currentUserSubject.next(user);
            this.isLoggedIn.set(true);
            this.userPermissions.set(permissions);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('permissions');
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isLoggedIn.set(false);
    this.userPermissions.set([]);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions().includes(permission);
  }

  changePassword(oldPass: string, newPass: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/change-password`, {
      oldPassword: oldPass,
      newPassword: newPass
    });
  }
}
