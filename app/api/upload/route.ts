import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

import { verifyAdminRequest } from "@/auth/utils";

// Create a Supabase admin client with the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check for required environment variables
if (!supabaseUrl || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing required environment variables for Supabase admin client",
  );
  // We'll handle this in the route handler by checking if supabaseAdmin is null
}

// Admin client for operations that need to bypass RLS - only create if we have valid credentials
const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null; // Set to null if we don't have valid credentials

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line no-console
    console.log("Upload endpoint triggered");

    // Verify admin authentication
    try {
      // eslint-disable-next-line no-console
      console.log("About to verify admin...");
      const adminAuth = await verifyAdminRequest();

      // eslint-disable-next-line no-console
      console.log("Admin verification result:", {
        isValid: adminAuth.isValid,
        error: adminAuth.error,
      });

      if (!adminAuth.isValid) {
        // eslint-disable-next-line no-console
        console.error("Admin authentication failed:", adminAuth.error);

        return NextResponse.json(
          {
            error: "Unauthorized - Admin authentication required",
            details: adminAuth.error,
          },
          { status: 401 },
        );
      }
    } catch (authCheckError) {
      // eslint-disable-next-line no-console
      console.error("Error during admin verification:", authCheckError);

      return NextResponse.json(
        { error: "Auth check error", details: String(authCheckError) },
        { status: 500 },
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload an image (JPEG, PNG, WEBP, or GIF).",
        },
        { status: 400 },
      );
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    // Generate unique file name
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Convert file to arrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      // eslint-disable-next-line no-console
      console.error(
        "Supabase admin client is not initialized - check your environment variables",
      );

      return NextResponse.json(
        { error: "File upload service is not properly configured" },
        { status: 500 },
      );
    }

    try {
      // eslint-disable-next-line no-console
      console.log("Attempting to upload file to Supabase...");

      // Upload file to Supabase Storage using admin client to bypass RLS
      const { error } = await supabaseAdmin.storage
        .from("images")
        .upload(`products-services/${fileName}`, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Supabase upload error:", error);

        return NextResponse.json(
          { error: `Failed to upload file: ${error.message}` },
          { status: 500 },
        );
      }

      // eslint-disable-next-line no-console
      console.log("File upload successful, getting public URL...");

      // Get the public URL using admin client
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage
        .from("images")
        .getPublicUrl(`products-services/${fileName}`);

      return NextResponse.json({ success: true, url: publicUrl });
    } catch (supabaseError) {
      // eslint-disable-next-line no-console
      console.error("Error during Supabase operations:", supabaseError);

      return NextResponse.json(
        { error: `Supabase operation failed: ${String(supabaseError)}` },
        { status: 500 },
      );
    }
  } catch (error) {
    // Provide more detailed error information to help debugging
    // eslint-disable-next-line no-console
    console.error("Unhandled error in upload endpoint:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
