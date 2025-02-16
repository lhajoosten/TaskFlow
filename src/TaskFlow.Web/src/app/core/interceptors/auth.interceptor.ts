import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, catchError, switchMap, filter, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🚀 HTTP Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers.keys(),
      body: request.body,
    });

    // Don't add token for auth endpoints except logout
    if (request.url.includes('/api/auth/') && !request.url.includes('/api/auth/logout')) {
      return next.handle(request).pipe(
        tap({
          next: (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('✅ Response:', {
                status: event.status,
                body: event.body,
              });
            }
          },
          error: (error) => {
            console.error('❌ Error:', {
              status: error.status,
              message: error.message,
              error: error.error,
            });
          },
        }),
      );
    }

    let token: string | null = null;
    this.authService.token$.pipe(take(1)).subscribe((t) => (token = t));

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }
          // Handle other errors
          if (error.status === 403) {
            this.router.navigate(['/auth/login']);
          }
        }
        return throwError(() => error);
      }),
      tap({
        next: (event) => console.log('✅ Response:', event),
        error: (error) => console.error('❌ Error:', error),
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          let token: string | null = null;
          this.authService.token$.pipe(take(1)).subscribe((t) => (token = t));
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token!));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        }),
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token))),
    );
  }
}
