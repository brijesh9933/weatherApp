import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';

describe('CommonService', () => {
  let service: CommonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommonService]
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
});

