import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApplicationInsightsService } from './services/application-insights.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _http: HttpClient,
    private applicationInsightsService: ApplicationInsightsService
  ) { }

  getWeatherData(city: string): Observable<any> {
    const units = 'metric';
    return this._http.get(

      `${environment.weatherApiUrl}/weather?q=${city}&appid=${environment.weatherApiKey}&units=${units}`
    ).pipe(
      catchError((error) => {
        this.applicationInsightsService.trackException(error, {
          city,
          operation: 'getWeatherData'
        });

        return throwError(() => error);
      })
    );
  }

}
