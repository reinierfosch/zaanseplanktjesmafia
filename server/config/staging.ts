/**
 * Staging environment configuration
 */
export const stagingConfig = {
  database: {
    name: process.env.STAGING_DB_NAME || "staging_plankjes_maffia",
    prefix: "staging_",
  },
  subdomain: process.env.STAGING_SUBDOMAIN || "staging.plankjesmaffia.nl",
  environment: "staging",
  features: {
    emailNotifications: process.env.STAGING_EMAIL_ENABLED === "true",
    analytics: false,
  },
};

