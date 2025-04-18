"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { fontCaladea } from "@/config/fonts";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");

      return;
    }

    setIsLoggingIn(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Parse the response regardless of status
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Successfully authenticated

      // Successful login - redirect to admin dashboard
      // Use await to ensure redirect happens
      await router.push("/admin");
      // Add a slight delay before refresh to ensure cookies are processed
      setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 ${fontCaladea.className}`}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#634647] px-6 py-8 text-white">
            <h1 className="text-3xl font-bold text-center">Admin Login</h1>
            <p className="text-center mt-2 text-[#ddad81]">
              Sew Oats Admin Panel
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  id="username"
                  placeholder="Enter admin username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className={`w-full bg-[#634647] text-white py-2 rounded-md 
                  ${isLoggingIn ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"}`}
                disabled={isLoggingIn}
                type="submit"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Enter your admin credentials to log in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
