"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { fontCaladea } from "@/config/fonts";

// Define type for product items
type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load product data from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
        setMessage({ type: "", text: "" });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching products:", error);
        setMessage({
          type: "error",
          text: "Failed to load products. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handler for deleting a product
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        // Remove the product from the UI
        setProducts(products.filter((product) => product.id !== id));
        setMessage({
          type: "success",
          text: "Product deleted successfully",
        });

        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting product:", error);
        setMessage({
          type: "error",
          text: "Failed to delete product. Please try again.",
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
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex gap-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => router.push("/admin")}
          >
            Back to Dashboard
          </button>
          <button
            className="bg-[#634647] text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => router.push("/admin/products/new")}
          >
            Add New Product
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

      {/* Products list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {products.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No products found. Add your first product!
          </p>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-full md:w-48 h-48 relative">
                  <Image
                    fill
                    unoptimized // Remove in production
                    alt={product.title}
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, 192px"
                    src={product.image}
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="flex gap-3">
                    <button
                      className="bg-[#ddad81] text-[#634647] px-4 py-2 rounded hover:bg-opacity-80"
                      onClick={() =>
                        router.push(`/admin/products/edit/${product.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-opacity-80"
                      onClick={() => handleDelete(product.id)}
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
