// =============================================
// Angular Permission Guard - حارس الصلاحيات
// يتحقق من صلاحية المستخدم قبل الدخول للصفحة
// =============================================
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, map, catchError } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const requiredPermission = route.data?.['permission'];
    if (!requiredPermission) return true;

    const user = this.auth.currentUser;
    if (!user) { this.router.navigate(['/login']); return false; }

    // Admin يمكنه الدخول لكل شيء
    if (user.role === 'admin' || user.statu === 1) return true;

    return this.api.get(`permissions/users/${user.nou}`).pipe(
      map((res: any) => {
        const perms: string[] = (res.data || []).map((p: any) => `${p.p_module}.${p.p_action}`);
        if (perms.includes(requiredPermission)) return true;
        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError(() => { this.router.navigate(['/unauthorized']); return of(false); })
    );
  }
}
