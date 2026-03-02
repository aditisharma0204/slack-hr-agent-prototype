"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoWorkspacePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect old demo routes to root (new boilerplate)
    router.replace("/");
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center bg-white">
      <p className="text-[#616061] text-sm">Redirecting to boilerplate...</p>
    </div>
  );
}
