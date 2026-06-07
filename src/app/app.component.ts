import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationInsightsService } from './services/application-insights.service';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'Weather';

  constructor(
    private router: Router,
    private applicationInsightsService: ApplicationInsightsService,
    public authService: AuthService
  ) {
    this.applicationInsightsService.initializeUserContext();
    this.applicationInsightsService.initializeRouteTracking(this.router);
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
