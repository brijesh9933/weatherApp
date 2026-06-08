import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationInsightsService } from './services/application-insights.service';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Weather';
  private destroy$ = new Subject<void>();

  navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Weather', path: '/weather' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'Profile', path: '/profile', requiresAuth: true },
    { label: 'Admin', path: '/admin' }
  ];

  isDisabled(item: { requiresAuth?: boolean }) {
    return !!item.requiresAuth && !this.authService.isLoggedIn;
  }

  onNavClick(event: MouseEvent, item: { requiresAuth?: boolean }) {
    if (this.isDisabled(item)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  constructor(
    private router: Router,
    private applicationInsightsService: ApplicationInsightsService,
    public authService: AuthService
  ) {
    this.applicationInsightsService.initializeUserContext();
    this.applicationInsightsService.initializeRouteTracking(this.router);
  }

  ngOnInit() {
    this.authService.getLoginStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Trigger change detection on login status change
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
