"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { ProactiveTab } from "./ProactiveTab";
import { MessagesTab } from "./MessagesTab";
import { cn } from "@/lib/utils";

type TabId = "reactive" | "proactive";

export function VibefacePanel() {
  const [activeTab, setActiveTab] = useState<TabId>("proactive");

  return (
    <div className="flex flex-col h-full bg-background border-l border-border w-[360px] min-w-[360px] max-w-[400px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-primary" />
          <span className="font-semibold">Vibeface</span>
        </div>
      </div>

      <div className="flex border-b border-border shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("reactive")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "reactive"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Reactive
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("proactive")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "proactive"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Proactive
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {activeTab === "reactive" && <MessagesTab />}
        {activeTab === "proactive" && (
          <div className="p-4 overflow-y-auto">
            <ProactiveTab />
          </div>
        )}
      </div>
    </div>
  );
}
