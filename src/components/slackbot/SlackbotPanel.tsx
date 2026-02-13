"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconStar,
  IconPencil,
  IconX,
  IconPlus,
} from "@/components/icons";
import { SlackbotProactiveTab } from "./SlackbotProactiveTab";
import { SlackbotMessagesTab } from "./SlackbotMessagesTab";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

type TabId = "messages" | "history" | "files" | "proactive";

export function SlackbotPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("messages");

  return (
    <div
      className="hidden lg:flex flex-col h-full w-full lg:w-[360px] lg:min-w-[300px] lg:max-w-[400px] shrink-0"
      style={{
        backgroundColor: T.colors.background,
        borderLeft: `1px solid ${T.colors.border}`,
        fontFamily: T.typography.fontFamily,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <div className="flex items-center gap-2">
          <Image src="/slackbot/slackbot-icon.svg" alt="Slackbot" width={20} height={20} />
          <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>Slackbot</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Star">
            <IconStar width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Edit">
            <IconPencil width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close">
            <IconX width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Maximize">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Minimize">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex border-b shrink-0" style={{ borderColor: T.colors.border }}>
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
              "px-3 py-2.5 font-medium transition-colors",
              activeTab === tab.id ? "border-b-2" : "hover:text-[#1d1c1d]"
            )}
            style={activeTab === tab.id ? { color: T.colors.link, borderBottomColor: T.colors.link, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="p-2 hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Add">
          <IconPlus width={T.iconSizes.slackbotTab} height={T.iconSizes.slackbotTab} stroke="currentColor" />
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
          <div className="p-4" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>Coming soon.</div>
        )}
      </div>
    </div>
  );
}
