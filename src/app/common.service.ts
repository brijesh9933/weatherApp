import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:HttpClient) { }

  getWeatherData(city:string):Observable<any>{
    console.log("city",city)
    var searchText = city;
    var appid = ['a03d3e926ebf4704c8092db092410fa4'];
    var units = 'metric';
      return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${appid}&units=${units}`);
  }
}
