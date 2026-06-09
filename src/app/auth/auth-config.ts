import { environment } from '../../environments/environment';

// MSAL redirectUri must match the current host.
// - Localhost build -> redirects to http(s)://localhost:... 
// - Deployed build  -> redirects to https://<your-webapp-host>/...
// We therefore always use window.location.origin when running in the browser.
const getRedirectUri = (): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  if (origin) {
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


