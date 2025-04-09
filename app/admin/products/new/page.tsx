"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { fontCaladea } from "@/config/fonts";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Mock image options - in a real app, these would come from an image library or upload system
  const imageOptions = [
    { src: "/quilt.jpg", alt: "Quilt" },
    { src: "/horse.jpg", alt: "Horse" },
    { src: "/goat.jpg", alt: "Goat" },
  ];

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
    setPreviewImage(src);
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
      // Call the products API to save the product to Supabase
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Important for sending the auth cookie
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to create product");
      }

      const newProduct = await response.json();

      // eslint-disable-next-line no-console
      console.log("New product created:", newProduct);

      // Redirect back to products list
      router.push("/admin/products");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error creating product:", err);
      setError("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${fontCaladea.className} min-h-screen p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </button>
        </div>

        {error && (
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
              Product Title
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
                  aria-pressed={formData.image === image.src}
                  className={`
                    relative h-40 cursor-pointer border-2 rounded overflow-hidden p-0
                    focus:outline-none focus:ring-2 focus:ring-[#634647] focus:border-[#634647]
                    ${formData.image === image.src ? "border-[#634647]" : "border-transparent hover:border-[#ddad81]"}
                  `}
                  type="button"
                  onClick={() => selectImage(image.src)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      selectImage(image.src);
                    }
                  }}
                >
                  <div className="font-size-0 text-[0px] leading-[0px] w-full h-full">
                    <Image
                      fill
                      unoptimized // Remove in production
                      alt="" /* Removing alt text content to prevent labels */
                      title={image.alt} /* Keeping the title for tooltips */
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      src={image.src}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {previewImage && (
            <div className="mb-6">
              <h3 className="block text-gray-700 mb-3 font-medium">
                Selected Image
              </h3>
              <div className="relative h-60 w-full max-w-md">
                <Image
                  fill
                  unoptimized // Remove in production
                  alt="Preview"
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 400px"
                  src={previewImage}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              className={`
                bg-[#634647] text-white px-6 py-2 rounded-md 
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"}
              `}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
