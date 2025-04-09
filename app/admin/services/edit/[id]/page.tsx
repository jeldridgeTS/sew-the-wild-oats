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

export default function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState<Service>({
    id: "",
    title: "",
    description: "",
    image: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Mock image options - in a real app, these would come from an image library or upload system
  const imageOptions = [
    { src: "/quilt.jpg", alt: "Quilt" },
    { src: "/horse.jpg", alt: "Horse" },
    { src: "/goat.jpg", alt: "Goat" },
    { src: "/sewing.jpg", alt: "Sewing" },
    { src: "/alterations.jpg", alt: "Alterations" },
    { src: "/pattern.jpg", alt: "Pattern Making" },
  ];

  // Fetch service data from API on component mount
  useEffect(() => {
    async function fetchService() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Service not found");
          } else {
            throw new Error("Failed to fetch service");
          }

          return;
        }

        const service = await response.json();

        setFormData(service);
        setError("");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching service:", error);
        setError("Failed to load service data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchService();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectImage = (src: string) => {
    setFormData({
      ...formData,
      image: src,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      setError("Title is required");

      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");

      return;
    }

    if (!formData.image) {
      setError("Please select an image");

      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call the API to update the service
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      // Redirect back to services list
      router.push("/admin/services");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error updating service:", err);
      setError("Failed to update service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin" />
      </div>
    );
  }

  if (error === "Service not found") {
    return (
      <div className={`${fontCaladea.className} min-h-screen p-8`}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="mb-6">
            The service you are trying to edit does not exist.
          </p>
          <button
            className="bg-[#634647] text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => router.push("/admin/services")}
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${fontCaladea.className} min-h-screen p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Service</h1>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </button>
        </div>

        {error && error !== "Service not found" && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form
          className="bg-white rounded-lg shadow-md p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="title"
            >
              Service Title
            </label>
            <input
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#634647]"
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#634647]"
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <h3 className="block text-gray-700 mb-3 font-medium">
              Select an Image
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageOptions.map((image) => (
                <button
                  key={image.src}
                  aria-label={`Select ${image.alt} image`}
                  className={`
                    relative h-40 cursor-pointer border-2 rounded overflow-hidden
                    ${formData.image === image.src ? "border-[#634647]" : "border-transparent hover:border-[#ddad81]"}
                  `}
                  tabIndex={0}
                  type="button"
                  onClick={() => selectImage(image.src)}
                  onKeyDown={(e) => e.key === "Enter" && selectImage(image.src)}
                >
                  <Image
                    fill
                    unoptimized // Remove in production
                    alt={image.alt}
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    src={image.src}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="block text-gray-700 mb-3 font-medium">
              Current Image
            </h3>
            <div className="relative h-60 w-full max-w-md">
              <Image
                fill
                unoptimized // Remove in production
                alt="Current Image"
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 400px"
                src={formData.image}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className={`
                bg-[#634647] text-white px-6 py-2 rounded-md 
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"}
              `}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
