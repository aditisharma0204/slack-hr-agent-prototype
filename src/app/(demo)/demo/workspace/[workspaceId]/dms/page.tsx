"use client";

import { useLayoutEffect, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNav } from "../_context/demo-layout-context";
import { useDemoData } from "@/context/DemoDataContext";

export default function DemoDMsPage() {
  const { setActiveNav } = useNav();
  const { dms } = useDemoData();
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  useLayoutEffect(() => {
    setActiveNav("dms");
  }, [setActiveNav]);

  // Auto-redirect to first DM if available
  useLayoutEffect(() => {
    if (dms.length > 0) {
      const firstDm = dms[0];
      router.replace(`/demo/workspace/${workspaceId}/channel/${firstDm.id}`, { scroll: false });
    }
  }, [dms, router, workspaceId]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select a DM from the sidebar to start a conversation.</p>
      </div>
    </div>
  );
}
