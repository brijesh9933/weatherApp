/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ApplicationInsightsService } from './services/application-insights.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let applicationInsightsServiceSpy: jasmine.SpyObj<ApplicationInsightsService>;

  beforeEach(async () => {
    applicationInsightsServiceSpy = jasmine.createSpyObj('ApplicationInsightsService', [
      'initializeUserContext',
      'initializeRouteTracking'
    ]);
    applicationInsightsServiceSpy.initializeUserContext.and.returnValue('weather-user-test');

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterModule],
      providers: [
        provideRouter([]),
        { provide: ApplicationInsightsService, useValue: applicationInsightsServiceSpy }
      ]
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

  it('should initialize Application Insights route tracking on startup', () => {
    expect(applicationInsightsServiceSpy.initializeUserContext).toHaveBeenCalled();
    expect(applicationInsightsServiceSpy.initializeRouteTracking).toHaveBeenCalled();
  });
});
