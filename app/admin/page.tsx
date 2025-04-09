"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { fontCaladea } from "@/config/fonts";

export default function AdminPage() {
  const router = useRouter();
  // We don't need to track authentication state since middleware handles it
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the component
  useEffect(() => {
    // The middleware handles redirects for authentication
    setIsLoading(false);
  }, []);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin" />
      </div>
    );
  }

  // All users who reach this component are already authenticated by middleware
  // so we don't need to check authentication here anymore

  // If authenticated, show admin dashboard
  return (
    <div className={`${fontCaladea.className} min-h-screen bg-[#f8f38d] p-8`}>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">Content Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-md">
            <h3 className="text-xl mb-3">Products</h3>
            <p className="text-gray-600 mb-4">
              Manage products displayed in the Products tab
            </p>
            <button
              className="bg-[#634647] text-white px-4 py-2 rounded hover:bg-opacity-90"
              onClick={() => router.push("/admin/products")}
            >
              Edit Products
            </button>
          </div>

          <div className="border p-4 rounded-md">
            <h3 className="text-xl mb-3">Services</h3>
            <p className="text-gray-600 mb-4">
              Manage services displayed in the Services tab
            </p>
            <button
              className="bg-[#634647] text-white px-4 py-2 rounded hover:bg-opacity-90"
              onClick={() => router.push("/admin/services")}
            >
              Edit Services
            </button>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={async () => {
              try {
                // Call logout API endpoint
                const response = await fetch("/api/auth/logout", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (response.ok) {
                  // Redirect to home page after logout
                  router.push("/");
                } else {
                  // eslint-disable-next-line no-console
                  console.error("Logout failed");
                }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Logout error:", error);
              }
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
