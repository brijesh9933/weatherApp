import { environment } from '../../environments/environment';

export const msalConfig = {
  auth: {
    clientId: environment.clientId,
    authority: `https://login.microsoftonline.com/${environment.authorityTenant}`,
    redirectUri: environment.redirectUri
  }
};
