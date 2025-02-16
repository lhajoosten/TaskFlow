import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isEmailSent = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.logger.info('Requesting password reset for:', email);
      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isEmailSent = true;
          this.snackBar.open(
            'Password reset instructions have been sent to your email.',
            'Close',
            { duration: 5000 },
          );
          this.logger.info('Password reset email sent successfully');
        },
        error: (error) => {
          this.isLoading = false;
          const message =
            error?.error?.message ||
            'Failed to send reset email. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
          this.logger.error('Password reset request failed:', error);
        },
      });
    }
  }
}
