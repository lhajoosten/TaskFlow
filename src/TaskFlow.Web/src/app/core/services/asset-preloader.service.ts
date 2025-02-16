import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, map } from 'rxjs';
import { assetManifest } from '../../shared/models/asset-manifest.models';

@Injectable({
  providedIn: 'root',
})
export class AssetPreloaderService {
  private preloadedAssets = new Set<string>();

  preloadAssets(): Observable<boolean> {
    const imagesToPreload = assetManifest.images.filter((path) => !this.preloadedAssets.has(path)).map((path) => this.preloadImage(path));

    return forkJoin(imagesToPreload).pipe(map(() => true));
  }

  private preloadImage(path: string): Observable<boolean> {
    return from(
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.preloadedAssets.add(path);
          resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = path;
      }),
    );
  }
}
