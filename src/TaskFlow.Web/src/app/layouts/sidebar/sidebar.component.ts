import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent {
    @Output() toggleSidenav = new EventEmitter<void>();

    constructor() { }

    onToggleSidenav(): void {
        this.toggleSidenav.emit();
    }
}
