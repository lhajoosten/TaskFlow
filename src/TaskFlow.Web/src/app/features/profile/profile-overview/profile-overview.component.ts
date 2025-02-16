import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { User } from '../../../shared/models/profile.models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss'],
  standalone: false,
})
export class ProfileOverviewComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  user: User | null = null;
  skills: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
  ];

  readonly languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  readonly timeZones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time' },
    { value: 'CST', label: 'Central Time' },
    { value: 'PST', label: 'Pacific Time' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.profileForm = this.fb.group({
      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profilePictureUrl: [''],
      jobTitle: [''],
      department: [''],

      // Preferences
      language: ['en'],
      timeZone: ['UTC'],
      emailNotifications: [true],
      desktopNotifications: [true],
      darkMode: [false],

      // About Me
      bio: ['', [Validators.maxLength(500)]],
      skills: [[]],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.userService
      .getCurrentUser()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.profileForm.patchValue(user);
          this.skills = user.skills || [];
        },
        error: () => {
          this.snackBar.open('Failed to load profile', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      const profileData = {
        ...this.profileForm.value,
        skills: this.skills,
      };

      this.userService
        .updateProfile(profileData)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Profile updated successfully', 'Close', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Failed to update profile', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.loading = true;
      this.userService
        .updateProfilePicture(file)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (response) => {
            this.user!.profilePictureUrl = response.profilePictureUrl;
            this.snackBar.open('Profile picture updated', 'Close', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Failed to update profile picture', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.skills.push(value);
      event.chipInput!.clear();
    }
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }
}
