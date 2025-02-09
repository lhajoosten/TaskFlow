import { NgModule } from '@angular/core';
import { AuthLandingComponent } from './auth-landing/auth-landing.component';
import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    AuthLandingComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }
