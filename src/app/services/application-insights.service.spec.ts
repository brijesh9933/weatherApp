import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationInsightsService } from './application-insights.service';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { of } from 'rxjs';

describe('ApplicationInsightsService', () => {
  let service: ApplicationInsightsService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ApplicationInsightsService]
    });
    service = TestBed.inject(ApplicationInsightsService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logPageView', () => {
    it('should call trackPageView with given parameters', () => {
      const spy = spyOn(service, 'trackPageView');
      service.logPageView('test-page', '/test', { key: 'value' });
      expect(spy).toHaveBeenCalledWith('test-page', '/test', { key: 'value' });
    });

    it('should call trackPageView with no parameters', () => {
      const spy = spyOn(service, 'trackPageView');
      service.logPageView();
      expect(spy).toHaveBeenCalledWith(undefined, undefined, undefined);
    });
  });

  describe('trackPageView', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.trackPageView('test', '/test')).not.toThrow();
    });
  });

  describe('logEvent', () => {
    it('should call trackEvent with given parameters', () => {
      const spy = spyOn(service, 'trackEvent');
      service.logEvent('test-event', { key: 'value' });
      expect(spy).toHaveBeenCalledWith('test-event', { key: 'value' });
    });

    it('should call trackEvent with no properties', () => {
      const spy = spyOn(service, 'trackEvent');
      service.logEvent('test-event');
      expect(spy).toHaveBeenCalledWith('test-event', undefined);
    });
  });

  describe('trackEvent', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.trackEvent('test')).not.toThrow();
    });
  });

  describe('logException', () => {
    it('should call trackException with Error object', () => {
      const spy = spyOn(service, 'trackException');
      const error = new Error('Test error');
      service.logException(error, { context: 'test' });
      expect(spy).toHaveBeenCalledWith(error, { context: 'test' });
    });

    it('should call trackException with string', () => {
      const spy = spyOn(service, 'trackException');
      service.logException('String error');
      expect(spy).toHaveBeenCalledWith('String error', undefined);
    });

    it('should call trackException with object', () => {
      const spy = spyOn(service, 'trackException');
      const errorObj = { message: 'Error', code: 500 };
      service.logException(errorObj);
      expect(spy).toHaveBeenCalledWith(errorObj, undefined);
    });
  });

  describe('trackException', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.trackException(new Error('test'))).not.toThrow();
    });
  });

  describe('logMetric', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.logMetric('test-metric', 100)).not.toThrow();
    });

    it('should not throw with properties', () => {
      expect(() => service.logMetric('test-metric', 100, { unit: 'ms' })).not.toThrow();
    });
  });

  describe('initializeRouteTracking', () => {
    it('should not throw when router events are emitted', () => {
      expect(() => service.initializeRouteTracking(router)).not.toThrow();
    });

    it('should handle multiple calls gracefully', () => {
      service.initializeRouteTracking(router);
      expect(() => service.initializeRouteTracking(router)).not.toThrow();
    });
  });

  describe('initializeUserContext', () => {
    it('should return a user ID string', () => {
      const userId = service.initializeUserContext();
      expect(typeof userId).toBe('string');
      expect(userId.length).toBeGreaterThan(0);
    });

    it('should return user ID starting with weather-user-', () => {
      const userId = service.initializeUserContext();
      expect(userId).toMatch(/^weather-user-/);
    });
  });

  describe('setAuthenticatedUserContext', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.setAuthenticatedUserContext('user123')).not.toThrow();
    });
  });

  describe('clearAuthenticatedUserContext', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.clearAuthenticatedUserContext()).not.toThrow();
    });
  });

  describe('flush', () => {
    it('should not throw when appInsights is not initialized', () => {
      expect(() => service.flush()).not.toThrow();
    });
  });
});