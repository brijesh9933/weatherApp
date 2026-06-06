import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';

@NgModule({
  declarations: [WeatherComponent],
  imports: [
    CommonModule,
    WeatherRoutingModule
  ]
})
export class WeatherModule { }
