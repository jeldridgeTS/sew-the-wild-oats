import { createClient } from "@supabase/supabase-js";

// These environment variables need to be set in your Vercel project
// and in your .env.local file for local development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Product = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at?: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at?: string;
};
