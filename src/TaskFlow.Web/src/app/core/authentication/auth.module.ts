import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { VerifyPhoneDialogComponent } from './verify-phone-dialog/verify-phone-dialog.component';
import { TwoFactorSetupDialogComponent } from './two-factor-setup-dialog/two-factor-setup-dialog.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // Modules
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AuthRoutingModule,

    // Components
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
  ],
  declarations: [VerifyPhoneDialogComponent, TwoFactorSetupDialogComponent],
})
export class AuthModule {}
