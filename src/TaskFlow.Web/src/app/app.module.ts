import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MainContentComponent } from './layouts/main-content/main-content.component';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { LoggerService } from './core/services/logger.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { TimeAgoPipe } from './core/pipes/time-ago.pipe';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './shared/components/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainContentComponent,
  ],
  imports: [
    // Standalone components
    SpinnerComponent,

    // Angular modules
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // App modules
    AppRoutingModule,
    MaterialModule,
    FeaturesModule,
    AuthModule,

    // Core items
    TimeAgoPipe,
  ],
  providers: [
    {
      provide: HttpClient,
      useClass: HttpClient
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggerService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
