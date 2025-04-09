import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Import the same JWT_SECRET used for token creation to ensure consistency
import { JWT_SECRET } from "@/app/api/auth/config";

export type AdminAuthResult = {
  isValid: boolean;
  userId?: string;
  error?: string;
};

/**
 * Verifies an admin request by extracting and validating the admin token from cookies
 * @returns Promise<AdminAuthResult> with authentication result
 */
export async function verifyAdminRequest(): Promise<AdminAuthResult> {
  try {
    // Get admin token from cookies - wrap this in try/catch for better debugging
    let token: string | undefined;

    try {
      const cookieStore = cookies();

      token = cookieStore.get("admin_auth_token")?.value;

      // Debug log - will only show in server logs
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("Cookie extraction attempted", { cookieFound: !!token });
      }
    } catch (cookieError) {
      // eslint-disable-next-line no-console
      console.error("Error accessing cookies:", cookieError);

      return {
        isValid: false,
        error: `Error accessing cookies: ${cookieError instanceof Error ? cookieError.message : String(cookieError)}`,
      };
    }

    if (!token) {
      return { isValid: false, error: "No authentication token found" };
    }

    // Verify the token with more specific error handling
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        username: string;
        role: string;
      };

      // Check if this is an admin user
      if (decoded.role !== "admin") {
        return { isValid: false, error: "Not an admin user" };
      }

      return {
        isValid: true,
        userId: decoded.username, // Use username as userId for compatibility
      };
    } catch (jwtError) {
      // More specific JWT error handling to help debug issues
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("JWT verification error:", jwtError);
      }

      // Provide more specific error messages based on the type of JWT error
      if (jwtError instanceof jwt.TokenExpiredError) {
        return {
          isValid: false,
          error: "Authentication token has expired",
        };
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        return {
          isValid: false,
          error: "Invalid authentication token",
        };
      }

      return {
        isValid: false,
        error: `Token verification failed: ${jwtError instanceof Error ? jwtError.message : String(jwtError)}`,
      };
    }
  } catch (error) {
    // General catch-all for any other unexpected errors
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Unexpected error in verifyAdminRequest:", error);
    }

    return {
      isValid: false,
      error: "Authentication failed due to an unexpected error",
    };
  }
}
