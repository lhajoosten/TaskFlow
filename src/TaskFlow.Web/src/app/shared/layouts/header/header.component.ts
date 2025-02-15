import { Component, ViewChild } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../core/services/layout.service';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  @ViewChild('notificationsMenu') notificationsMenu!: MatMenu;
  @ViewChild('filterMenu') filterMenu!: MatMenu;

  dueTodayCount = 7;
  activeProjectsCount = 4;
  notificationCount = 3;

  searchResults = [
    { icon: 'task', title: 'Update Dashboard', category: 'Task' },
    { icon: 'folder', title: 'Website Redesign', category: 'Project' },
    { icon: 'person', title: 'Jane Smith', category: 'Team Member' },
  ];

  notifications = [
    {
      id: 1,
      icon: 'task_alt',
      message: 'Task "Update Dashboard" has been completed',
      time: new Date(),
      read: false,
      type: 'task',
    },
    {
      id: 2,
      icon: 'assignment',
      message: 'New task assigned to you',
      time: new Date(Date.now() - 3600000),
      read: false,
      type: 'assignment',
    },
    {
      id: 3,
      icon: 'schedule',
      message: 'Meeting reminder: Team Sync at 2:00 PM',
      time: new Date(Date.now() - 7200000),
      read: true,
      type: 'meeting',
    },
  ];

  notificationFilters = [
    { type: 'all', icon: 'all_inbox', label: 'All Notifications' },
    { type: 'task', icon: 'task', label: 'Tasks' },
    { type: 'meeting', icon: 'meeting_room', label: 'Meetings' },
    { type: 'mention', icon: 'alternate_email', label: 'Mentions' },
  ];

  isDarkTheme$: Observable<boolean>;
  isSidebarOpen$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
    private layoutService: LayoutService,
  ) {
    this.isDarkTheme$ = this.themeService.isDarkMode$;
    this.isSidebarOpen$ = this.layoutService.sidebarOpen$;
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  handleNotification(notification: any) {
    console.log('Notification:', notification);
  }

  markAsRead(notification: any) {
    notification.read = true;
    this.updateNotificationCount();
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.updateNotificationCount();
  }

  filterNotifications(type: string) {
    console.log('Filter:', type);
  }

  private updateNotificationCount() {
    this.notificationCount = this.notifications.filter((n) => !n.read).length;
  }
}
