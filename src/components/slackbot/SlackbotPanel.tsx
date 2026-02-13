"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Pencil,
  X,
  Maximize2,
  Minimize2,
  Plus,
} from "lucide-react";
import { SlackbotProactiveTab } from "./SlackbotProactiveTab";
import { SlackbotMessagesTab } from "./SlackbotMessagesTab";
import { cn } from "@/lib/utils";

type TabId = "messages" | "history" | "files" | "proactive";

export function SlackbotPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("messages");

  return (
    <div
      className="flex flex-col h-full w-[360px] min-w-[360px] max-w-[400px] shrink-0"
      style={{
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #e8e8e8",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lato", sans-serif',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "#e8e8e8" }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={24} height={24} className="object-contain" />
          <span className="font-semibold text-[15px] text-[#1d1c1d]">Slackbot</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Star">
            <Star size={16} />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Edit">
            <Pencil size={16} />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Close">
            <X size={16} />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Maximize">
            <Maximize2 size={16} />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Minimize">
            <Minimize2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex border-b shrink-0" style={{ borderColor: "#e8e8e8" }}>
        {[
          { id: "messages" as const, label: "Messages" },
          { id: "history" as const, label: "History" },
          { id: "files" as const, label: "Files" },
          { id: "proactive" as const, label: "Proactive" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-2.5 text-[13px] font-medium transition-colors",
              activeTab === tab.id
                ? "text-[#1264a3] border-b-2"
                : "text-[#616061] hover:text-[#1d1c1d]"
            )}
            style={activeTab === tab.id ? { borderBottomColor: "#1264a3" } : {}}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="p-2 text-[#616061] hover:bg-[#f8f8f8]" title="Add">
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {activeTab === "messages" && <SlackbotMessagesTab />}
        {activeTab === "proactive" && (
          <div className="p-4 overflow-y-auto">
            <SlackbotProactiveTab />
          </div>
        )}
        {(activeTab === "history" || activeTab === "files") && (
          <div className="p-4 text-[13px] text-[#616061]">Coming soon.</div>
        )}
      </div>
    </div>
  );
}
