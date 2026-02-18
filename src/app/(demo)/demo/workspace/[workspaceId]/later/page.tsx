"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../_context/demo-layout-context";

export default function DemoLaterPage() {
  const { setActiveNav } = useNav();

  useLayoutEffect(() => {
    setActiveNav("later");
  }, [setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select a saved item from the sidebar to view it.</p>
      </div>
    </div>
  );
}
