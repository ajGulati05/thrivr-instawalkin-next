require('dotenv').config();
// const generateSitemap = require('./scripts/generate-sitemap');
module.exports = {
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    SENTRY_DNS_KEY: process.env.SENTRY_DNS_KEY,
    TIMEKIT_BOOKING_APP_KEY: process.env.TIMEKIT_BOOKING_APP_KEY,
    TIMEKIT_BOOKING_PROJECT_ID: process.env.TIMEKIT_BOOKING_PROJECT_ID,
    LOGIN_URL: process.env.LOGIN_URL,
    ADDRESS_AUTOCOMPLETE_API_KEY: process.env.ADDRESS_AUTOCOMPLETE_API_KEY,
    CLIENT_SECRET_AUTH: process.env.CLIENT_SECRET_AUTH,
    CLIENT_ID_AUTH: process.env.CLIENT_ID_AUTH,
    STRIPE_KEY: process.env.STRIPE_KEY,
    GOOGLE_TAG_KEY: process.env.GOOGLE_TAG_KEY,
    GOOGLE_TAG_VAR: process.env.GOOGLE_TAG_VAR,
    API_URL: process.env.API_URL,
    FORM_ENCRYPT_KEY: process.env.FORM_ENCRYPT_KEY,
    FORM_DECRYPT_KEY: process.env.FORM_DECRYPT_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    BASE_VERSION: process.env.BASE_VERSION,
    BASE_PREFIX: process.env.BASE_PREFIX,
    WEBAPP_URL: process.env.WEBAPP_URL,
  },
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // generateSitemap();
    }
    return config;
  },
};
