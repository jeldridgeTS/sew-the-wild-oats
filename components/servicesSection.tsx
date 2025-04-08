"use client";

import { useState } from "react";
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

// Sample data - replace with your actual content
const productData: Item[] = [
  {
    id: "product1",
    title: "Product 1",
    description: "Product 1 description",
    image: "/static/images/products/product1.jpg", // Update with actual image path
  },
  {
    id: "product2",
    title: "Product 2",
    description: "Product 2 description",
    image: "/static/images/products/product2.jpg", // Update with actual image path
  },
  {
    id: "product3",
    title: "Product 3",
    description: "Product 3 description",
    image: "/static/images/products/product3.jpg", // Update with actual image path
  },
];

const serviceData: Item[] = [
  {
    id: "service1",
    title: "Service 1",
    description: "Service 1 Description",
    image: "/static/images/services/service1.jpg", // Update with actual image path
  },
  {
    id: "service2",
    title: "Product 2", // This should probably be "Service 2" - kept as is to match mockup
    description: "Service 2 description",
    image: "/static/images/services/service2.jpg", // Update with actual image path
  },
  {
    id: "service3",
    title: "Product 3", // This should probably be "Service 3" - kept as is to match mockup
    description: "Service 3 description",
    image: "/static/images/services/service3.jpg", // Update with actual image path
  },
];

// Placeholder image to use until real images are provided
const placeholderImage = "/static/images/toteBag.png"; // Update with suitable fallback image

export default function ServicesSection() {
  // State to track active tab and expanded accordion item
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products",
  );
  const [expandedItem, setExpandedItem] = useState<string>(
    activeTab === "products" ? productData[0].id : serviceData[0].id,
  );

  // Get current data based on active tab
  const currentData = activeTab === "products" ? productData : serviceData;
  // Find the currently selected item for image display
  const selectedItem =
    currentData.find((item) => item.id === expandedItem) || currentData[0];

  // Handle tab change
  const handleTabChange = (tab: "products" | "services") => {
    setActiveTab(tab);
    // Set the first item as expanded when changing tabs
    setExpandedItem(tab === "products" ? productData[0].id : serviceData[0].id);
  };

  // Handle accordion toggle
  const handleAccordionToggle = (itemId: string) => {
    setExpandedItem(itemId);
  };

  return (
    <section className={`${fontCaladea.className} min-h-screen bg-white py-16`}>
      {/* Tabs */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex justify-center space-x-16 text-2xl font-medium">
          <button
            className={clsx(
              "py-2 relative",
              activeTab === "products" ? "font-bold" : "text-gray-500",
            )}
            onClick={() => handleTabChange("products")}
          >
            Products
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
          <button
            className={clsx(
              "py-2 relative",
              activeTab === "services" ? "font-bold" : "text-gray-500",
            )}
            onClick={() => handleTabChange("services")}
          >
            Services
            {activeTab === "services" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              fill
              priority
              alt={selectedItem.title}
              src={selectedItem.image || placeholderImage}
              style={{ objectFit: "contain" }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = placeholderImage;
              }}
            />
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
