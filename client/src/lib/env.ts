/**
 * Environment variable validation utilities
 * Validates required environment variables and provides clear error messages
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please add ${key} to your .env file or environment configuration.`
    );
  }
  
  return value;
}

/**
 * Validates and returns the Google Maps API key
 * @throws Error if the API key is not set
 */
export function getMapsApiKey(): string {
  return getEnvVar("VITE_FRONTEND_FORGE_API_KEY");
}

/**
 * Validates and returns the Forge API base URL
 * @param defaultValue Optional default value if not set
 */
export function getForgeApiUrl(defaultValue = "https://forge.butterfly-effect.dev"): string {
  return getEnvVar("VITE_FRONTEND_FORGE_API_URL", defaultValue);
}

/**
 * Validates and returns the OAuth portal URL
 * @throws Error if the OAuth portal URL is not set
 */
export function getOAuthPortalUrl(): string {
  return getEnvVar("VITE_OAUTH_PORTAL_URL");
}

/**
 * Validates and returns the App ID
 * @throws Error if the App ID is not set
 */
export function getAppId(): string {
  return getEnvVar("VITE_APP_ID");
}

/**
 * Gets optional analytics endpoint
 */
export function getAnalyticsEndpoint(): string | undefined {
  return import.meta.env.VITE_ANALYTICS_ENDPOINT;
}

/**
 * Gets optional analytics website ID
 */
export function getAnalyticsWebsiteId(): string | undefined {
  return import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
}

