"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DemoWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  useEffect(() => {
    router.replace(`/demo/workspace/${workspaceId}/activity`);
  }, [router, workspaceId]);

  return (
    <div className="h-full flex items-center justify-center bg-white">
      <p className="text-[#616061] text-sm">Loading...</p>
    </div>
  );
}
