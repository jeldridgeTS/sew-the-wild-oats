/**
 * Authentication Configuration
 *
 * SECURITY WARNING:
 * - Default values provided here are FOR DEVELOPMENT ONLY
 * - Production environments MUST provide environment variables
 * - Never commit production secrets to source control
 */

// Verify required environment variables in production
function requireEnvInProduction(name: string, value: string | undefined): void {
  if (process.env.NODE_ENV === "production" && !value) {
    throw new Error(`${name} environment variable is required in production`);
  }
}

// Check required security environment variables
requireEnvInProduction("JWT_SECRET", process.env.JWT_SECRET);
requireEnvInProduction("ADMIN_USERNAME", process.env.ADMIN_USERNAME);
requireEnvInProduction("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD);

/**
 * JWT Configuration
 * In production: Set via environment variables only
 * In development: Falls back to secure defaults
 */
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? "" // Empty string would fail if accidentally used in production
    : "DEV_ONLY_SECRET_7a6cdd2f-d4e2-4c37-9b60-df09af6c853b"); // Random UUID for dev

export const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d"; // Token expiry - 7 days

/**
 * Admin Authentication Credentials
 * In production: MUST be set via environment variables
 * In development: Falls back to obvious dev-only values
 */
export const ADMIN_USERNAME =
  process.env.ADMIN_USERNAME ||
  (process.env.NODE_ENV === "production" ? "" : "dev_admin");

export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  (process.env.NODE_ENV === "production" ? "" : "dev_password_only");
