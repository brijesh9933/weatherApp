import { Injectable } from '@angular/core';
import { ApplicationInsights, IEventTelemetry, IExceptionTelemetry, IMetricTelemetry, IPageViewTelemetry } from '@microsoft/applicationinsights-web';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { environment } from 'src/environments/environment';

type ApplicationInsightsEnvironment = typeof environment & {
  appInsightsConnectionString?: string;
  appInsightsInstrumentationKey?: string;
  enableAppInsights?: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class ApplicationInsightsService {
  private appInsights?: ApplicationInsights;
  private routeTrackingSubscription?: Subscription;

  constructor() {
    this.initialize();
  }

  logPageView(name?: string, uri?: string, properties?: Record<string, unknown>): void {
    this.trackPageView(name, uri, properties);
  }

  trackPageView(name?: string, uri?: string, properties?: Record<string, unknown>): void {
    this.appInsights?.trackPageView({ name, uri, properties } as IPageViewTelemetry);
  }

  logEvent(name: string, properties?: Record<string, unknown>): void {
    this.trackEvent(name, properties);
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    this.appInsights?.trackEvent({ name, properties } as IEventTelemetry);
  }

  logException(exception: unknown, properties?: Record<string, unknown>): void {
    this.trackException(exception, properties);
  }

  trackException(exception: unknown, properties?: Record<string, unknown>): void {
    const trackedException = exception instanceof Error
      ? exception
      : new Error(String(exception));

    this.appInsights?.trackException({ exception: trackedException, properties } as IExceptionTelemetry);
  }

  logMetric(name: string, average: number, properties?: Record<string, unknown>): void {
    this.appInsights?.trackMetric({ name, average, properties } as IMetricTelemetry);
  }

  initializeRouteTracking(router: Router): void {
    if (this.routeTrackingSubscription) {
      return;
    }

    this.routeTrackingSubscription = router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects || event.url;

        this.trackPageView(url, url);
      });
  }

  setAuthenticatedUserContext(userId: string): void {
    this.appInsights?.setAuthenticatedUserContext(userId);
  }

  clearAuthenticatedUserContext(): void {
    this.appInsights?.clearAuthenticatedUserContext();
  }

  private initialize(): void {
    const appEnvironment = environment as ApplicationInsightsEnvironment;

    if (!appEnvironment.enableAppInsights) {
      return;
    }

    const connectionString = appEnvironment.appInsightsConnectionString;
    const instrumentationKey = appEnvironment.appInsightsInstrumentationKey;

    if (!connectionString && !instrumentationKey) {
      return;
    }

    this.appInsights = new ApplicationInsights({
      config: {
        connectionString,
        instrumentationKey,
        enableAutoRouteTracking: false
      }
    });

    this.appInsights.loadAppInsights();
  }
}
