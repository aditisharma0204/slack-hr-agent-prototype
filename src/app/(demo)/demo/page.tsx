"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/demo/workspace/demo-1/channel/general");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8f8f8]">
      <p className="text-[#616061]">Loading demo...</p>
    </div>
  );
}
