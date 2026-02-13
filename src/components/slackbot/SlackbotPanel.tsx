"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { SlackbotProactiveTab } from "./SlackbotProactiveTab";
import { SlackbotMessagesTab } from "./SlackbotMessagesTab";
import { cn } from "@/lib/utils";

type TabId = "reactive" | "proactive";

export function SlackbotPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("proactive");

  return (
    <div
      className="flex flex-col h-full w-[360px] min-w-[360px] max-w-[400px] shrink-0"
      style={{
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #e8e8e8",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: "#e8e8e8" }}>
        <div
          className="size-6 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: "#611f69" }}
        >
          S
        </div>
        <span className="font-semibold text-[#1d1c1d]">Slackbot</span>
      </div>

      <div className="flex border-b shrink-0" style={{ borderColor: "#e8e8e8" }}>
        <button
          type="button"
          onClick={() => setActiveTab("reactive")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "reactive"
              ? "text-[#1264a3] border-b-2"
              : "text-[#616061] hover:text-[#1d1c1d]"
          )}
          style={activeTab === "reactive" ? { borderBottomColor: "#1264a3" } : {}}
        >
          Reactive
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("proactive")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === "proactive"
              ? "text-[#1264a3] border-b-2"
              : "text-[#616061] hover:text-[#1d1c1d]"
          )}
          style={activeTab === "proactive" ? { borderBottomColor: "#1264a3" } : {}}
        >
          Proactive
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {activeTab === "reactive" && <SlackbotMessagesTab />}
        {activeTab === "proactive" && (
          <div className="p-4 overflow-y-auto">
            <SlackbotProactiveTab />
          </div>
        )}
      </div>
    </div>
  );
}
