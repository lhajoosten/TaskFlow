import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-two-factor-setup-dialog',
  templateUrl: './two-factor-setup-dialog.component.html',
  styleUrls: ['./two-factor-setup-dialog.component.scss'],
  standalone: false,
})
export class TwoFactorSetupDialogComponent implements OnInit {
  currentStep = 1;
  loading = false;
  qrCodeUrl: string | null = null;
  recoveryCodes: string[] = [];
  verificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TwoFactorSetupDialogComponent>,
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.setupTwoFactor();
  }

  private setupTwoFactor(): void {
    this.loading = true;
    this.userService
      .enableTwoFactor()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.qrCodeUrl = response.qrCodeUrl;
          this.recoveryCodes = response.recoveryCodes;
        },
        error: () => {
          this.snackBar.open(
            'Failed to setup two-factor authentication',
            'Close',
            { duration: 3000 },
          );
          this.dialogRef.close(false);
        },
      });
  }

  verifySetup(): void {
    if (this.verificationForm.valid) {
      this.loading = true;
      this.userService
        .verifyTwoFactorSetup(this.verificationForm.get('code')?.value)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            if (this.currentStep === 1) {
              this.currentStep = 2;
            } else {
              this.dialogRef.close(true);
            }
          },
          error: () => {
            this.snackBar.open('Invalid verification code', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }

  downloadRecoveryCodes(): void {
    const content = this.recoveryCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recovery-codes.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
