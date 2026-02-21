"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BlockKitRenderer, type SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import { MessageInput } from "@/components/shared/MessageInput";
import { PulseDataCard } from "./PulseDataCard";
import { WinRateCard } from "./WinRateCard";
import { PipelineHealthCard } from "./PipelineHealthCard";
import { DealVelocityCard } from "./DealVelocityCard";
import { useRef, useEffect, useState, memo, useMemo } from "react";
import { IconLayoutGrid, IconInfo, IconBell, IconClock } from "@/components/icons";

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

// Stable data for cards - defined outside component to prevent recreation
const Q4_DEALS_DATA = [
  { name: "Acme Corp", days: 21 },
  { name: "Greentech", days: 21 },
  { name: "Runners Club", days: 67 },
  { name: "Sporty Nation", days: 45 },
] as const;

// Extract dashboard grid - removed memo to allow remounting when Scene 1 resets
function DashboardGrid() {
  return (
    <div className="mb-3 ml-11 pr-4">
      {/* 2x2 Grid Layout - Aggressively Compacted - Fills container width */}
      <div className="grid grid-cols-2 gap-3">
        <PulseDataCard key="pulse-card" attainment={471000} quota={500000} commissionMissed={4200} index={0} />
        <WinRateCard key="winrate-card" winRate={52} previousWinRate={44} personalEngagement={68} delegatedRate={41} index={1} />
        <PipelineHealthCard
          key="pipeline-card"
          totalPipeline={1200000}
          onTrack={410000}
          needsYou={90000}
          blocked={0}
          dealCount={14}
          index={2}
        />
        <DealVelocityCard
          key="velocity-card"
          avgCycle={48}
          fastestClose={21}
          fastestDeal="Greentech"
          q4Deals={Q4_DEALS_DATA}
          index={3}
        />
      </div>
    </div>
  );
}

// Module-level Set to track if amber alert has become static
const staticAlerts = new Set<string>();

// Extract amber alert into separate memoized component
const AmberAlert = memo(function AmberAlert() {
  const alertKey = "amber-alert-1";
  const [isStatic, setIsStatic] = useState(staticAlerts.has(alertKey));
  
  // Switch to static after animation completes
  useEffect(() => {
    if (staticAlerts.has(alertKey)) {
      setIsStatic(true);
      return;
    }
    
    const timer = setTimeout(() => {
      staticAlerts.add(alertKey);
      setIsStatic(true);
    }, 1200); // Animation delay (0.8s) + duration (0.4s)
    return () => clearTimeout(timer);
  }, [alertKey]);
  
  // Static version (no animations)
  if (isStatic) {
    return (
      <div className="mb-4 ml-11 pr-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-lg">⚠️</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-900">
              You missed your accelerator by $29K last quarter.
            </div>
            <div className="text-xs text-amber-700 mt-1">
              That was $4.2K in commission left on the table.
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Animated version (only on first render)
  return (
    <motion.div
      className="mb-4 ml-11 pr-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
    >
      <div className="flex items-start gap-2">
        <span className="text-amber-600 text-lg">⚠️</span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-amber-900">
            You missed your accelerator by $29K last quarter.
          </div>
          <div className="text-xs text-amber-700 mt-1">
            That was $4.2K in commission left on the table.
          </div>
        </div>
      </div>
    </motion.div>
  );
});

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
    // Don't send messages to main chat - all interactions stay in panel
    // Just clear the input
    setInputValue("");
  };

  // Check if welcome message exists (for dashboard rendering) - memoized to prevent recalculation
  const hasWelcomeMessage = useMemo(() => 
    messages.some(msg => msg.id === "welcome-q4"),
    [messages]
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Body - Scrollable content area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3">
        {/* Render message history */}
        {messages.map((msg, index) => (
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
        
        {/* Q4 Analytics Cards - Rendered ONCE outside messages.map() to prevent remounting */}
        {/* CRITICAL: Stable key ensures React never remounts these components */}
        {hasWelcomeMessage && (
          <div key="dashboard-container">
            <DashboardGrid />
            {/* CTAs below tableau cards */}
            <div className="mb-4 ml-11 pr-4">
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => onIntentSelect("🎯 Plan my Q1 commit")}
                  className="px-4 py-2 text-sm font-medium bg-white border hover:bg-[#f8f8f8] flex items-center gap-2"
                  style={{
                    borderRadius: "4px",
                    borderColor: "#e8e8e8",
                    color: "#1d1c1d",
                  }}
                >
                  <IconLayoutGrid className="w-4 h-4" />
                  Launch Q1 Planner
                </button>
                <button
                  type="button"
                  onClick={() => onIntentSelect("📊 Reflect on Q4 performance")}
                  className="px-4 py-2 text-sm font-medium bg-white border hover:bg-[#f8f8f8] flex items-center gap-2"
                  style={{
                    borderRadius: "4px",
                    borderColor: "#e8e8e8",
                    color: "#1d1c1d",
                  }}
                >
                  <IconInfo className="w-4 h-4" />
                  Reflect on Q4
                </button>
                <button
                  type="button"
                  onClick={() => onIntentSelect("⚠️ Review at-risk pipeline")}
                  className="px-4 py-2 text-sm font-medium bg-white border hover:bg-[#f8f8f8] flex items-center gap-2"
                  style={{
                    borderRadius: "4px",
                    borderColor: "#e8e8e8",
                    color: "#1d1c1d",
                  }}
                >
                  <IconBell className="w-4 h-4" />
                  Review at-risk deals
                </button>
                <button
                  type="button"
                  onClick={() => onIntentSelect("📅 See what's on my plate today")}
                  className="px-4 py-2 text-sm font-medium bg-white border hover:bg-[#f8f8f8] flex items-center gap-2"
                  style={{
                    borderRadius: "4px",
                    borderColor: "#e8e8e8",
                    color: "#1d1c1d",
                  }}
                >
                  <IconClock className="w-4 h-4" />
                  What's on my plate?
                </button>
              </div>
            </div>
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
