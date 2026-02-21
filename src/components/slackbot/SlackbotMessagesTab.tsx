"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconHome,
  IconPencil,
  IconSearch,
  IconLightbulb,
  IconPlus,
} from "@/components/icons";
import { BlockKitRenderer } from "@/components/block-kit/BlockKitRenderer";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import { cn } from "@/lib/utils";
import { DEMO_USER_NAME } from "@/context/DemoDataContext";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { MessageInput } from "@/components/shared/MessageInput";

const T = SLACK_TOKENS;

const PILL_ACTIONS = [
  { id: "discover", label: "Discover", icon: IconHome, query: "What would it take to close the gap?" },
  { id: "create", label: "Create", icon: IconPencil, query: "Prep me for my TechStart meeting" },
  { id: "find", label: "Find", icon: IconSearch, query: "Tell me about Acme Corp" },
  { id: "brainstorm", label: "Brainstorm", icon: IconLightbulb, query: "What's my risk today?" },
];

const RESPONSE_BLOCKS: Record<string, SlackBlock[]> = {
  "acme": [
    { type: "header", text: { type: "plain_text", text: "Acme Corp — Enterprise Platform", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Amount:*\n$200,000" },
        { type: "mrkdwn", text: "*Stage:*\nNegotiation" },
        { type: "mrkdwn", text: "*Champion:*\nMarcus Lee (departed)" },
        { type: "mrkdwn", text: "*Commission at risk:*\n~$14,000" },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Marcus Lee left Acme in the last 48 hours. I've identified *Priya Shah* (via Sarah Chen) and *Daniel Kim* (VP Procurement, attended your Q1 webinar) as potential new champions. Intro draft ready for review.",
      },
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Review draft", emoji: true }, action_id: "review", style: "primary" },
        { type: "button", text: { type: "plain_text", text: "Dismiss", emoji: true }, action_id: "dismiss" },
      ],
    },
  ],
  "runners club": [
    { type: "header", text: { type: "plain_text", text: "Runners Club — Summer Collection", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Amount:*\n$720,000" },
        { type: "mrkdwn", text: "*Stage:*\nClosed Won → reopened" },
        { type: "mrkdwn", text: "*Champion:*\nLisa Park" },
        { type: "mrkdwn", text: "*Signal:*\nCFO Jordan Hayes asked about ROI" },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "CFO joined last call unexpectedly. Value justification deck drafted — addresses Jordan's specific ROI questions. Review and send?",
      },
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Review draft", emoji: true }, action_id: "review", style: "primary" },
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
        text: "Your gap is about *$90K*. To close it in 48 days you'd need:\n• ~$135K more in qualified pipeline\n• ~5 meetings/week\n\nFocus on: (1) Runners Club value justification, (2) Sporty Nation alternate stakeholder, (3) Acme recovery outreach.",
      },
    },
  ],
  "risk today": [
    { type: "header", text: { type: "plain_text", text: "Your risk today", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Deal at risk*\nAcme Corp ($200K) — champion departed" },
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
        text: "You have *3 overdue follow-ups*; oldest 9 days. Meridian Health (James Rivera) and Greentech (Priya Shah) are good candidates — both have had 7–8 days since last touch.",
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
  "greentech": [
    { type: "header", text: { type: "plain_text", text: "Greentech — SaaS Expansion", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Amount:*\n$60,000" },
        { type: "mrkdwn", text: "*Stage:*\nProposal" },
        { type: "mrkdwn", text: "*Champion:*\nPriya Shah (active)" },
        { type: "mrkdwn", text: "*Confidence:*\n78%" },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Priya said 'just send me the SOW and I'll get it signed this week' on last call. SOW draft ready for review.",
      },
    },
  ],
  "sporty nation": [
    { type: "header", text: { type: "plain_text", text: "Sporty Nation — Back to School Promo", emoji: true } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Amount:*\n$270,000" },
        { type: "mrkdwn", text: "*Stage:*\nClosed Lost" },
        { type: "mrkdwn", text: "*Champion:*\nDana Torres (silent 14 days)" },
        { type: "mrkdwn", text: "*Signal:*\nProposal viewed 14x, no reply" },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Company doing layoffs — procurement likely frozen. I've identified 2 alternate stakeholders. Intro approach drafted.",
      },
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
        text: "I can help with: deal summaries, gap analysis, meeting prep, and follow-up drafts. Try one of the suggested actions.",
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
      <div className="flex-1 overflow-y-auto space-y-4 p-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 px-2 text-center w-full">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] mb-4 flex items-center justify-center shrink-0">
              <Image src="/slackbot-logo.svg" alt="Slackbot" width={120} height={120} className="max-w-full max-h-full" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1c1d] mb-2 w-full">
              Good morning, {DEMO_USER_NAME}!
            </h2>
            <p className="text-sm sm:text-[15px] text-[#616061] mb-5 w-full">
              The day loads, one unread message at a time.
            </p>
            <div className="flex flex-wrap gap-2 justify-center w-full">
              {PILL_ACTIONS.map(({ id, label, icon: Icon, query }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => sendMessage(query)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md border text-[13px] sm:text-[14px] font-medium hover:bg-[#f8f8f8] transition-colors whitespace-nowrap flex-1 min-w-[140px] max-w-[160px]"
                  style={{
                    backgroundColor: T.colors.background,
                    borderColor: T.colors.border,
                    color: T.colors.text,
                  }}
                >
                  <Icon width={14} height={14} style={{ color: T.colors.textSecondary }} stroke="currentColor" className="shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-lg p-2.5 sm:p-3 text-sm break-words",
              m.role === "user"
                ? "bg-[#f8f8f8] ml-2 sm:ml-4"
                : "bg-white border border-[#e8e8e8] mr-2 sm:mr-4"
            )}
          >
            <div className="font-medium text-xs text-[#616061] mb-1">
              {m.role === "user" ? "You" : "Slackbot"}
            </div>
            {m.blocks ? (
              <BlockKitRenderer blocks={m.blocks} />
            ) : (
              <p className="text-sm sm:text-[15px] text-[#1d1c1d] break-words">{m.content}</p>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="rounded-lg p-2.5 sm:p-3 bg-white border border-[#e8e8e8] mr-2 sm:mr-4 text-sm text-[#616061]">
            Slackbot is typing...
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 py-2">
        <MessageInput
          placeholder="Reply..."
          onSubmit={sendMessage}
          value={input}
          onChange={setInput}
        />
      </div>
    </div>
  );
}
