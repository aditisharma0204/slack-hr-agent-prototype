"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error to console for debugging
    console.error("Demo route error:", error);
    
    // If it's a 404 or routing error, redirect to home
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      // Small delay to prevent infinite loops
      const timer = setTimeout(() => {
        router.push("/");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#060608] text-white p-8">
      <h2 className="text-2xl font-bold mb-4">Route not found</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        The requested route could not be found. Redirecting to home...
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Go to Home
      </button>
    </div>
  );
}
