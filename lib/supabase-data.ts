import { createClient } from "@supabase/supabase-js";

import { Product, Service } from "./supabase";

// Create service role client for admin operations that bypass RLS
// This should ONLY be used in server-side contexts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const adminSupabase = createClient(supabaseUrl, supabaseServiceRole);

// PRODUCT OPERATIONS
// ==================

/**
 * Get all products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  // eslint-disable-next-line no-console
  console.log("Getting products with admin client to bypass RLS");

  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching products:", error);

      return [];
    }

    // eslint-disable-next-line no-console
    console.log(`Found ${data?.length || 0} products`);

    return data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in getProducts:", err);

    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching product:", error);

      return null;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in getProductById:", err);

    return null;
  }
}

/**
 * Add a new product
 */
export async function addProduct(
  product: Omit<Product, "id" | "created_at">,
): Promise<Product | null> {
  // Log the product being inserted
  // eslint-disable-next-line no-console
  console.log(
    "Attempting to insert product:",
    JSON.stringify(product, null, 2),
  );
  // eslint-disable-next-line no-console
  console.log(
    "Supabase URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
  );
  // eslint-disable-next-line no-console
  console.log("Using service role client for admin operation");

  try {
    // Use the adminSupabase client which bypasses RLS with service role key
    const { data, error } = await adminSupabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error adding product (details):", error);
      // eslint-disable-next-line no-console
      console.error("Error code:", error.code);
      // eslint-disable-next-line no-console
      console.error("Error message:", error.message);
      // eslint-disable-next-line no-console
      console.error("Error details:", error.details);

      return null;
    }

    // eslint-disable-next-line no-console
    console.log("Product added successfully:", data);

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in addProduct:", err);

    return null;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "created_at">>,
): Promise<Product | null> {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating product:", error);

      return null;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in updateProduct:", err);

    return null;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting product:", error);

      return false;
    }

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in deleteProduct:", err);

    return false;
  }
}

// SERVICE OPERATIONS
// =================

/**
 * Get all services from Supabase
 */
export async function getServices(): Promise<Service[]> {
  // eslint-disable-next-line no-console
  console.log("Getting services with admin client to bypass RLS");

  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching services:", error);

      return [];
    }

    // eslint-disable-next-line no-console
    console.log(`Found ${data?.length || 0} services`);

    return data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in getServices:", err);

    return [];
  }
}

/**
 * Get a single service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching service:", error);

      return null;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in getServiceById:", err);

    return null;
  }
}

/**
 * Add a new service
 */
export async function addService(
  service: Omit<Service, "id" | "created_at">,
): Promise<Service | null> {
  // Log the service being inserted
  // eslint-disable-next-line no-console
  console.log(
    "Attempting to insert service:",
    JSON.stringify(service, null, 2),
  );
  // eslint-disable-next-line no-console
  console.log("Using service role client for admin operation");

  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("services")
      .insert([service])
      .select()
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error adding service (details):", error);
      // eslint-disable-next-line no-console
      console.error("Error code:", error.code);
      // eslint-disable-next-line no-console
      console.error("Error message:", error.message);
      // eslint-disable-next-line no-console
      console.error("Error details:", error.details);

      return null;
    }

    // eslint-disable-next-line no-console
    console.log("Service added successfully:", data);

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in addService:", err);

    return null;
  }
}

/**
 * Update an existing service
 */
export async function updateService(
  id: string,
  updates: Partial<Omit<Service, "id" | "created_at">>,
): Promise<Service | null> {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from("services")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating service:", error);

      return null;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in updateService:", err);

    return null;
  }
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<boolean> {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting service:", error);

      return false;
    }

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Exception in deleteService:", err);

    return false;
  }
}
