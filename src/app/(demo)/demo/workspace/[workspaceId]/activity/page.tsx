"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../_context/demo-layout-context";
import { useDemoData } from "@/context/DemoDataContext";
import { ReadStatusCard } from "./_components/ReadStatusCard";

export default function DemoActivityPage() {
  const { setActiveNav } = useNav();
  const { activityPosts } = useDemoData();

  useLayoutEffect(() => {
    setActiveNav("activity");
  }, [setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {activityPosts.map((post) => (
            <ReadStatusCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
