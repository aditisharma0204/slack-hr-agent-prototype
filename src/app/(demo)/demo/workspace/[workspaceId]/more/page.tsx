"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../_context/demo-layout-context";

export default function DemoMorePage() {
  const { setActiveNav } = useNav();

  useLayoutEffect(() => {
    setActiveNav("more");
  }, [setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select a channel or DM from the sidebar.</p>
      </div>
    </div>
  );
}
