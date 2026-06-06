import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationInsightsService } from './services/application-insights.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'Weather';

  constructor(
    private router: Router,
    private applicationInsightsService: ApplicationInsightsService
  ) {
    this.applicationInsightsService.initializeUserContext();
    this.applicationInsightsService.initializeRouteTracking(this.router);
  }
}
