import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import {
  JWT_SECRET,
  JWT_EXPIRY,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
} from "../config";

export async function POST(request: NextRequest) {
  try {
    // Get credentials from request body
    const body = await request.json();
    const { username, password } = body;

    // Check if credentials match (in a real app, you'd verify against a database)
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Set cookie with the token
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    // Set the cookie with HTTP only flag for security
    response.cookies.set({
      name: "admin_auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
