import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter" [color]="color"></mat-spinner>
    </div>
  `,
    styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 9999;
    }
  `]
})
export class SpinnerComponent {
    @Input() diameter = 50;
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() overlay = false;
}