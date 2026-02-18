"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../_context/demo-layout-context";

export default function DemoAgentforcePage() {
  const { setActiveNav } = useNav();

  useLayoutEffect(() => {
    setActiveNav("agentforce");
  }, [setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select an agent from the sidebar to start a conversation.</p>
      </div>
    </div>
  );
}
