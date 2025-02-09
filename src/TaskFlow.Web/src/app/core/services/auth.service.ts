import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap, throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, ResetPasswordRequest, ForgotPasswordRequest, RefreshTokenRequest, AuthenticatedUser } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState = new BehaviorSubject<AuthenticatedUser | null>(null);
    private tokenSubject = new BehaviorSubject<string | null>(null);
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);
    private jwtHelper = new JwtHelperService();

    authState$ = this.authState.asObservable();
    token$ = this.tokenSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadStoredAuth();  // Re-enable this call
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.authEndpoints.register}`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    login(email: string, password: string, rememberMe: boolean = false): Observable<AuthResponse> {
        const request: LoginRequest = { email, password, rememberMe };
        const url = `${environment.apiUrl}${environment.authEndpoints.login}`;

        return this.http.post<AuthResponse>(url, request).pipe(
            tap(response => {
                if (response.success && response.token) {
                    this.handleAuthResponse(response, rememberMe);
                } else if (response.errorMessage) {
                    throw new Error(response.errorMessage);
                }
            }),
            catchError(error => {
                this.clearAuth(); // Clear any partial auth state on error
                return throwError(() => error?.error?.errorMessage || 'Login failed');
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

    private handleAuthResponse(response: AuthResponse, rememberMe: boolean = false): void {
        // Clear any existing auth state first
        this.clearAuth();

        if (response.token) {
            this.tokenSubject.next(response.token);
            this.refreshTokenSubject.next(response.refreshToken || null);

            // Store tokens in only one storage type based on remember me preference
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('token', response.token);
            if (response.refreshToken) {
                storage.setItem('refreshToken', response.refreshToken);
            }
            if (response.tokenExpiration) {
                storage.setItem('tokenExpiration', response.tokenExpiration.toString());
            }
            if (response.refreshTokenExpiration) {
                storage.setItem('refreshTokenExpiration', response.refreshTokenExpiration.toString());
            }

            // Decode token and update user info - only set auth state once
            try {
                const decodedToken = this.jwtHelper.decodeToken(response.token);
                const user: AuthenticatedUser = {
                    id: decodedToken.nameid,
                    email: decodedToken.email,
                    name: decodedToken.unique_name,
                    photoURL: decodedToken.photoURL || null
                };
                // Single auth state update at the end
                this.authState.next(user);
            } catch (error) {
                console.error('Error decoding token:', error);
                this.clearAuth();
            }
        }
    }

    private loadStoredAuth(): void {
        // Try localStorage first, then sessionStorage if not found
        let storage = localStorage;
        let token = storage.getItem('token');
        let refreshToken = storage.getItem('refreshToken');
        let tokenExpiration = storage.getItem('tokenExpiration');
        let refreshTokenExpiration = storage.getItem('refreshTokenExpiration');

        // If not found in localStorage, try sessionStorage
        if (!token) {
            storage = sessionStorage;
            token = storage.getItem('token');
            refreshToken = storage.getItem('refreshToken');
            tokenExpiration = storage.getItem('tokenExpiration');
            refreshTokenExpiration = storage.getItem('refreshTokenExpiration');
        }

        if (token && tokenExpiration) {
            // Check if tokens are expired
            const now = new Date();
            const tokenExpiryDate = new Date(tokenExpiration);
            const refreshTokenExpiryDate = refreshTokenExpiration ? new Date(refreshTokenExpiration) : null;

            // Clear everything if refresh token is expired
            if (refreshTokenExpiryDate && refreshTokenExpiryDate <= now) {
                this.clearAuth();
                return;
            }

            // If token is expired but refresh token is valid, try to refresh
            if (tokenExpiryDate <= now && refreshToken && refreshTokenExpiryDate && refreshTokenExpiryDate > now) {
                this.refreshToken().subscribe({
                    error: () => this.clearAuth()
                });
                return;
            }

            // If token is still valid, use it
            if (tokenExpiryDate > now) {
                try {
                    const decodedToken = this.jwtHelper.decodeToken(token);
                    const user: AuthenticatedUser = {
                        id: decodedToken.nameid,
                        email: decodedToken.email,
                        name: decodedToken.unique_name,
                        photoURL: decodedToken.photoURL || null
                    };

                    this.tokenSubject.next(token);
                    this.refreshTokenSubject.next(refreshToken);
                    this.authState.next(user);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    this.clearAuth();
                }
            } else {
                // Token is expired and no valid refresh token
                this.clearAuth();
            }
        }
    }

    private clearAuth(): void {
        // Clear both storages
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('refreshTokenExpiration');

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('tokenExpiration');
        sessionStorage.removeItem('refreshTokenExpiration');

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