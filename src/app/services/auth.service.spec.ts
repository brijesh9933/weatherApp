import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication, Configuration, AccountInfo } from '@azure/msal-browser';
import { msalConfig } from '../auth/auth-config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MsalModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLoggedIn', () => {
    it('should return a boolean value', () => {
      const result = service.isLoggedIn;
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getLoginStatus', () => {
    it('should return an Observable', () => {
      const status$ = service.getLoginStatus();
      expect(status$).toBeDefined();
      expect(typeof status$.subscribe).toBe('function');
    });

    it('should emit boolean values', (done) => {
      let callCount = 0;
      service.getLoginStatus().subscribe((status) => {
        callCount++;
        expect(typeof status).toBe('boolean');
        if (callCount === 1) {
          done();
        }
      });
    });
  });

  describe('getActiveAccount', () => {
    it('should return AccountInfo or null', () => {
      const account = service.getActiveAccount();
      // Account can be null if not logged in
      expect(account === null || typeof account === 'object').toBeTruthy();
    });
  });

  describe('getAllAccounts', () => {
    it('should return an array', () => {
      const accounts = service.getAllAccounts();
      expect(Array.isArray(accounts)).toBe(true);
    });
  });

  describe('getActiveAccountName', () => {
    it('should return a string', () => {
      const name = service.getActiveAccountName();
      expect(typeof name).toBe('string');
    });
  });

  describe('login', () => {
    it('should not throw', () => {
      expect(() => service.login()).not.toThrow();
    });
  });

  describe('logout', () => {
    it('should not throw', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });
});