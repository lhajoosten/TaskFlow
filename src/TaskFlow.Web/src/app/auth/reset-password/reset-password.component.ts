import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggerService } from '../../core/services/logger.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
    resetForm!: FormGroup;
    hidePassword = true;
    hideConfirmPassword = true;
    resetToken: string | null = null;
    email: string | null = null;
    isResetComplete = false;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        // Get both token and email from URL parameters
        this.resetToken = this.route.snapshot.queryParamMap.get('token');
        this.email = this.route.snapshot.queryParamMap.get('email');

        if (!this.resetToken || !this.email) {
            this.logger.warn('Missing reset token or email');
            this.snackBar.open('Invalid password reset link', 'Close', { duration: 5000 });
            this.router.navigate(['/auth/login']);
            return;
        }

        this.resetForm = this.fb.group({
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password?.value !== confirmPassword?.value) {
            confirmPassword?.setErrors({ passwordMismatch: true });
        }
        return null;
    }

    onSubmit(): void {
        if (this.resetForm.valid && !this.isLoading && this.resetToken && this.email) {
            this.isLoading = true;
            const newPassword = this.resetForm.get('password')?.value;

            this.logger.info('Attempting to reset password');
            this.authService.resetPassword(this.email, this.resetToken, newPassword).subscribe({
                next: (response) => {
                    this.isResetComplete = true;
                    this.snackBar.open(
                        'Password has been reset successfully. Please login with your new password.',
                        'Close',
                        { duration: 5000 }
                    );
                    this.logger.info('Password reset successful');
                    setTimeout(() => this.router.navigate(['/auth/login']), 5000);
                },
                error: (error) => {
                    this.isLoading = false;
                    const message = error?.error?.message || 'Failed to reset password. Please try again.';
                    this.snackBar.open(message, 'Close', { duration: 5000 });
                    this.logger.error('Password reset failed:', error);
                }
            });
        }
    }

    getPasswordErrors(): string {
        const control = this.resetForm.get('password');
        if (control?.hasError('required')) return 'Password is required';
        if (control?.hasError('minlength')) return 'Password must be at least 8 characters long';
        if (control?.hasError('pattern')) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        return '';
    }
}
