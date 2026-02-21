"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#060608] text-white p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
