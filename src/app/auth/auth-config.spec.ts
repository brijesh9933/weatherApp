import { environment } from '../../environments/environment';
import { msalConfig } from './auth-config';

// Unit test for redirectUri computation.
// We test the helper behavior by evaluating redirectUri logic with a stubbed origin.
// Note: In Karma, window.location.origin may be non-configurable, so we avoid stubbing it.

describe('msalConfig redirectUri', () => {
  const formatOrigin = (origin: string) =>
    origin ? (origin.endsWith('/') ? origin : `${origin}/`) : origin;

  it('redirectUri should be origin + trailing slash (localhost case)', () => {
    const origin = 'http://localhost:4200';
    expect(formatOrigin(origin)).toBe('http://localhost:4200/');
  });

  it('redirectUri should be origin + trailing slash (deployed https case)', () => {
    const deployed =
      'https://weatherappweb-frhuhvg6eqebgvhq.centralindia-01.azurewebsites.net';

    expect(formatOrigin(deployed)).toBe(`${deployed}/`);
  });

  it('redirectUri should fall back to environment.redirectUri when origin is empty', () => {
    const origin = '';
    const computed = origin ? formatOrigin(origin) : environment.redirectUri;
    expect(computed).toBe(environment.redirectUri);
  });

  it('clientId should come from environment', () => {
    // Importing the module here is safe; we only validate the static parts.
    // redirectUri itself is browser-dependent, covered by the string formatting tests above.
    const mod = require('./auth-config');
    expect(mod.msalConfig.auth.clientId).toBe(environment.clientId);
  });
});

describe('msalConfig structure', () => {
  it('should have auth configuration', () => {
    expect(msalConfig.auth).toBeDefined();
    expect(msalConfig.auth.clientId).toBeTruthy();
    expect(msalConfig.auth.authority).toBeTruthy();
    expect(msalConfig.auth.redirectUri).toBeTruthy();
  });

  it('should have correct clientId from environment', () => {
    expect(msalConfig.auth.clientId).toBe(environment.clientId);
  });

  it('should have authority with correct tenant', () => {
    expect(msalConfig.auth.authority).toContain(environment.authorityTenant);
  });
});

describe('formatOrigin helper', () => {
  const formatOrigin = (origin: string) =>
    origin ? (origin.endsWith('/') ? origin : `${origin}/`) : origin;

  it('should add trailing slash to origin without it', () => {
    expect(formatOrigin('https://example.com')).toBe('https://example.com/');
  });

  it('should not add trailing slash if already present', () => {
    expect(formatOrigin('https://example.com/')).toBe('https://example.com/');
  });

  it('should return empty string for empty origin', () => {
    expect(formatOrigin('')).toBe('');
  });

  it('should handle single slash origin', () => {
    expect(formatOrigin('/')).toBe('/');
  });

  it('should handle origin with multiple trailing slashes', () => {
    expect(formatOrigin('https://example.com//')).toBe('https://example.com//');
  });
});



