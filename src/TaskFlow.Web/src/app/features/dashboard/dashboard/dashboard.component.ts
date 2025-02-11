import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  selectedTimeRange = 'week';

  recentActivities = [
    { icon: 'check_circle', title: 'Completed task "Design Homepage"', time: new Date() },
    { icon: 'play_circle', title: 'Started task "Develop Login Module"', time: new Date(Date.now() - 3600000) },
    { icon: 'rate_review', title: 'Reviewed task "Update User Profile"', time: new Date(Date.now() - 7200000) }
  ];

  upcomingDeadlines = [
    { taskName: 'Frontend Development', date: new Date(Date.now() + 86400000 * 2), progress: 75 },
    { taskName: 'API Integration', date: new Date(Date.now() + 86400000 * 5), progress: 45 },
    { taskName: 'User Testing', date: new Date(Date.now() + 86400000 * 7), progress: 20 }
  ];

  teamWorkload = [
    { name: 'John Doe', avatar: 'assets/avatars/john.jpg', taskCount: 8, workloadPercentage: 80 },
    { name: 'Jane Smith', avatar: 'assets/avatars/jane.jpg', taskCount: 5, workloadPercentage: 60 },
    { name: 'Mike Johnson', avatar: 'assets/avatars/mike.jpg', taskCount: 3, workloadPercentage: 40 }
  ];

  constructor() { }

  ngOnInit(): void { }
}