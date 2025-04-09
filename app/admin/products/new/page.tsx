"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");

  // Image options - these can be expanded or modified as needed
  const imageOptions = [
    { src: "/quilt.jpg", alt: "Quilt" },
    { src: "/horse.jpg", alt: "Horse" },
    { src: "/goat.jpg", alt: "Goat" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    // Clear any previous upload errors when selecting a predefined image
    setUploadError("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Reset states
    setIsUploading(true);
    setUploadError("");

    try {
      // Create form data for upload
      const formData = new FormData();

      formData.append("file", file);

      // Send file to upload endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Important to include cookies for auth
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      // Set the image URL in form data
      setFormData((prev) => ({ ...prev, image: result.url }));
      setPreviewImage(result.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Upload error:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image",
      );
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
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
      <Toaster position="top-center" />
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
              Select an Image or{" "}
              <button
                className="text-[#634647] underline font-medium hover:text-[#ddad81] focus:outline-none"
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                upload
              </button>
            </h3>

            {/* File Upload Input (hidden) */}
            <input
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />

            {isUploading && (
              <div className="mb-4 flex items-center">
                <div className="w-5 h-5 border-2 border-t-[#634647] border-[#ddad81] rounded-full animate-spin mr-2" />
                <p>Uploading image...</p>
              </div>
            )}

            {uploadError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                {uploadError}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* User uploaded image (if exists) */}
              {formData.image && formData.image.startsWith("https://") && (
                <button
                  aria-label="Your uploaded image"
                  aria-pressed={true}
                  className="relative h-40 cursor-pointer border-2 rounded overflow-hidden p-0 border-[#634647] focus:outline-none focus:ring-2 focus:ring-[#634647] focus:border-[#634647]"
                  type="button"
                >
                  <div className="font-size-0 text-[0px] leading-[0px] w-full h-full">
                    <Image
                      fill
                      unoptimized // Remove in production
                      alt=""
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      src={formData.image}
                      title="Your uploaded image"
                    />
                  </div>
                </button>
              )}

              {/* Predefined image options */}
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
                      alt={image.alt}
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      src={image.src}
                      title={image.alt}
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
