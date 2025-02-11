import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../../material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TimeAgoPipe } from "../../core/pipes/time-ago.pipe";



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule,
    TimeAgoPipe
  ]
})
export class DashboardModule { }
