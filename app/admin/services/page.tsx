"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { fontCaladea } from "@/config/fonts";

// Define type for service items
type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load service data from API
  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(data);
        setMessage({ type: "", text: "" });
      } catch (error) {
        console.error("Error fetching services:", error);
        setMessage({
          type: "error",
          text: "Failed to load services. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  // Handler for deleting a service
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete service");
        }

        // Remove the service from the UI
        setServices(services.filter((service) => service.id !== id));
        setMessage({
          type: "success",
          text: "Service deleted successfully",
        });

        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        console.error("Error deleting service:", error);
        setMessage({
          type: "error",
          text: "Failed to delete service. Please try again.",
        });
      }
    }
  };

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${fontCaladea.className} min-h-screen p-8`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/services/new")}
            className="bg-[#634647] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Add New Service
          </button>
        </div>
      </div>

      {/* Success/Error message */}
      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Services list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {services.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No services found. Add your first service!
          </p>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-full md:w-48 h-48 relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, 192px"
                    unoptimized // Remove in production
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        router.push(`/admin/services/edit/${service.id}`)
                      }
                      className="bg-[#ddad81] text-[#634647] px-4 py-2 rounded hover:bg-opacity-80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
