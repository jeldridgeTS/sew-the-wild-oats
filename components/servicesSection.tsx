"use client";

import ProductCard from "@/components/productCard";
import { fontCaladea } from "@/config/fonts";

export default function ServicesSection() {
  return (
    <section className={`${fontCaladea.className} min-h-screen bg-primary-200`}>
      <h1 className="text-4xl text-center pt-12">Services</h1>

      <div className={`flex gap-x-24 px-24`}>
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </section>
  );
}
