import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AssetPreloaderService } from './core/services/asset-preloader.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  isLoading = true;

  constructor(
    protected authService: AuthService,
    private assetPreloader: AssetPreloaderService,
    private themeService: ThemeService) { }

  ngOnInit() {
    this.assetPreloader.preloadAssets().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });

    this.themeService.isDarkMode$.subscribe(isDark => {
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }
}
