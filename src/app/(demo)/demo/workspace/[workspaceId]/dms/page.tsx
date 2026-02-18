"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../_context/demo-layout-context";

export default function DemoDMsPage() {
  const { setActiveNav } = useNav();

  useLayoutEffect(() => {
    setActiveNav("dms");
  }, [setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select a DM from the sidebar to start a conversation.</p>
      </div>
    </div>
  );
}
