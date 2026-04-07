// ===============================================
// HTTP Interceptors
// ===============================================
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'ar',
          'Content-Type': req.headers.get('Content-Type') || 'application/json'
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }
        return throwError(() => error);
      })
    );
  }
}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.activeRequests++;
    // يمكن إضافة خدمة تحميل هنا
    return next.handle(req).pipe(
      catchError(error => {
        this.activeRequests--;
        return throwError(() => error);
      })
    );
  }
}
