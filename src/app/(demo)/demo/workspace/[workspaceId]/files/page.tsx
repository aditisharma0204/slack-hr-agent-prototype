"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../_context/demo-layout-context";

export default function DemoFilesPage() {
  const { setActiveNav } = useNav();

  useLayoutEffect(() => {
    setActiveNav("files");
  }, [setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select a file from the sidebar to view it.</p>
      </div>
    </div>
  );
}
