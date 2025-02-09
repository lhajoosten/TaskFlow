import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

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
    authState$ = this.authState.asObservable();

    constructor(private router: Router) { }

    login(email: string, password: string): Observable<void> {
        return new Observable<void>((observer) => {
            // Simulate a login API call
            setTimeout(() => {
                const user: User = {
                    displayName: 'John Doe',
                    email: email,
                    photoURL: 'https://example.com/photo.jpg'
                };
                this.authState.next(user);
                observer.next();
                observer.complete();
            }, 1000);
        });
    }

    logout(): Observable<void> {
        return new Observable<void>((observer) => {
            // Simulate a logout API call
            setTimeout(() => {
                this.authState.next(null);
                this.router.navigate(['/auth/login']);
                observer.next();
                observer.complete();
            }, 1000);
        });
    }

    getUser(): User | null {
        return this.authState.value;
    }

    isAuthenticated(): Observable<boolean> {
        return this.authState$.pipe(
            map(user => user !== null)
        );
    }
}