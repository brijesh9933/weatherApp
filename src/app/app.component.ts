import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { ApplicationInsightsService } from './services/application-insights.service';
import { environment } from '../environments/environment';

declare var $: any;

type RecentSearch = {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'Weather';
  IsChangeLocation = false;
  TodayDate: Date;
  weatherData: any;
  cityName: any;
  envName = environment.envName;

  week: Array<{ name: string; temp: number }> = [];
  statusText = 'Safe';
  statusClass = 'safe';
  progressPercent = 0;
  telemetryUserId = '';

  recentSearches: RecentSearch[] = [];

  constructor(
    private service: CommonService,
    private router: Router,
    private applicationInsightsService: ApplicationInsightsService
  ) {
    this.TodayDate = new Date();
    this.week = this.buildWeek(22); // initial placeholder
    this.telemetryUserId = this.applicationInsightsService.initializeUserContext();
    this.applicationInsightsService.initializeRouteTracking(this.router);
  }

  changeLocation() {
    const url = 'https://brijesh9933.github.io/myPortfolio-dynamicDesign/';

    // Open in a new tab/window
    // Always open a new tab (no same-tab fallback to avoid navigating away)
    window.open(url, '_blank', 'noopener,noreferrer');
  }


  getWeatherDataByCity() {
    const city = ($("#CityName").val() || '').toString().trim();
    if (!city) return;

    this.applicationInsightsService.trackEvent('WeatherSearch', {
      city,
      userId: this.telemetryUserId,
      environment: this.envName
    });

    this.service.getWeatherData(city).subscribe((data) => {
      this.cityName = city;
      this.weatherData = data;

      // push into recent searches (newest first)
      const temp = data?.main?.temp;
      const feelsLike = data?.main?.feels_like;
      const humidity = data?.main?.humidity;
      const description = data?.weather?.[0]?.description ?? '';

      if (
        typeof temp === 'number' &&
        typeof feelsLike === 'number' &&
        typeof humidity === 'number'
      ) {
        this.recentSearches = [
          {
            city,
            temp: Math.round(temp),
            feelsLike: Math.round(feelsLike),
            humidity: Math.round(humidity),
            description
          },
          ...this.recentSearches
        ].slice(0, 3); // keep last 3
      }

      this.applyDerivedUIState();
    });
  }

  getBackgroundImageUrl(): string {
    const main = this.weatherData?.weather?.[0]?.main;
    if (!main) return 'none';

    // Example: "Overcast Clouds" -> "overcast-clouds"
    const slug = String(main)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    return `url(/assets/bg-${slug}.jpg)`;
  }

  private toTimeFromUnixSeconds(unixSeconds?: number): string {
    if (!unixSeconds || typeof unixSeconds !== 'number') return '--:--';

    // API: sunrise/sunset are in UNIX seconds; apply timezone offset (seconds)
    const tzOffsetSeconds = this.weatherData?.timezone ?? 0;
    const ms = (unixSeconds + tzOffsetSeconds) * 1000;

    // Force formatting as UTC to avoid double-applying the browser timezone.
    return new Date(ms).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  }

  getSunriseTime(): string {
    return this.toTimeFromUnixSeconds(this.weatherData?.sys?.sunrise);
  }

  getSunsetTime(): string {
    return this.toTimeFromUnixSeconds(this.weatherData?.sys?.sunset);
  }


  private applyDerivedUIState() {
    const temp = this.weatherData?.main?.temp;

    if (typeof temp === 'number') {
      this.week = this.buildWeek(temp);

      // Simple “danger” logic (since API object is current weather only)
      if (temp >= 35 || temp <= 0) {
        this.statusText = 'Dangerous';
        this.statusClass = 'danger';
      } else {
        this.statusText = 'Safe';
        this.statusClass = 'safe';
      }

      // Progress based on temperature range -10..50
      const raw = ((temp - (-10)) / (50 - (-10))) * 100;
      this.progressPercent = Math.max(0, Math.min(100, Math.round(raw)));
    }
  }

  private buildWeek(baseTemp: number) {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const deltas = [-3, -1, 0, 2, 4, -2, 1];
    return names.map((name, i) => ({
      name,
      temp: Math.round(baseTemp + deltas[i % deltas.length])
    }));
  }

  transform(value: number): number {
    return Math.round(value);
  }
}
