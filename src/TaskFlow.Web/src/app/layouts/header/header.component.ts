import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false,
})
export class HeaderComponent implements OnInit {
    @Output() menuClick = new EventEmitter<void>();
    isAuthenticated = false;
    userName: string = '';
    userProfilePic?: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.authState$.subscribe(
            (user) => {
                this.isAuthenticated = !!user;
                if (user) {
                    this.userName = user.displayName || user.email;
                    this.userProfilePic = user.photoURL;
                }
            }
        );
    }

    toggleSidenav() {
        this.menuClick.emit();
    }

    async logout() {
        await this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
