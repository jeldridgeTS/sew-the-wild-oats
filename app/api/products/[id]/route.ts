import { NextRequest, NextResponse } from "next/server";

import { verifyAdminRequest } from "../../auth/utils";

import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/supabase-data";

// GET a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching product:", error);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT to update a product (protected, admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // First verify the admin token
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate the product data
    if (!data.title && !data.description && !data.image) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updatedProduct = await updateProduct(params.id, {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.image && { image: data.image }),
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating product:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE a product (protected, admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // First verify the admin token
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await deleteProduct(params.id);

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting product:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
