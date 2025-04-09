import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.set({
      name: "admin_auth_token",
      value: "",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Logout error:", error);

    return NextResponse.json(
      { success: false, message: "Error during logout" },
      { status: 500 }
    );
  }
}
