import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  getWeatherData(city: string): Observable<any> {
    console.log("city", city);
    const units = 'metric';
    return this.http.get(
      `${environment.weatherApiUrl}/weather?q=${city}&appid=${environment.weatherApiKey}&units=${units}`
    );
  }

}