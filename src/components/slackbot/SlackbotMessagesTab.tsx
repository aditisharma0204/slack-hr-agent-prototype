"use client";

import { useState } from "react";
import { BlockKitRenderer } from "@/components/block-kit/BlockKitRenderer";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import { cn } from "@/lib/utils";

const PRESET_QUERIES = [
  "Tell me about Global Industries",
  "What would it take to close the gap?",
  "What's my risk today?",
  "Prep me for my TechStart meeting",
  "What follow-ups are overdue?",
];

const RESPONSE_BLOCKS: Record<string, SlackBlock[]> = {
  "global industries": [
    { type: "header", text: { type: "plain_text", text: "Global Industries — Enterprise Platform", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Amount:*\n$180,000" },
        { type: "mrkdwn", text: "*Stage:*\nNegotiation" },
        { type: "mrkdwn", text: "*Champion:*\nMarcus Lee" },
        { type: "mrkdwn", text: "*Status:*\nSilent 12 days" },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Champion has been silent for 12 days. No exec sponsor identified. Risk: deal may be cooling. I recommend reaching out to Marcus this week to re-engage.",
      },
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Review", emoji: true }, action_id: "review", style: "primary" },
        { type: "button", text: { type: "plain_text", text: "Dismiss", emoji: true }, action_id: "dismiss" },
      ],
    },
  ],
  "close the gap": [
    { type: "header", text: { type: "plain_text", text: "Closing the gap", emoji: true } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Your gap is about *$820K*. To close it in 45 days you'd need:\n• ~$1.2M more in qualified pipeline\n• ~8 meetings/week\n\nFocus on: (1) re-engaging Global Industries, (2) accelerating TechStart QBR, (3) adding 2–3 new discovery meetings.",
      },
    },
  ],
  "risk today": [
    { type: "header", text: { type: "plain_text", text: "Your risk today", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Deal at risk*\nGlobal Industries ($180K)" },
        { type: "mrkdwn", text: "*Meeting prep*\nTechStart QBR at 2 PM" },
        { type: "mrkdwn", text: "*Overdue*\n3 follow-ups" },
      ],
    },
  ],
  "techstart": [
    { type: "header", text: { type: "plain_text", text: "TechStart QBR — 2:00 PM today", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Champion:*\nSarah Chen (active)" },
        { type: "mrkdwn", text: "*Deal:*\n$95K, Proposal, Commit" },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Talking points: QBR recap, expansion options, timeline to close. I've drafted a brief — want me to surface it?",
      },
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "View brief", emoji: true }, action_id: "view_brief", style: "primary" },
      ],
    },
  ],
  "follow-up": [
    { type: "header", text: { type: "plain_text", text: "Overdue follow-ups", emoji: true } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "You have *3 overdue follow-ups*; oldest 9 days. Meridian Corp (James Rivera) and Greentech (Sarah Chen) are good candidates — both have had 7–8 days since last touch.",
      },
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Draft batch", emoji: true }, action_id: "draft", style: "primary" },
        { type: "button", text: { type: "plain_text", text: "Later", emoji: true }, action_id: "later" },
      ],
    },
  ],
};

function getResponseBlocks(query: string): SlackBlock[] {
  const lower = query.toLowerCase();
  for (const [key, blocks] of Object.entries(RESPONSE_BLOCKS)) {
    if (lower.includes(key)) return blocks;
  }
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "I can help with: deal summaries, gap analysis, meeting prep, and follow-up drafts. Try one of the suggested questions.",
      },
    },
  ];
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content?: string;
  blocks?: SlackBlock[];
  timestamp: Date;
}

export function SlackbotMessagesTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const blocks = getResponseBlocks(trimmed);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        blocks,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-sm text-[#616061] space-y-3">
            <p>Ask me anything about your pipeline, meetings, or follow-ups.</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="text-left px-3 py-2 rounded border text-sm border-[#e8e8e8] text-[#1d1c1d] hover:bg-[#f8f8f8]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-lg p-3 text-sm",
              m.role === "user"
                ? "bg-[#f8f8f8] ml-4"
                : "bg-white border border-[#e8e8e8] mr-4"
            )}
          >
            <div className="font-medium text-xs text-[#616061] mb-1">
              {m.role === "user" ? "You" : "Slackbot"}
            </div>
            {m.blocks ? (
              <BlockKitRenderer blocks={m.blocks} />
            ) : (
              <p className="text-[15px] text-[#1d1c1d]">{m.content}</p>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="rounded-lg p-3 bg-white border border-[#e8e8e8] mr-4 text-sm text-[#616061]">
            Slackbot is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 shrink-0" style={{ borderColor: "#e8e8e8" }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Reply..."
            className="flex-1 rounded border px-3 py-2 text-sm placeholder:text-[#616061] focus:outline-none focus:ring-1 focus:ring-[#1264a3]"
            style={{ borderColor: "#e8e8e8" }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded text-sm font-medium bg-[#1264a3] text-white hover:bg-[#0b4c8c]"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
