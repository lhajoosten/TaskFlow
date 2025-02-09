import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { AuthenticatedUser } from '../../core/models/auth.models';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() menuClick = new EventEmitter<void>();

    isAuthenticated = false;
    currentUser: AuthenticatedUser | null = null;
    private authSubscription?: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        // Subscribe to auth state changes
        this.authSubscription = this.authService.authState$.subscribe(
            (user) => {
                this.isAuthenticated = !!user;
                this.currentUser = user;
            }
        );
    }

    ngOnDestroy() {
        this.authSubscription?.unsubscribe();
    }

    toggleSidenav() {
        this.menuClick.emit();
    }

    async logout() {
        try {
            await this.authService.logout().toPromise();
            await this.router.navigate(['/auth/login']);
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    navigateToSettings() {
        this.router.navigate(['/settings']);
    }

    navigateToHelp() {
        this.router.navigate(['/help']);
    }
}
