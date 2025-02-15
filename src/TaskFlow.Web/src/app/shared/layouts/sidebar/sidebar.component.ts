import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';
import { MatMenu } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

export interface HeaderMenus {
  notifications: MatMenu;
  filter: MatMenu;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent {
  @Input() headerMenus!: HeaderMenus;
  @ViewChild('profileMenu') profileMenu!: MatMenu;

  dueTodayCount = 7;
  activeProjectsCount = 4;
  notificationCount = 3;

  userName = 'John Doe';
  userEmail = 'john.doe@taskflow.com';
  userRole = 'Project Manager';
  userAvatar = 'assets/images/avatar-banner.jpg';
  userStatus = 'online';

  isDarkTheme$: Observable<boolean>;
  isSidebarOpen$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
    protected layoutService: LayoutService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isDarkTheme$ = this.themeService.isDarkMode$;
    this.isSidebarOpen$ = this.layoutService.sidebarOpen$;
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  openAdvancedSearch() {
    console.log('Opening advanced search');
  }

  openQuickTaskDialog() {
    console.log('Opening quick task dialog');
  }

  openQuickMeetingDialog() {
    console.log('Opening quick meeting dialog');
  }

  openQuickProjectDialog() {
    console.log('Opening quick project dialog');
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Handled by service
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.authService['clearAuth']();
        this.router.navigate(['/auth/login'], { replaceUrl: true });
      },
    });
  }
}
