import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  it('should allow Admin when username matches', () => {
    const guard = roleGuard('Admin');

    const auth = {
      isLoggedIn: true,
      getActiveAccount: () => ({ username: 'sharma9933.brijesh@gmail.com' }) as any
    } as AuthService;

    const router = {
      parseUrl: (_: any) => true
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeTrue();
  });

  it('should block non-admin user', () => {
    const guard = roleGuard('Admin');

    const auth = {
      isLoggedIn: true,
      getActiveAccount: () => ({ username: 'someoneelse@test.com' }) as any
    } as AuthService;

    const router = {
      parseUrl: (_: any) => true
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeFalse();
  });

  it('should block when user is not logged in', () => {
    const guard = roleGuard('Admin');

    const auth = {
      isLoggedIn: false,
      getActiveAccount: () => null
    } as AuthService;

    const router = {
      parseUrl: (_: any) => false
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeFalse();
  });

  it('should allow access when role is provided', () => {
    const guard = roleGuard('User');

    const auth = {
      isLoggedIn: true,
      getActiveAccount: () => ({ username: 'anyone@test.com' }) as any
    } as AuthService;

    const router = {
      parseUrl: (_: any) => true
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeTrue();
  });

  it('should handle null active account', () => {
    const guard = roleGuard('Admin');

    const auth = {
      isLoggedIn: true,
      getActiveAccount: () => null
    } as AuthService;

    const router = {
      parseUrl: (_: any) => false
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeFalse();
  });

  it('should allow admin with different email variations', () => {
    const guard = roleGuard('Admin');

    const auth = {
      isLoggedIn: true,
      getActiveAccount: () => ({ username: 'SHARMA9933.BRIJESH@GMAIL.COM' }) as any
    } as AuthService;

    const router = {
      parseUrl: (_: any) => true
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeTrue();
  });

  it('should block user with partial email match', () => {
    const guard = roleGuard('Admin');

    const auth = {
      isLoggedIn: true,
      getActiveAccount: () => ({ username: 'admin@gmail.com' }) as any
    } as AuthService;

    const router = {
      parseUrl: (_: any) => false
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });

    const res = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(res).toBeFalse();
  });
});

