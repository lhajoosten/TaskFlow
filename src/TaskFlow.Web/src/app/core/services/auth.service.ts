import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap, throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, ResetPasswordRequest, ForgotPasswordRequest, RefreshTokenRequest } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface User {
    displayName?: string;
    email: string;
    photoURL?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState = new BehaviorSubject<User | null>(null);
    private tokenSubject = new BehaviorSubject<string | null>(null);
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);
    private jwtHelper = new JwtHelperService();

    authState$ = this.authState.asObservable();
    token$ = this.tokenSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Initialize from localStorage
        this.loadStoredAuth();
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.authEndpoints.register}`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const request: LoginRequest = { email, password };
        const url = `${environment.apiUrl}${environment.authEndpoints.login}`;
        console.log('🔑 Login request to:', url, request);

        return this.http.post<AuthResponse>(url, request, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true  // Add this for cookies if needed
        }).pipe(
            tap(response => {
                console.log('🔑 Login response:', response);
                this.handleAuthResponse(response);
            }),
            catchError(error => {
                console.error('🔑 Login error:', error);
                return throwError(() => error);
            })
        );
    }

    logout(): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.authEndpoints.logout}`, {})
            .pipe(tap(() => {
                this.clearAuth();
                this.router.navigate(['/auth/login']);
            }));
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.refreshTokenSubject.value;
        if (!refreshToken) return throwError(() => new Error('No refresh token available'));

        const request: RefreshTokenRequest = { refreshToken };
        return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.authEndpoints.refreshToken}`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    forgotPassword(email: string): Observable<AuthResponse> {
        const request: ForgotPasswordRequest = { email };
        return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.authEndpoints.forgotPassword}`, request);
    }

    resetPassword(email: string, token: string, newPassword: string): Observable<AuthResponse> {
        const request: ResetPasswordRequest = { email, token, newPassword };
        return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.authEndpoints.resetPassword}`, request);
    }

    confirmEmail(email: string, token: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${environment.apiUrl}${environment.authEndpoints.confirmEmail}`,
            null,
            { params: { email, token } }
        );
    }

    private handleAuthResponse(response: AuthResponse): void {
        if (response.token) {
            // Store tokens
            this.tokenSubject.next(response.token);
            this.refreshTokenSubject.next(response.refreshToken || null);
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            // Decode token and update user info
            try {
                const decodedToken = this.jwtHelper.decodeToken(response.token);
                const user: User = {
                    email: decodedToken.email,
                    displayName: decodedToken.name || decodedToken.email,
                };
                this.authState.next(user);
            } catch (error) {
                console.error('Error decoding token:', error);
                this.clearAuth();
            }
        }
    }

    private loadStoredAuth(): void {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token) {
            this.tokenSubject.next(token);
            this.refreshTokenSubject.next(refreshToken);
            // Update auth state with user info (you might want to decode JWT to get user info)
            this.authState.next({ email: 'user@example.com' }); // Replace with actual user info
        }
    }

    private clearAuth(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.tokenSubject.next(null);
        this.refreshTokenSubject.next(null);
        this.authState.next(null);
    }

    isAuthenticated(): Observable<boolean> {
        return this.authState$.pipe(
            map(user => user !== null)
        );
    }

    isTokenValid(): boolean {
        const token = this.tokenSubject.value;
        if (!token) return false;
        try {
            return !this.jwtHelper.isTokenExpired(token);
        } catch {
            return false;
        }
    }
}