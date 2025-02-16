import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { finalize } from 'rxjs/operators';
import { NotificationSetting } from '../../../shared/models/profile.models';

@Component({
  selector: 'app-profile-notifications',
  templateUrl: './profile-notifications.component.html',
  styleUrls: ['./profile-notifications.component.scss'],
  standalone: false,
})
export class ProfileNotificationsComponent implements OnInit {
  loading = false;
  notificationForm!: FormGroup;

  notificationSettings: NotificationSetting[] = [
    {
      type: 'taskAssigned',
      description: 'When a task is assigned to me',
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'taskUpdated',
      description: 'When a task I am assigned to is updated',
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'taskCommented',
      description: 'When someone comments on my task',
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'projectUpdated',
      description: 'When a project I am part of is updated',
      email: false,
      push: true,
      inApp: true,
    },
    {
      type: 'mentionedInComment',
      description: 'When someone mentions me in a comment',
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'deadlineApproaching',
      description: 'When a task deadline is approaching',
      email: true,
      push: true,
      inApp: true,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadNotificationSettings();
  }

  private createForm(): void {
    const group: any = {};

    this.notificationSettings.forEach((setting) => {
      group[`${setting.type}Email`] = [setting.email];
      group[`${setting.type}Push`] = [setting.push];
      group[`${setting.type}InApp`] = [setting.inApp];
    });

    group.emailDigest = [true];
    group.digestFrequency = ['daily'];
    group.quietHoursEnabled = [false];
    group.quietHoursStart = ['22:00'];
    group.quietHoursEnd = ['07:00'];

    this.notificationForm = this.fb.group(group);
  }

  private loadNotificationSettings(): void {
    this.loading = true;
    this.userService
      .getNotificationSettings()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (settings) => {
          if (settings) {
            this.notificationForm.patchValue(settings);
          }
        },
        error: () => {
          this.snackBar.open('Failed to load notification settings', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      this.loading = true;
      this.userService
        .updateNotificationSettings(this.notificationForm.value)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.snackBar.open(
              'Notification settings updated successfully',
              'Close',
              { duration: 3000 },
            );
          },
          error: () => {
            this.snackBar.open(
              'Failed to update notification settings',
              'Close',
              { duration: 3000 },
            );
          },
        });
    }
  }

  toggleAllEmail(enabled: boolean): void {
    this.notificationSettings.forEach((setting) => {
      this.notificationForm.patchValue({ [`${setting.type}Email`]: enabled });
    });
  }

  toggleAllPush(enabled: boolean): void {
    this.notificationSettings.forEach((setting) => {
      this.notificationForm.patchValue({ [`${setting.type}Push`]: enabled });
    });
  }

  toggleAllInApp(enabled: boolean): void {
    this.notificationSettings.forEach((setting) => {
      this.notificationForm.patchValue({ [`${setting.type}InApp`]: enabled });
    });
  }

  // In your ProfileNotificationsComponent class

get allEmailEnabled(): boolean {
  return this.notificationSettings.every(setting => this.notificationForm.get(setting.type + 'Email')?.value);
}

get allPushEnabled(): boolean {
  return this.notificationSettings.every(setting => this.notificationForm.get(setting.type + 'Push')?.value);
}

get allInAppEnabled(): boolean {
  return this.notificationSettings.every(setting => this.notificationForm.get(setting.type + 'InApp')?.value);
}

}
