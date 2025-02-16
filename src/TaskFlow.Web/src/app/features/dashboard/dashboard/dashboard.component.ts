import { Component, OnInit } from '@angular/core';

interface WeekDay {
  name: string;
  date: string;
  isToday: boolean;
  events: {
    time: string;
    title: string;
    color: string;
  }[];
}

interface Notification {
  type: 'info' | 'success' | 'warning' | 'error';
  icon: string;
  message: string;
  time: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  selectedTimeRange = 'week';
  weekDays: WeekDay[] = [];

  recentActivities = [
    { icon: 'check_circle', title: 'Completed task "Design Homepage"', time: new Date() },
    {
      icon: 'play_circle',
      title: 'Started task "Develop Login Module"',
      time: new Date(Date.now() - 3600000),
    },
    {
      icon: 'rate_review',
      title: 'Reviewed task "Update User Profile"',
      time: new Date(Date.now() - 7200000),
    },
  ];

  upcomingDeadlines = [
    { taskName: 'Frontend Development', date: new Date(Date.now() + 86400000 * 2), progress: 75 },
    { taskName: 'API Integration', date: new Date(Date.now() + 86400000 * 5), progress: 45 },
    { taskName: 'User Testing', date: new Date(Date.now() + 86400000 * 7), progress: 20 },
    { taskName: 'API Integration', date: new Date(Date.now() + 86400000 * 4), progress: 95 },
    { taskName: 'User Testing', date: new Date(Date.now() + 86400000 * 12), progress: 69 },
    { taskName: 'Frontend Development', date: new Date(Date.now() + 86400000 * 2), progress: 75 },
    { taskName: 'Frontend Development', date: new Date(Date.now() + 86400000 * 2), progress: 75 },
  ];

  teamWorkload = [
    {
      name: 'John Doe',
      avatar: 'assets/images/avatar-banner.jpg',
      taskCount: 8,
      workloadPercentage: 80,
    },
    {
      name: 'Jane Smith',
      avatar: 'assets/images/avatar-banner.jpg',
      taskCount: 5,
      workloadPercentage: 60,
    },
    {
      name: 'Mike Johnson',
      avatar: 'assets/images/avatar-banner.jpg',
      taskCount: 3,
      workloadPercentage: 40,
    },
    {
      name: 'Jane Smith',
      avatar: 'assets/images/avatar-banner.jpg',
      taskCount: 5,
      workloadPercentage: 60,
    },
    {
      name: 'Mike Johnson',
      avatar: 'assets/images/avatar-banner.jpg',
      taskCount: 3,
      workloadPercentage: 40,
    },
  ];

  recentNotifications: Notification[] = [
    {
      type: 'info',
      icon: 'info',
      message: 'New project "TaskFlow Mobile App" has been created',
      time: new Date(),
    },
    {
      type: 'success',
      icon: 'task_alt',
      message: 'Sprint planning meeting notes have been shared',
      time: new Date(Date.now() - 3600000),
    },
    {
      type: 'warning',
      icon: 'warning',
      message: 'Project "Website Redesign" deadline is approaching',
      time: new Date(Date.now() - 7200000),
    },
    {
      type: 'error',
      icon: 'error',
      message: 'Failed to upload documents to cloud storage',
      time: new Date(Date.now() - 86400000),
    },
  ];

  constructor() {}

  ngOnInit() {
    // ...existing code...
    this.initializeWeekCalendar();
  }

  private initializeWeekCalendar() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString(),
        isToday: date.toDateString() === today.toDateString(),
        events: this.getEventsForDate(date), // Implement this method to get actual events
      };
    });
  }

  private getEventsForDate(date: Date): { time: string; title: string; color: string }[] {
    // This is a mock implementation - replace with actual data from your service
    return [
      {
        time: '09:00',
        title: 'Team Meeting',
        color: 'rgba(103, 58, 183, 0.1)',
      },
      {
        time: '14:30',
        title: 'Project Review',
        color: 'rgba(233, 30, 99, 0.1)',
      },
    ];
  }
}
