import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verify-phone-dialog',
  templateUrl: './verify-phone-dialog.component.html',
  styleUrls: ['./verify-phone-dialog.component.scss'],
  standalone: false,
})
export class VerifyPhoneDialogComponent {
  verificationForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<VerifyPhoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { phoneNumber: string },
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  verifyCode(): void {
    if (this.verificationForm.valid) {
      this.loading = true;
      this.userService
        .verifyPhoneNumber(this.verificationForm.get('code')?.value)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => (this.loading = false),
        });
    }
  }
}
