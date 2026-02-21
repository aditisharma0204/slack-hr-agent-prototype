"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconStar,
  IconPencil,
  IconX,
  IconPlus,
  IconMoreVertical,
} from "@/components/icons";
import { SlackbotProactiveTab } from "./SlackbotProactiveTab";
import { SlackbotMessagesTab } from "./SlackbotMessagesTab";
import { MessageInput } from "@/components/shared/MessageInput";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

type TabId = "seller-edge" | "messages" | "history" | "files";

interface SlackbotPanelProps {
  onClose?: () => void;
}

export function SlackbotPanel({ onClose }: SlackbotPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("seller-edge");
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = (message: string) => {
    // Handle chat message submission
    console.log("Chat message:", message);
    setChatInput("");
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: T.colors.background,
        borderLeft: `1px solid ${T.colors.border}`,
        fontFamily: T.typography.fontFamily,
      }}
    >
      <div className="border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Favorite">
              <IconStar width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />
            <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>Slackbot</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Edit">
              <IconPencil width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More">
              <IconMoreVertical width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close" onClick={onClose}>
              <IconX width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b shrink-0" style={{ borderColor: T.colors.border }}>
        {[
          { id: "seller-edge" as const, label: "Seller Edge" },
          { id: "messages" as const, label: "Messages" },
          { id: "history" as const, label: "History" },
          { id: "files" as const, label: "Files" },
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
        {activeTab === "seller-edge" && <SlackbotProactiveTab />}
        {activeTab === "messages" && <SlackbotMessagesTab />}
        {(activeTab === "history" || activeTab === "files") && (
          <div className="p-4" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>Coming soon.</div>
        )}
      </div>

      {/* Chat component at bottom with prompts — same px-3 as ChatEngine for consistent message input alignment */}
      <div className="shrink-0 border-t" style={{ borderColor: T.colors.border }}>
        <div className="p-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              "What's my pipeline status?",
              "Show me at-risk deals",
              "What should I focus on today?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleChatSubmit(prompt)}
                className="px-3 py-1.5 text-xs rounded-md border hover:bg-[#f8f8f8] transition-colors"
                style={{
                  borderColor: T.colors.border,
                  color: T.colors.textSecondary,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <MessageInput
            placeholder="Message Slackbot..."
            onSubmit={handleChatSubmit}
            value={chatInput}
            onChange={setChatInput}
          />
        </div>
      </div>
    </div>
  );
}
