import { NextRequest, NextResponse } from "next/server";

import { verifyAdminRequest } from "../auth/utils";

import { getProducts, addProduct } from "@/lib/supabase-data";

// GET all products
export async function GET() {
  try {
    const products = await getProducts();

    // Map the Supabase format to the existing app format
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image_url, // Map image_url to image to maintain compatibility
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST a new product (protected, admin only)
export async function POST(request: NextRequest) {
  try {
    // First verify the admin token
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate the product data
    if (!data.title || !data.description || !data.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const newProduct = await addProduct({
        title: data.title,
        description: data.description,
        image_url: data.image, // Map image to image_url for Supabase
      });

      // Format the response to match the app's expected format
      const formattedProduct = newProduct
        ? {
            id: newProduct.id,
            title: newProduct.title,
            description: newProduct.description,
            image: newProduct.image_url, // Map back to image for consistency
          }
        : null;

      return NextResponse.json(formattedProduct, { status: 201 });
    } catch (supabaseError) {
      // eslint-disable-next-line no-console
      console.error("Supabase error details:", supabaseError);

      return NextResponse.json(
        {
          error: "Failed to create product in Supabase",
          details: supabaseError,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating product:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
