import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationInsightsService } from './services/application-insights.service';

describe('CommonService', () => {
  let service: CommonService;
  let httpMock: HttpTestingController;
  let applicationInsightsServiceSpy: jasmine.SpyObj<ApplicationInsightsService>;

  beforeEach(() => {
    applicationInsightsServiceSpy = jasmine.createSpyObj('ApplicationInsightsService', ['trackException']);

    TestBed.configureTestingModule({
    imports: [],
    providers: [
      CommonService,
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      { provide: ApplicationInsightsService, useValue: applicationInsightsServiceSpy }
    ]
});

    service = TestBed.inject(CommonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWeatherData should call the correct url and return the response', () => {
    const city = 'London';
    const expectedUnits = 'metric';
    const mockResponse = {
      coord: { lon: -0.1257, lat: 51.5085 },
      weather: [{ main: 'Clouds' }],
      main: { temp: 12.34 }
    };
    service.getWeatherData(city).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
    const encodedCity = encodeURIComponent(city);
    const expectedUrl = `${environment.weatherApiUrl}/weather?q=${encodedCity}&appid=${environment.weatherApiKey}&units=${expectedUnits}`;
    const req = httpMock.expectOne((r) => r.url === expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch weather data for a city', () => {
    const city = 'London';
    const mockResponse = { weather: 'sunny' };
    const expectedUrl = `${environment.weatherApiUrl}/weather?q=${city}&appid=${environment.weatherApiKey}&units=metric`;
    service.getWeatherData(city).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getWeatherData should track API failures', (done) => {
    const city = 'London';
    const expectedUrl = `${environment.weatherApiUrl}/weather?q=${city}&appid=${environment.weatherApiKey}&units=metric`;

    service.getWeatherData(city).subscribe({
      next: () => fail('expected request to fail'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(applicationInsightsServiceSpy.trackException).toHaveBeenCalledWith(
          error,
          {
            city,
            operation: 'getWeatherData'
          }
        );
        done();
      }
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush('server error', { status: 500, statusText: 'Server Error' });
  });

});

