"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// NextUI imports
import { Accordion, AccordionItem } from "@nextui-org/react";

// Import CSS module
import styles from "./styles.module.css";

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

  // Placeholder image for error fallback
  const placeholderImage = "/placeholder-image.jpg";

  if (isLoading) {
    return (
      <section className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className="flex justify-center">
            <div className={styles.spinner} />
          </div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.tabsContainer}>
        {/* Custom Tabs - with proper accessibility */}
        <div
          aria-label="Product and Service Options"
          className="flex justify-center mb-10"
          role="tablist"
        >
          <div className="flex space-x-12">
            <button
              aria-controls="products-panel"
              aria-selected={activeTab === "products"}
              className={`${styles.tabItem} ${styles.tabItemHover} ${activeTab === "products" ? styles.tabItemSelected : ""}`}
              id="products-tab"
              role="tab"
              onClick={() => handleTabChange("products")}
              onKeyDown={(e) =>
                e.key === "Enter" && handleTabChange("products")
              }
            >
              Products
              <span className={styles.tabUnderline} />
            </button>
            <button
              aria-controls="services-panel"
              aria-selected={activeTab === "services"}
              className={`${styles.tabItem} ${styles.tabItemHover} ${activeTab === "services" ? styles.tabItemSelected : ""}`}
              id="services-tab"
              role="tab"
              onClick={() => handleTabChange("services")}
              onKeyDown={(e) =>
                e.key === "Enter" && handleTabChange("services")
              }
            >
              Services
              <span className={styles.tabUnderline} />
            </button>
          </div>
        </div>

        {/* Content Grid - with proper accessibility */}
        <div
          aria-labelledby={`${activeTab}-tab`}
          className={styles.contentGrid}
          id={`${activeTab}-panel`}
          role="tabpanel"
        >
          {/* Left side - Image */}
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              {!isCurrentImageLoaded && (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner} />
                </div>
              )}
              <div
                className={styles.imageContent}
                style={{ opacity: isCurrentImageLoaded ? 1 : 0 }}
              >
                {selectedItem && (
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
                      console.log(
                        `Failed to load image: ${selectedItem.image}`
                      );
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
                )}
              </div>
            </div>
          </div>

          {/* Right side - Accordion */}
          <div className={styles.accordionContainer}>
            <Accordion
              className={styles.accordionWrapper}
              selectedKeys={[expandedItem]}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={(keys) => {
                const keysArray = Array.from(keys as Set<string>);

                if (keysArray.length > 0) {
                  handleAccordionToggle(keysArray[0]);
                }
              }}
            >
              {currentData.map((item) => (
                <AccordionItem
                  key={item.id}
                  aria-label={item.title}
                  classNames={{
                    title: "font-medium",
                    trigger: "data-[hover=true]:bg-[#634647]/10",
                    content: "text-base text-default-500",
                  }}
                  title={item.title}
                >
                  <p>{item.description}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
