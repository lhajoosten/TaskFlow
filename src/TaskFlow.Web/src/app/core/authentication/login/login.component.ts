import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
import { filter, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Check if already authenticated
    this.subscription = this.authService.authState$
      .pipe(
        filter((state) => state !== null), // Only react to non-null states
        take(1),
      )
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/dashboard'], {
            replaceUrl: true,
            onSameUrlNavigation: 'reload', // Force router state update
          });
        }
      });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login(email, password, rememberMe).subscribe({
        next: (response) => {
          if (response.token) {
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000,
            });
            // Force a new navigation
            this.router
              .navigate(['/dashboard'], {
                replaceUrl: true,
                onSameUrlNavigation: 'reload',
                skipLocationChange: false,
              })
              .then(() => {
                // Force route reload
                window.location.reload();
              });
          }
        },
        error: (error) => {
          this.isLoading = false;
          const message =
            error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
