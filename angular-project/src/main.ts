// ===============================================
// Angular App Configuration (main.ts)
// ===============================================
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, provideZoneChangeDetection } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
