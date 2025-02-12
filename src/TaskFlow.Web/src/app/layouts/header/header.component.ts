import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false,

})
export class HeaderComponent implements OnInit {
    isDarkTheme = false;
    userName = 'John Doe';
    userEmail = 'john.doe@taskflow.com';
    userRole = 'Project Manager';
    userAvatar = 'assets/images/avatar-banner.jpg';
    userStatus = 'online';
    notificationCount = 3;
    dueTodayCount = 7;
    activeProjectsCount = 4;

    searchResults = [
        { icon: 'task', title: 'Update Dashboard', category: 'Task' },
        { icon: 'folder', title: 'Website Redesign', category: 'Project' },
        { icon: 'person', title: 'Jane Smith', category: 'Team Member' }
    ];

    notifications = [
        {
            id: 1,
            icon: 'task_alt',
            message: 'Task "Update Dashboard" has been completed',
            time: new Date(),
            read: false,
            type: 'task'
        },
        {
            id: 2,
            icon: 'assignment',
            message: 'New task assigned to you',
            time: new Date(Date.now() - 3600000),
            read: false,
            type: 'assignment'
        },
        {
            id: 3,
            icon: 'schedule',
            message: 'Meeting reminder: Team Sync at 2:00 PM',
            time: new Date(Date.now() - 7200000),
            read: true,
            type: 'meeting'
        }
    ];

    notificationFilters = [
        { type: 'all', icon: 'all_inbox', label: 'All Notifications' },
        { type: 'task', icon: 'task', label: 'Tasks' },
        { type: 'meeting', icon: 'meeting_room', label: 'Meetings' },
        { type: 'mention', icon: 'alternate_email', label: 'Mentions' }
    ];
    constructor(private dialog: MatDialog, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.updateNotificationCount();
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme');
    }

    openAdvancedSearch() {
        // Implement advanced search dialog
    }

    handleNotification(notification: any) {
        // Handle notification click
    }

    markAsRead(notification: any) {
        notification.read = true;
        this.updateNotificationCount();
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateNotificationCount();
    }

    filterNotifications(type: string) {
        // Implement notification filtering
    }

    private updateNotificationCount() {
        this.notificationCount = this.notifications.filter(n => !n.read).length;
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/auth/login']);
            },
            error: (err: any) => {
                console.error('Logout failed', err);
            }
        });
    }
} 