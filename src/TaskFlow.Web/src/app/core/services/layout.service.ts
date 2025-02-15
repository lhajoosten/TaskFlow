import { Injectable } from "@angular/core";
import { BehaviorSubject, fromEvent, startWith, map, distinctUntilChanged, shareReplay } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private sidebarOpenSubject = new BehaviorSubject<boolean>(window.innerWidth > 1024);
    sidebarOpen$ = this.sidebarOpenSubject.asObservable();

    isLargeScreen$ = fromEvent(window, 'resize').pipe(
        startWith(null), // Add this to emit initial value
        map(() => window.innerWidth > 1024),
        distinctUntilChanged(),
        shareReplay(1)
    );

    constructor() {
        // Update sidebar state when screen size changes
        this.isLargeScreen$.subscribe(isLarge => {
            if (isLarge) {
                this.sidebarOpenSubject.next(true);
            } else {
                this.sidebarOpenSubject.next(false);
            }
        });
    }

    toggleSidebar() {
        this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
    }

    closeSidebar() {
        if (window.innerWidth <= 1024) {
            this.sidebarOpenSubject.next(false);
        }
    }
}
