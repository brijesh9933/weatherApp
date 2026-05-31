/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { CommonService } from './common.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let commonServiceSpy: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['getWeatherData']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: CommonService, useValue: commonServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeLocation should open developer profile in a new tab', () => {
    const openSpy = spyOn(window, 'open');

    component.changeLocation();

    expect(openSpy).toHaveBeenCalledWith(
      'https://brijesh9933.github.io/myPortfolio-dynamicDesign/',
      '_blank',
      'noopener,noreferrer'
    );

    // changeLocation currently does not toggle IsChangeLocation
    expect(component.IsChangeLocation).toBe(false);
  });

  it('transform should round values', () => {
    expect(component.transform(10.2)).toBe(10);
    expect(component.transform(10.8)).toBe(11);
  });

  it('getBackgroundImageUrl should return none when no data', () => {
    component.weatherData = undefined;
    expect(component.getBackgroundImageUrl()).toBe('none');
  });

  it('getBackgroundImageUrl should slugify main condition', () => {
    component.weatherData = {
      weather: [{ main: 'Overcast Clouds' }]
    };
    expect(component.getBackgroundImageUrl()).toBe('url(/assets/bg-overcast-clouds.jpg)');
  });

  it('getSunriseTime/getSunsetTime should return --:-- for invalid input', () => {
    component.weatherData = undefined;
    expect(component.getSunriseTime()).toBe('--:--');
    expect(component.getSunsetTime()).toBe('--:--');
  });

  it('toTimeFromUnixSeconds should return --:-- when unixSeconds is invalid', () => {
    component.weatherData = { timezone: 3600 } as any;
    expect((component as any).toTimeFromUnixSeconds(undefined)).toBe('--:--');
    expect((component as any).toTimeFromUnixSeconds('0' as any)).toBe('--:--');
  });


  it('applyDerivedUIState should set status to Safe and compute progressPercent (temp in range)', () => {
    component.weatherData = { main: { temp: 20 }, timezone: 0, sys: {} };
    // access private method via bracket notation
    (component as any).applyDerivedUIState();

    expect(component.statusText).toBe('Safe');
    expect(component.statusClass).toBe('safe');

    // progress: ((20 - (-10)) / (50 - (-10))) * 100 = 50
    expect(component.progressPercent).toBe(50);
    expect(component.week.length).toBe(7);
  });

  it('applyDerivedUIState should set status to Dangerous when temp >= 35', () => {
    component.weatherData = { main: { temp: 35 }, timezone: 0, sys: {} };
    (component as any).applyDerivedUIState();

    expect(component.statusText).toBe('Dangerous');
    expect(component.statusClass).toBe('danger');
  });

  it('applyDerivedUIState should set status to Dangerous when temp <= 0', () => {
    component.weatherData = { main: { temp: 0 }, timezone: 0, sys: {} };
    (component as any).applyDerivedUIState();

    expect(component.statusText).toBe('Dangerous');
    expect(component.statusClass).toBe('danger');
  });

  it('getWeatherDataByCity should populate recentSearches and applyDerivedUIState', () => {
    // Provide a fake jQuery value
    (globalThis as any).$ = () => ({
      val: () => 'London'
    });

    const mockApiResponse = {
      main: {
        temp: 20.4,
        feels_like: 18.2,
        humidity: 60,
        temp_max: 25.0,
        temp_min: 15.0
      },
      timezone: 0,
      weather: [{ main: 'Clear', description: 'clear sky' }],
      sys: { sunrise: 0, sunset: 0 }
    };

    commonServiceSpy.getWeatherData.and.returnValue(of(mockApiResponse));

    // Spy on private applyDerivedUIState to avoid duplicating date logic checks
    const derivedSpy = spyOn<any>(component, 'applyDerivedUIState').and.callThrough();

    component.getWeatherDataByCity();

    expect(commonServiceSpy.getWeatherData).toHaveBeenCalledWith('London');

    // recentSearches should contain latest on top and be rounded
    expect(component.recentSearches.length).toBe(1);
    expect(component.recentSearches[0]).toEqual({
      city: 'London',
      temp: 20,
      feelsLike: 18,
      humidity: 60,
      description: 'clear sky'
    });

    expect(derivedSpy).toHaveBeenCalled();
    expect(component.cityName).toBe('London');
  });
});

