import { NextRequest, NextResponse } from "next/server";

import { verifyAdminRequest } from "../../auth/utils";

import {
  getServiceById,
  updateService,
  deleteService,
} from "@/lib/supabase-data";

// GET a single service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await getServiceById(params.id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Format the response to match the app's expected format
    const formattedService = {
      id: service.id,
      title: service.title,
      description: service.description,
      image: service.image_url, // Map image_url to image for consistency
    };

    return NextResponse.json(formattedService);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching service:", error);

    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT to update a service (protected, admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First verify the admin token
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate the service data
    if (!data.title && !data.description && !data.image) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedService = await updateService(params.id, {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.image && { image_url: data.image }), // Map image to image_url for Supabase
    });

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Format the response to match the app's expected format
    const formattedService = updatedService
      ? {
          id: updatedService.id,
          title: updatedService.title,
          description: updatedService.description,
          image: updatedService.image_url, // Map back to image for consistency
        }
      : null;

    return NextResponse.json(formattedService);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating service:", error);

    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE a service (protected, admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First verify the admin token
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await deleteService(params.id);

    if (!success) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting service:", error);

    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
