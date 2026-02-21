"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BlockKitRenderer, type SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import { MessageInput } from "@/components/shared/MessageInput";
import { PulseDataCard } from "./PulseDataCard";
import { useRef, useEffect, useState } from "react";

type Screen = 1 | 2 | 3 | 4 | 5;

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content?: string;
  blocks?: SlackBlock[];
  timestamp: Date;
}

interface Arc1SlackThreadProps {
  currentScreen: Screen;
  stepperValue: number;
  selectedIntent: string | null;
  messages: ChatMessage[];
  onIntentSelect: (intent: string) => void;
  onApprove: () => void;
  onQuickPrompt: (prompt: string) => void;
  onMessageSend: (message: string) => void;
}

export function Arc1SlackThread({
  currentScreen,
  stepperValue,
  selectedIntent,
  messages,
  onIntentSelect,
  onApprove,
  onQuickPrompt,
  onMessageSend,
}: Arc1SlackThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (message: string) => {
    if (message.trim()) {
      onMessageSend(message);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Body - Scrollable content area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3">
        {/* Main chat is static - show empty state or static content */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Slack DM thread</p>
          </div>
        )}
        {/* Render message history (if any) */}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <div className="flex items-start gap-3 mb-2">
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
                </div>
              )}
              <div className={`flex-1 min-w-0 ${msg.role === "user" ? "ml-11" : ""}`}>
                {msg.role === "bot" && (
                  <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
                )}
                {msg.role === "user" && (
                  <div className="text-xs font-medium text-[#616061] mb-1">You</div>
                )}
                <div className={`rounded-lg p-4 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#f8f8f8] ml-auto max-w-[80%]" 
                    : "bg-white border border-gray-200"
                }`}>
                  {msg.blocks ? (
                    <BlockKitRenderer blocks={msg.blocks} onAction={(actionId) => {
                      // Handle action buttons
                      if (actionId === "plan_q1") {
                        onIntentSelect("🎯 Plan my Q1 commit");
                      } else if (actionId.startsWith("reflect_q4")) {
                        onIntentSelect("📊 Reflect on Q4 performance");
                      } else if (actionId.startsWith("review_risk")) {
                        onIntentSelect("⚠️ Review at-risk pipeline");
                      } else if (actionId.startsWith("today_plate")) {
                        onIntentSelect("📅 See what's on my plate today");
                      } else if (actionId === "approve_plan") {
                        onApprove();
                      } else if (actionId.startsWith("show_accounts") || actionId.startsWith("who_to_call") || actionId.startsWith("sarah_feedback") || actionId.startsWith("focus_deal")) {
                        const promptMap: Record<string, string> = {
                          show_accounts: "👀 Show me the 12 accounts the agent is targeting",
                          who_to_call: "📞 Who should I call personally this week?",
                          sarah_feedback: "📋 What did Sarah say about my commit?",
                          focus_deal: "⚡ What's the one deal I should focus on today?",
                        };
                        onQuickPrompt(promptMap[actionId] || "");
                      }
                    }} />
                  ) : (
                    <p className="text-[15px]" style={{ color: "#1d1c1d" }}>
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Tableau Pulse Card - Show on Screen 1 after welcome message */}
        {currentScreen === 1 && messages.length > 0 && messages[0].role === "bot" && (
          <div className="mb-4">
            <PulseDataCard attainment={471000} quota={500000} commissionMissed={4200} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Box - PERMANENT, always present, never conditional */}
      <div className="shrink-0 border-t bg-white" style={{ borderColor: "#e8e8e8" }}>
        <div className="p-3">
          <MessageInput
            placeholder="Message Slackbot..."
            onSubmit={handleSubmit}
            value={inputValue}
            onChange={setInputValue}
          />
        </div>
      </div>
    </div>
  );
}

// Loading reveals component
function LoadingReveals() {
  const reveals = [
    "✓ Quota confirmed from Capacity Planning: $500K",
    "✓ Inherited pipeline loaded: $1.2M · 14 deals",
    "✓ Q4 velocity analysed: win rate, cycle, deal size",
    "✓ Your closing pattern mapped: you close 68% of deals you personally engage vs 41% delegated",
    "✓ Three scenarios modelled.",
    "",
    "Here's your Q1.",
  ];

  return (
    <div className="space-y-1">
      {reveals.map((text, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.4, duration: 0.3 }}
          className="text-[15px]"
          style={{ color: "#1d1c1d" }}
        >
          {text}
        </motion.p>
      ))}
    </div>
  );
}

// Approval confirmation component with sequential reveals
function ApprovalConfirmation({ stepperValue }: { stepperValue: number }) {
  const targetK = Math.round(stepperValue / 1000);
  const confirms = [
    `✓ $${targetK}K committed. Here's what just happened:`,
    "✓ Quota logged in Salesforce — confirmed",
    "✓ Forecast submitted to Sarah via Clari",
    `✓ Prospecting agent activated on ${targetK >= 600 ? "12" : "8"} named accounts`,
    "✓ Pipeline review meetings: reduced from 3→2/week (I'll handle the pipeline updates, you get the hour back)",
    "✓ Calendar protected: 2 mornings blocked for in-person meetings (your highest close-rate context)",
    "✓ Capacity ceiling set: 8 active deals max (based on your Q3 dilution pattern — protecting your rate)",
  ];

  return (
    <div className="space-y-1">
      {confirms.map((text, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.5, duration: 0.3 }}
          className="text-[15px]"
          style={{ color: "#1d1c1d" }}
        >
          {text}
        </motion.p>
      ))}
    </div>
  );
}
