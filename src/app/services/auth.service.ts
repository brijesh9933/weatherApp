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

      // Handle redirect after login (if this load was part of redirect flow)
      this.msalInstance
        .handleRedirectPromise()
        .then((_response: AuthenticationResult | null) => {
          // If a redirect response exists, MSAL account is usually available there.
          // If redirect response is null (common on some refreshes), try to recover
          // an account from the MSAL cache so guards/UI work immediately.
          const account = this.msalInstance.getActiveAccount();
          const active = account;
          
          if (!active) {
            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
              // Pick the first cached account. Alternatively, pick based on homeAccountId.
              this.msalInstance.setActiveAccount(accounts[0]);
            }
          }
          this.loginStatusSubject.next(!!this.msalInstance.getActiveAccount());
        })
        .catch(() => {
          this.loginStatusSubject.next(!!this.msalInstance.getActiveAccount());
        });
    }).catch(() => {
      this.loginStatusSubject.next(false);
    });
  }

  get isLoggedIn() {
    return this.initialized && !!this.msalInstance.getActiveAccount();
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus$;
  }

  // Expose MSAL account info to UI (e.g., Profile page)
  getActiveAccount(): AccountInfo | null {
    return this.msalInstance.getActiveAccount() ?? this.msalInstance.getAllAccounts()[0] ?? null;
  }

  getAllAccounts(): AccountInfo[] {
    return this.msalInstance.getAllAccounts();
  }

  getActiveAccountName(): string {
    const account = this.getActiveAccount();
    return account?.name ?? account?.username ?? '';
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
      .catch(() => {
        // Intentionally ignore here; auth failures are handled by MSAL/guards.
      });
  }

  logout() {
    this.ensureInitialized()
      .then(() => this.msalInstance.logoutRedirect())
      .catch(() => {
        // Intentionally ignore here; auth failures are handled by MSAL/guards.
      });
  }
}

