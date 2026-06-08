import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { msalConfig } from '../auth/auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalInstance = new PublicClientApplication(msalConfig);
  private initialized = false;
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  public loginStatus$ = this.loginStatusSubject.asObservable();

  constructor() {
    this.msalInstance.initialize().then(() => {
      this.initialized = true;
      // Handle redirect after login
      this.msalInstance.handleRedirectPromise()
        .then((response: AuthenticationResult | null) => {
          if (response) {
            this.msalInstance.setActiveAccount(response.account);
            this.loginStatusSubject.next(true);
          } else {
            const activeAccount = this.msalInstance.getActiveAccount();
            if (activeAccount) {
              this.loginStatusSubject.next(true);
            }
          }
        })
        .catch((error: unknown) => {
          console.error('Redirect error:', error);
          this.loginStatusSubject.next(false);
        });
    }).catch((error: unknown) => {
      console.error('MSAL initialization failed', error);
    });
  }

  get isLoggedIn() {
    return this.initialized && !!this.msalInstance.getActiveAccount();
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus$;
  }

  private ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }
    return this.msalInstance.initialize().then(() => {
      this.initialized = true;
    });
  }

  login() {
    this.ensureInitialized()
      .then(() => this.msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'User.Read']
      }))
      .catch((error: unknown) => {
        console.error('Login failed', error);
      });
  }

  logout() {
    this.ensureInitialized()
      .then(() => this.msalInstance.logoutRedirect())
      .catch((error: unknown) => {
        console.error('Logout failed', error);
      });
  }
}
