import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export type AppRole = 'Admin' | 'User';

const computeRole = (usernameOrEmail?: string | null): AppRole => {
  const email = (usernameOrEmail ?? '').toLowerCase();
  return email === 'sharma9933.brijesh@gmail.com' ? 'Admin' : 'User';
};

/**
 * Usage:
 * - canActivate: [roleGuard('Admin')]
 * - returns true only when user is logged in and role matches.
 */
export const roleGuard = (...allowedRoles: AppRole[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn) {
      return router.parseUrl('/profile');
    }

    const active = auth.getActiveAccount();
    const role = computeRole(active?.username ?? active?.name ?? '');

    return allowedRoles.length === 0 ? true : allowedRoles.includes(role);
  };
};

