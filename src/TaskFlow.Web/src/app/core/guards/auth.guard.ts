import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authService.authState$.pipe(
            take(1),
            tap(user => console.log('AuthGuard state check:', { url: state.url, user })),
            map(user => {
                const isAuthRoute = state.url.includes('/auth/login');

                if (isAuthRoute && user) {
                    this.router.navigate(['/dashboard'], {
                        replaceUrl: true,
                        onSameUrlNavigation: 'reload'
                    });
                    return false;
                }

                if (!isAuthRoute && !user) {
                    this.router.navigate(['/auth/login'], {
                        replaceUrl: true,
                        onSameUrlNavigation: 'reload'
                    });
                    return false;
                }

                return true;
            })
        );
    }
}