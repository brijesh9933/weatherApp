import { environment } from '../../environments/environment';

// Use current origin for localhost/dev so MSAL returns to the correct redirectUri.
// For production, fall back to the configured environment.redirectUri.
const getRedirectUri = (): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // MSAL will send redirectUri exactly as configured.
  // Your Azure config likely expects trailing slash.
  if (origin.startsWith('http://localhost') || origin.startsWith('https://localhost')) {
    return origin.endsWith('/') ? origin : `${origin}/`;
  }
  return environment.redirectUri;
};


export const msalConfig = {
  auth: {
    clientId: environment.clientId,
    authority: `https://login.microsoftonline.com/${environment.authorityTenant}`,
    redirectUri: getRedirectUri()
  }
};

