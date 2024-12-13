export const env = {
  NODE_ENV: process.env.NODE_ENV!,

  /** helper, not a real env var */

  isDev: process.env.NODE_ENV === "development",
  DATABASE_URL: process.env.DATABASE_URL!,
  GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY!,
  GOOGLE_RECAPTCHA_SECRET_KEY: process.env.GOOGLE_RECAPTCHA_SECRET_KEY!,
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME!,
  AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY!,
  AZURE_RESUME_SEARCH_API_KEY: process.env.AZURE_RESUME_SEARCH_API_KEY!,
};
