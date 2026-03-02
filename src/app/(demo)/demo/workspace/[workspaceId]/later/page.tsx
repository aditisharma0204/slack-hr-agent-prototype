"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoLaterPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/");
  }, [router]);
  
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <p className="text-[#616061] text-sm">Redirecting to boilerplate...</p>
    </div>
  );
}
