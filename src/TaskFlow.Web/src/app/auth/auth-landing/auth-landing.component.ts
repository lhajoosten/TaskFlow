import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-auth-landing',
    templateUrl: './auth-landing.component.html',
    styleUrls: ['./auth-landing.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AuthService],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule
    ]
})
export class AuthLandingComponent implements OnInit {
    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.checkAuthStatus();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private checkAuthStatus() {
        this.authService.isAuthenticated().pipe(
            takeUntil(this.destroy$)
        ).subscribe(isAuthenticated => {
            if (isAuthenticated) {
                this.router.navigate(['/dashboard']);
            }
            this.cdr.markForCheck();
        });
    }

    navigateToLogin() {
        this.router.navigate(['/auth/login']);
    }

    navigateToRegister() {
        this.router.navigate(['/auth/register']);
    }
}