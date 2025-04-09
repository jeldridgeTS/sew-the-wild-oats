/**
 * ProductServiceTabs - A tabbed interface component that displays products and services
 * with expandable accordion items and dynamic image display
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// Third-party imports
import clsx from "clsx";

// Local imports
import { fontCaladea } from "@/config/fonts";

// Define types for products and services
type Item = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export default function ProductServiceTabs() {
  // State to track active tab and expanded accordion item
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products"
  );
  const [expandedItem, setExpandedItem] = useState<string>("");
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Item[]>([]);
  const [services, setServices] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products and services from API
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products");

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();

        // Fetch services
        const servicesResponse = await fetch("/api/services");

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services");
        }
        const servicesData = await servicesResponse.json();

        setProducts(productsData);
        setServices(servicesData);

        // Set default expanded item
        if (productsData.length > 0 && expandedItem === "") {
          setExpandedItem(productsData[0].id);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get current data based on active tab
  const currentData = activeTab === "products" ? products : services;

  // Find the currently selected item for image display
  const selectedItem =
    currentData.find((item) => item.id === expandedItem) ||
    (currentData.length > 0 ? currentData[0] : null);

  // Check if the current image is loaded
  const isCurrentImageLoaded = selectedItem
    ? loadedImages.has(selectedItem.image)
    : false;

  // Eagerly preload all images immediately when component mounts or data changes
  useEffect(() => {
    // Preload all images at once
    const allItems = [...products, ...services];

    if (allItems.length === 0) return;

    // Create an array of promises for all image loads
    const preloadPromises = allItems.map((item) => {
      return new Promise<void>((resolve) => {
        if (loadedImages.has(item.image)) {
          resolve(); // Already loaded

          return;
        }

        const img = new window.Image();

        img.onload = () => {
          setLoadedImages((prev) => {
            const newSet = new Set(prev);

            newSet.add(item.image);

            return newSet;
          });
          resolve();
        };
        img.onerror = () => resolve(); // Resolve even on error to prevent hanging
        img.src = item.image;
      });
    });

    // Run all preloads in parallel
    Promise.all(preloadPromises).catch(() => {
      // Silent catch
    });
  }, [products, services, loadedImages]);

  // Handle tab change
  const handleTabChange = (tab: "products" | "services") => {
    setActiveTab(tab);
    if (tab === "products" && products.length > 0) {
      setExpandedItem(products[0].id);
    } else if (tab === "services" && services.length > 0) {
      setExpandedItem(services[0].id);
    }
  };

  // Handle accordion toggle
  const handleAccordionToggle = (itemId: string) => {
    setExpandedItem(itemId);
  };

  // Placeholder image to use in case of loading errors
  const placeholderImage = "/quilt.jpg"; // Fallback to a known working image

  if (isLoading) {
    return (
      <section className="py-12 px-4 md:px-6 lg:py-16 bg-[#efefef]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <div className="w-16 h-16 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading products and services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 md:px-6 lg:py-16 bg-[#efefef]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-red-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-[#634647] text-white rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!selectedItem) {
    return (
      <section className="py-12 px-4 md:px-6 lg:py-16 bg-[#efefef]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-gray-600">No items available at this moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-6 lg:py-16 bg-[#efefef]">
      {/* Tab Buttons */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-md shadow-md p-1 bg-white">
          <button
            className={clsx(
              "px-6 py-3 rounded-md font-medium",
              activeTab === "products"
                ? "bg-[#634647] text-white"
                : "text-gray-600 hover:text-[#634647]"
            )}
            onClick={() => handleTabChange("products")}
          >
            Products
          </button>
          <button
            className={clsx(
              "px-6 py-3 rounded-md font-medium",
              activeTab === "services"
                ? "bg-[#634647] text-white"
                : "text-gray-600 hover:text-[#634647]"
            )}
            onClick={() => handleTabChange("services")}
          >
            Services
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square bg-white rounded-lg p-4 border overflow-hidden">
            {!isCurrentImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="w-10 h-10 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin" />
              </div>
            )}
            <div
              className="transition-opacity duration-150 ease-in-out"
              style={{ opacity: isCurrentImageLoaded ? 1 : 0 }}
            >
              <Image
                fill
                priority
                unoptimized // Bypass Next.js image optimization for troubleshooting
                alt={selectedItem.title}
                loading="eager"
                quality={80}
                sizes="(max-width: 768px) 100vw, 400px"
                src={selectedItem.image || placeholderImage}
                style={{ objectFit: "contain", objectPosition: "center" }}
                onError={(e) => {
                  // eslint-disable-next-line no-console
                  console.log(`Failed to load image: ${selectedItem.image}`);
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;

                  target.src = placeholderImage;
                  // Add to loaded images set to hide spinner
                  setLoadedImages((prev) => {
                    const newSet = new Set(prev);

                    newSet.add(selectedItem.image);

                    return newSet;
                  });
                }}
                onLoad={() => {
                  setLoadedImages((prev) => {
                    const newSet = new Set(prev);

                    newSet.add(selectedItem.image);

                    return newSet;
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Right side - Accordion */}
        <div className="flex flex-col space-y-4">
          {currentData.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden bg-white"
            >
              <button
                className="w-full p-4 flex justify-between items-center bg-white"
                onClick={() => handleAccordionToggle(item.id)}
              >
                <span className="font-medium">{item.title}</span>
                <span>
                  {expandedItem === item.id ? (
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  ) : (
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </span>
              </button>

              {expandedItem === item.id && (
                <div className="p-4 border-t">
                  <p>{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
