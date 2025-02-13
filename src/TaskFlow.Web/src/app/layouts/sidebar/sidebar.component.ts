import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent {
    userName = 'John Doe'; // Replace with actual user data
    userRole = 'Project Manager'; // Replace with actual user role
    userAvatar = 'assets/images/avatar-banner.jpg'; // Replace with actual user avatar

    constructor(private dialog: MatDialog) { }

    openQuickTaskDialog() {
        // Implement quick task dialog opening logic
        console.log('Opening quick task dialog');
    }

    openQuickMeetingDialog() {
        // Implement quick meeting dialog opening logic
        console.log('Opening quick meeting dialog');
    }

    openQuickProjectDialog() {
        // Implement quick project dialog opening logic
        console.log('Opening quick project dialog');
    }
}