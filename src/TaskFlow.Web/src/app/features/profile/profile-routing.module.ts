import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileNotificationsComponent } from './profile-notifications/profile-notifications.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileSecurityComponent } from './profile-security/profile-security.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ProfileOverviewComponent },
      { path: 'security', component: ProfileSecurityComponent },
      { path: 'notifications', component: ProfileNotificationsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
