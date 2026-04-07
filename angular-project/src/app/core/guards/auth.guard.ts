// ===============================================
// Guards & Interceptors
// ===============================================

// ─── auth.guard.ts ───
import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const requiredPermission = route.data['permission'];
    if (requiredPermission && !this.authService.hasPermission(requiredPermission)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.canActivate(route);
  }
}

export { AuthGuard as authGuard };
