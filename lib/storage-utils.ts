import { createClient } from "@supabase/supabase-js";

// Create an admin client with the service role key for storage operations that need to bypass RLS
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

/**
 * Upload an image to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket (default: 'images')
 * @param path Optional path within the bucket
 * @returns URL of the uploaded image or null if failed
 */
export async function uploadImage(
  file: File,
  bucket = "images",
  path = "",
): Promise<string | null> {
  try {
    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Upload file to Supabase Storage using admin client to bypass RLS
    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error uploading image:", error);

      return null;
    }

    // Get the public URL for the file
    const {
      data: { publicUrl },
    } = adminSupabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in uploadImage:", error);

    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url The URL of the image to delete
 * @param bucket The storage bucket (default: 'images')
 * @returns true if successful, false otherwise
 */
export async function deleteImage(
  url: string,
  bucket = "images",
): Promise<boolean> {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split(`/${bucket}/`)[1];

    if (!path) {
      // eslint-disable-next-line no-console
      console.error("Could not parse image path from URL:", url);

      return false;
    }

    // Delete file from Supabase Storage using admin client to bypass RLS
    const { error } = await adminSupabase.storage.from(bucket).remove([path]);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting image:", error);

      return false;
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in deleteImage:", error);

    return false;
  }
}
