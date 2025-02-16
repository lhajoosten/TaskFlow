import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileSecurityComponent } from './profile-security/profile-security.component';
import { ProfileNotificationsComponent } from './profile-notifications/profile-notifications.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileOverviewComponent,
    ProfileSecurityComponent,
    ProfileNotificationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    ProfileRoutingModule,
  ],
})
export class ProfileModule {}
