import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      console.log('📤 Attempting login with:', { email });

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('✅ Login response:', response);
          if (response.token) {
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000
            });
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }
        },
        error: (error) => {
          console.error('❌ Login error:', error);
          const message = error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000
          });
          this.isLoading = false;
        },
        complete: () => {
          console.log('✨ Login request completed');
          this.isLoading = false;
        }
      });
    }
  }
}
