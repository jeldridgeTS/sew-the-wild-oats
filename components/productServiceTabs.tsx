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

// Sample data with actual images
const productData: Item[] = [
  {
    id: "product1",
    title: "Handmade Quilts",
    description: "Unique, hand-stitched quilts made with care and attention to detail. Each piece tells a story through carefully selected fabrics and patterns.",
    image: "/quilt.jpg", // Image in public directory
  },
  {
    id: "product2",
    title: "Custom Clothing",
    description: "Bespoke clothing items designed to your specifications. From casual wear to special occasion pieces, each garment is tailored to fit perfectly.",
    image: "/moxxiwork.jpg", // Image in public directory
  },
  {
    id: "product3",
    title: "Home Decor",
    description: "Handcrafted home accents that bring warmth and character to any space. From pillows to wall hangings, each piece is designed to complement your home.",
    image: "/horse.jpg", // Image in public directory
  },
];

const serviceData: Item[] = [
  {
    id: "service1",
    title: "Custom Quilting",
    description: "Commission a quilt made to your specifications. Choose your fabrics, patterns, and size for a truly unique heirloom piece.",
    image: "/quilt.jpg", // Image in public directory
  },
  {
    id: "service2",
    title: "Sewing Lessons",
    description: "Learn the art of sewing from an experienced craftsperson. Classes available for all skill levels from beginner to advanced.",
    image: "/moxxiwork.jpg", // Image in public directory
  },
  {
    id: "service3",
    title: "Clothing Alterations",
    description: "Professional alterations to ensure your garments fit perfectly. From simple hemming to complex restructuring, we can help your clothes look their best.",
    image: "/goat.jpg", // Image in public directory
  },
];

// Placeholder image to use in case of loading errors
const placeholderImage = "/quilt.jpg"; // Fallback to a known working image

export default function ProductServiceTabs() {
  // State to track active tab and expanded accordion item
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products",
  );
  const [expandedItem, setExpandedItem] = useState<string>(
    activeTab === "products" ? productData[0].id : serviceData[0].id,
  );
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Get current data based on active tab
  const currentData = activeTab === "products" ? productData : serviceData;
  
  // Find the currently selected item for image display
  const selectedItem =
    currentData.find((item) => item.id === expandedItem) || currentData[0];

  // Check if the current image is loaded
  const isCurrentImageLoaded = loadedImages.has(selectedItem.image);

  // Eagerly preload all images immediately when component mounts
  useEffect(() => {
    // Preload all images at once
    const allItems = [...productData, ...serviceData];
    
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
      // Catch any errors but continue
    });
  }, []);

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
    <section className={`${fontCaladea.className} min-h-screen bg-[#f8f38d] py-16`}>
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
          <div className="relative w-full max-w-md aspect-square bg-white rounded-lg p-4 border overflow-hidden">
            {!isCurrentImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="w-10 h-10 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin" />
              </div>
            )}
            <div className="transition-opacity duration-150 ease-in-out" 
                style={{ opacity: isCurrentImageLoaded ? 1 : 0 }}>
              <Image
                fill
                priority
                loading="eager"
                alt={selectedItem.title}
                src={selectedItem.image || placeholderImage}
                style={{ objectFit: "contain", objectPosition: "center" }}
                sizes="(max-width: 768px) 100vw, 400px"
                quality={80}
                unoptimized // Bypass Next.js image optimization for troubleshooting
                onError={(e) => {
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
