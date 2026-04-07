// ===============================================
// صفحة تسجيل الدخول (Login Component)
// ===============================================
import { Component, signal } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
],
    template: `
    <div class="login-container">
      <div class="login-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <mat-card class="login-card" dir="rtl">
        <div class="login-header">
          <div class="logo-container">
            <mat-icon class="logo-icon">bolt</mat-icon>
          </div>
          <h1>النظام المحاسبي المتخصص</h1>
          <h2>لتجار الطاقة الكهربائية</h2>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>رقم المستخدم</mat-label>
            <input matInput formControlName="userId" type="number" placeholder="أدخل رقم المستخدم">
            <mat-icon matSuffix>person</mat-icon>
            @if (loginForm.get('userId')?.hasError('required') && loginForm.get('userId')?.touched) {
              <mat-error>رقم المستخدم مطلوب</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>كلمة السر</mat-label>
            <input matInput formControlName="password" 
                   [type]="hidePassword() ? 'password' : 'text'" 
                   placeholder="أدخل كلمة السر">
            <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())" type="button">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
              <mat-error>كلمة السر مطلوبة</mat-error>
            }
          </mat-form-field>

          @if (errorMessage()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="loginForm.invalid || isLoading()" 
                  class="login-button">
            @if (isLoading()) {
              <mat-spinner diameter="24"></mat-spinner>
            } @else {
              <mat-icon>login</mat-icon>
            }
            <span>تسجيل الدخول</span>
          </button>
        </form>

        <div class="login-footer">
          <p>النظام المحاسبي المتخصص © {{ currentYear }}</p>
        </div>
      </mat-card>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 30%, #01579b 60%, #006064 100%);
      z-index: 0;
    }

    .floating-shapes .shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
      background: white;
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 { width: 300px; height: 300px; top: -100px; right: -50px; animation-delay: 0s; }
    .shape-2 { width: 200px; height: 200px; bottom: -50px; left: -30px; animation-delay: 2s; }
    .shape-3 { width: 150px; height: 150px; top: 50%; left: 50%; animation-delay: 4s; }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }

    .login-card {
      z-index: 1;
      width: 420px;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      background: rgba(255,255,255,0.95);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-container {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffd600, #ff6f00);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 20px rgba(255, 152, 0, 0.4);
    }

    .logo-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #1a237e;
      margin: 8px 0 4px;
    }

    h2 {
      font-size: 16px;
      font-weight: 400;
      color: #546e7a;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .full-width { width: 100%; }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #ffebee;
      border-radius: 8px;
      color: #c62828;
      font-size: 14px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      border-radius: 12px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .login-footer {
      text-align: center;
      margin-top: 24px;
      color: #9e9e9e;
      font-size: 12px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'خطأ في بيانات الدخول');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('رقم المستخدم أو كلمة السر غير صحيحة');
      }
    });
  }
}
