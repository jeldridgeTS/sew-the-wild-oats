import { NextRequest, NextResponse } from "next/server";

import { verifyAdminRequest } from "../auth/utils";

import { getServices, addService } from "@/lib/supabase-data";

// GET all services
export async function GET() {
  try {
    const services = await getServices();

    // Map the Supabase format to the existing app format
    const formattedServices = services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      image: service.image_url, // Map image_url to image to maintain compatibility
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching services:", error);

    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

// POST a new service (protected, admin only)
export async function POST(request: NextRequest) {
  try {
    // First verify the admin token
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate the service data
    if (!data.title || !data.description || !data.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newService = await addService({
      title: data.title,
      description: data.description,
      image_url: data.image, // Map image to image_url for Supabase
    });

    // Format the response to match the app's expected format
    const formattedService = newService
      ? {
          id: newService.id,
          title: newService.title,
          description: newService.description,
          image: newService.image_url, // Map back to image for consistency
        }
      : null;

    return NextResponse.json(formattedService, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating service:", error);

    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
