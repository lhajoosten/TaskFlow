import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { TwoFactorSetupDialogComponent } from '../../../core/authentication/two-factor-setup-dialog/two-factor-setup-dialog.component';
import { VerifyPhoneDialogComponent } from '../../../core/authentication/verify-phone-dialog/verify-phone-dialog.component';
import { User } from '../../../shared/models/profile.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.scss'],
  standalone: false,
})
export class ProfileSecurityComponent implements OnInit {
  loading = false;
  user: User | null = null;
  phoneNumberForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.phoneNumberForm = this.fb.group({
      phoneNumber: [''],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator },
    );
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
          this.phoneNumberForm.patchValue({ phoneNumber: user.phoneNumber });
        },
        error: () => {
          this.snackBar.open('Failed to load profile', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  verifyPhoneNumber(): void {
    const dialogRef = this.dialog.open(VerifyPhoneDialogComponent, {
      width: '400px',
      data: { phoneNumber: this.phoneNumberForm.get('phoneNumber')?.value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUserProfile();
        this.snackBar.open('Phone number verified successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  toggleTwoFactor(event: any): void {
    if (event.checked) {
      const dialogRef = this.dialog.open(TwoFactorSetupDialogComponent, {
        width: '400px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          event.source.checked = false;
        } else {
          this.loadUserProfile();
          this.snackBar.open('Two-factor authentication enabled', 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      this.disableTwoFactor();
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000,
          });
          this.passwordForm.reset();
        },
        error: () => {
          this.snackBar.open('Failed to change password', 'Close', {
            duration: 3000,
          });
        },
        complete: () => (this.loading = false),
      });
    }
  }

  private disableTwoFactor(): void {
    this.loading = true;
    this.userService.disableTwoFactor().subscribe({
      next: () => {
        this.loadUserProfile();
        this.snackBar.open('Two-factor authentication disabled', 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open(
          'Failed to disable two-factor authentication',
          'Close',
          { duration: 3000 },
        );
      },
      complete: () => (this.loading = false),
    });
  }

  private passwordMatchValidator = (
    group: FormGroup,
  ): { [key: string]: any } | null => {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value
      ? null
      : { mismatch: true };
  };
}
