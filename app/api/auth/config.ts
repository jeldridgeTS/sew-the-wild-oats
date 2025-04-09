// JWT Configuration
// Using environment variables with fallbacks for development

// For security, JWT_SECRET should be set via environment variable in production
export const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-replace-in-production";
export const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d"; // Token expires in 7 days

// Admin credentials - in a real app, these should come from a secure database
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Change in production
