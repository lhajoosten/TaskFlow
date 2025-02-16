import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class ConfirmEmailComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  message = 'Confirming your email...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Get current route
    const currentUrl = this.router.url;
    let email: string | null;
    let token: string | null;

    // Handle both URL patterns
    if (currentUrl.includes('/auth/confirm-email')) {
      email = this.route.snapshot.queryParamMap.get('email');
      token = this.route.snapshot.queryParamMap.get('token');
    } else {
      // Handle root auth path
      email = this.route.parent?.snapshot.queryParamMap.get('email') ?? null;
      token = this.route.parent?.snapshot.queryParamMap.get('token') ?? null;
    }

    if (!email || !token) {
      this.isLoading = false;
      this.message = 'Invalid confirmation link.';
      return;
    }

    this.authService.confirmEmail(email, token).subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.message = 'Email confirmed successfully! You can now log in.';
        this.snackBar.open('Email confirmed successfully!', 'Close', {
          duration: 5000,
        });
      },
      error: (error) => {
        this.isSuccess = false;
        this.message = error.error.message || 'Failed to confirm email. Please try again.';
        this.snackBar.open(this.message, 'Close', {
          duration: 5000,
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
