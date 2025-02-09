import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
    resetForm!: FormGroup;
    hidePassword = true;
    resetToken: string | null = null;
    isResetComplete = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.resetToken = this.route.snapshot.queryParamMap.get('token');

        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
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
        if (this.resetForm.valid && this.resetToken) {
            // TODO: Implement password reset logic using this.resetToken
            console.log('Reset password with token:', this.resetToken);
            console.log('New password:', this.resetForm.value.password);
            this.isResetComplete = true;
        }
    }
}
