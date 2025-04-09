"use client";

import { Suspense } from "react";
import Link from "next/link";

import { fontCaladea } from "@/config/fonts";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <div className={`${fontCaladea.className} min-h-screen bg-[#f8f38d]`}>
        <header className="bg-[#634647] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link
                className="text-2xl hover:opacity-80 transition-opacity"
                href="/"
              >
                Sew Oats
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link
                  className="hover:text-[#ddad81] transition-colors"
                  href="/admin"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
            <div>
              <p className="text-[#ddad81]">Admin Panel</p>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </Suspense>
  );
}

function AdminLoading() {
  return (
    <div
      className={`${fontCaladea.className} min-h-screen flex items-center justify-center bg-[#f8f38d]`}
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-[#634647] border-[#ddad81] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl">Loading admin panel...</p>
      </div>
    </div>
  );
}
