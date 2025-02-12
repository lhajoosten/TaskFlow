import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AssetPreloaderService } from './core/services/asset-preloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  isLoading = true;

  constructor(protected authService: AuthService, private assetPreloader: AssetPreloaderService) { }

  ngOnInit() {
    this.assetPreloader.preloadAssets().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }
}
