import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { JWT_SECRET } from "./config";

// Types for JWT token payload
export interface JwtPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifyToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as JwtPayload);
    });
  });
}

/**
 * Check if a token is valid and has admin role
 */
export async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token);

    return payload && payload.role === "admin";
  } catch (error) {
    return false;
  }
}

/**
 * Verify admin authentication from a NextRequest object
 * Extracts token from cookies and verifies admin role
 */
export async function verifyAdminRequest(
  request: NextRequest,
): Promise<boolean> {
  try {
    // Get token from cookies
    const token = request.cookies.get("admin_auth_token")?.value;

    if (!token) {
      return false;
    }

    // Verify token has admin role
    return await isValidAdminToken(token);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error verifying admin request:", error);

    return false;
  }
}
