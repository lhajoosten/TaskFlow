import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AssetPreloaderService } from './core/services/asset-preloader.service';
import { ThemeService } from './core/services/theme.service';
import { LayoutService } from './core/services/layout.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from './shared/layouts/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('header') header: HeaderComponent | undefined;
  headerMenus: any = null;

  isLoading = true;
  isLargeScreen$: Observable<boolean>;

  constructor(
    protected authService: AuthService,
    protected layoutService: LayoutService,
    private assetPreloader: AssetPreloaderService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {
    this.isLargeScreen$ = this.layoutService.isLargeScreen$;
  }

  ngOnInit() {
    this.assetPreloader.preloadAssets().subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });

    this.themeService.isDarkMode$.subscribe((isDark) => {
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }

  ngAfterViewInit() {
    // Initialize headerMenus in next cycle to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.header?.notificationsMenu && this.header?.filterMenu) {
        this.headerMenus = {
          notifications: this.header.notificationsMenu,
          filter: this.header.filterMenu,
        };
        this.cdr.detectChanges();
      }
      this.isLoading = false;
    });
  }
}
