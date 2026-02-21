"use client";

import { motion } from "framer-motion";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import Image from "next/image";
import { IconStar, IconPencil, IconMoreVertical, IconX, IconChevronDown, IconSearch, IconFilter, IconMessage, IconLightbulb, IconUsers } from "@/components/icons";
import { MessageInput } from "@/components/shared/MessageInput";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Module-level Set to track if confirmation message has become static
const staticConfirmations = new Set<string>();
// Module-level flag to prevent animation restart - more robust than refs
const animationStartedFlags = new Set<string>();
// Module-level flag to track checklist completion - survives remounts
const checklistCompletedFlags = new Set<string>();
// Module-level flag to prevent completion callback from firing multiple times
const completionCallbackFired = new Set<string>();
// Module-level counter to track confirmation count - survives remounts
let prevConfirmationCount = 0;

// Reset function to clear static state (called when Scene 1 resets)
export function resetConfirmationMemory() {
  staticConfirmations.clear();
  animationStartedFlags.clear();
  checklistCompletedFlags.clear();
  completionCallbackFired.clear();
  prevConfirmationCount = 0;
}

const T = SLACK_TOKENS;

// Stable checklist items array - defined outside component to prevent re-renders
// This will be populated with dynamic values when component renders
const getChecklistItems = (targetK: number, stepperValue: number): string[] => [
  `$${targetK}K committed. Here's what just happened:`,
  "Quota logged in Salesforce — confirmed",
  "Forecast submitted to Sarah via Clari",
  `Prospecting agent activated on ${stepperValue >= 600000 ? "12" : "8"} named accounts`,
  "Pipeline review meetings: reduced from 3→2/week (I'll handle the pipeline updates, you get the hour back)",
  "Calendar protected: 2 mornings blocked for in-person meetings (your highest close-rate context)",
  "Capacity ceiling set: 8 active deals max (based on your Q3 dilution pattern — protecting your rate)",
];

// Clean, stable AnimatedChecklist component - built from scratch with pure React logic
export const AnimatedChecklist = memo(({ 
  items, 
  onComplete,
  containerRef 
}: { 
  items: string[]; 
  onComplete?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}) => {
  // Use stable key to track completion across remounts
  // This is the 2nd checklist (confirmation checklist) - the one that should trigger scroll
  const checklistKey = "confirmation-checklist";
  const [step, setStep] = useState(() => {
    // If already completed, start at the end
    if (checklistCompletedFlags.has(checklistKey)) {
      return items.length;
    }
    return 0;
  });
  const [showCheckmarks, setShowCheckmarks] = useState<Set<number>>(() => {
    // If already completed, show all checkmarks
    if (checklistCompletedFlags.has(checklistKey)) {
      return new Set(items.map((_, i) => i));
    }
    return new Set();
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Safely store the onComplete function so it never triggers a useEffect restart
  const savedOnComplete = useRef(onComplete);
  useEffect(() => {
    savedOnComplete.current = onComplete;
  }, [onComplete]);

  // 1. Nudge the scroll every time a new item appears (Grow-With-Me scroll)
  // DISABLED: This was interfering with the final scroll to next-steps
  // The checklist has fixed height, so items will be visible without this scroll
  // useEffect(() => {
  //   if (step > 0 && step < items.length) {
  //     // Small delay to ensure DOM has updated with new item
  //     const scrollTimer = setTimeout(() => {
  //       // Scroll the container (which will scroll the parent) to keep spinner in view
  //       if (containerRef?.current) {
  //         containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //       } else if (scrollRef.current) {
  //         // Fallback: scroll the tracker div itself
  //         scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //       }
  //     }, 150);
  //     return () => clearTimeout(scrollTimer);
  //   }
  // }, [step, containerRef, items.length]);

  // The single, master timer - shows spinner, then checkmark, then moves to next item
  useEffect(() => {
    // CRITICAL: If already completed (module-level check), don't restart
    if (checklistCompletedFlags.has(checklistKey) || step >= items.length) {
      return;
    }

    if (step < items.length) {
      // Show checkmark for current item after 400ms
      const checkmarkTimer = setTimeout(() => {
        setShowCheckmarks(prev => {
          const newSet = new Set(prev);
          newSet.add(step);
          return newSet;
        });
      }, 400);

      // Move to next step after 800ms
      const stepTimer = setTimeout(() => {
        setStep(prev => {
          const next = prev + 1;
          // Mark as completed when we reach the end (module-level, survives remounts)
          if (next >= items.length) {
            checklistCompletedFlags.add(checklistKey);
            // Trigger completion callback only once (module-level check prevents multiple calls)
            if (!completionCallbackFired.has(checklistKey) && savedOnComplete.current) {
              completionCallbackFired.add(checklistKey);
              setTimeout(() => {
                if (savedOnComplete.current) {
                  savedOnComplete.current();
                }
              }, 400);
            }
          }
          return next;
        });
      }, 800);

      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(stepTimer);
      };
    }
  }, [step, items.length, checklistKey]);

  return (
    <div className="space-y-1 h-[320px] overflow-y-auto">
      {items.map((text, index) => {
        // Only render items up to current step
        if (index >= step) {
          return null;
        }

        const showCheckmark = showCheckmarks.has(index);
        const isSpinning = index === step - 1 && !showCheckmark;

        return (
          <div
            key={index}
            className="flex items-center gap-2 text-[15px]"
            style={{ 
              color: "#1d1c1d", 
              minHeight: '21px'
            }}
          >
            {isSpinning ? (
              <motion.div
                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full flex-shrink-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              />
            ) : showCheckmark ? (
              <span
                className="font-semibold flex-shrink-0"
                style={{ color: '#16a34a' }}
              >
                ✓
              </span>
            ) : (
              <div className="w-4 h-4 flex-shrink-0" />
            )}
            <span style={{ color: '#1d1c1d' }}>
              {text}
            </span>
          </div>
        );
      })}
      {/* Growth tracker - invisible div at bottom that triggers scroll as items appear */}
      <div ref={scrollRef} style={{ height: '1px', visibility: 'hidden' }} />
    </div>
  );
});

type Screen = 1 | 2 | 3 | 4 | 5;

// High-density data pulling items - shows depth of AI analysis
const DATA_PULL_ITEMS = [
  "Quota confirmed from Capacity Planning: $500K",
  "Inherited pipeline loaded: $1.2M · 14 deals",
  "Q4 velocity analysed: win rate, cycle, deal size",
  "Closing pattern mapped: 68% personal vs 41% delegated",
  "Deal stage distribution: Discovery 32%, Negotiation 28%, Closed 40%",
  "Account engagement scores: 12 accounts flagged for high-touch",
  "Meeting frequency patterns: Tues-Thurs peak conversion windows",
  "Email response rates: 4.2hr avg response time correlates with 2.3x close rate",
  "Pipeline health metrics: $340K at risk, 3 deals need attention",
  "Historical Q3 performance: 52% win rate, 48-day avg cycle",
  "Capacity constraints identified: 8 active deals max for optimal rate",
  "Three scenarios modelled. Here's your Q1.",
];

// Loading reveals component - uses spinner → tick pattern for realistic data processing
function LoadingRevealsComponent({ onComplete }: { onComplete?: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCheckmarks, setShowCheckmarks] = useState<Set<number>>(new Set());

  // Safely store the onComplete function so it never triggers a useEffect restart
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // The single, master timer - shows spinner, then checkmark, then moves to next item
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev < DATA_PULL_ITEMS.length) {
          // Show checkmark for current item after 300ms
          setTimeout(() => {
            setShowCheckmarks(prevCheckmarks => {
              const newSet = new Set(prevCheckmarks);
              newSet.add(prev);
              return newSet;
            });
          }, 300);
          return prev + 1;
        }
        clearInterval(timer);
        if (onCompleteRef.current) {
          setTimeout(() => onCompleteRef.current!(), 500);
        }
        return prev;
      });
    }, 600); // Rhythmic 600ms pace
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-1">
      {DATA_PULL_ITEMS.map((text, index) => {
        // Only render items up to activeIndex
        if (index >= activeIndex) {
          return null;
        }

        const showCheckmark = showCheckmarks.has(index);
        const isSpinning = index === activeIndex - 1 && !showCheckmark;

        return (
          <div
            key={index}
            className="flex items-center gap-2 text-[15px]"
            style={{ 
              color: "#1d1c1d", 
              minHeight: '21px'
            }}
          >
            {isSpinning ? (
              <motion.div
                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full flex-shrink-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              />
            ) : showCheckmark ? (
              <span
                className="font-semibold flex-shrink-0"
                style={{ color: '#16a34a' }}
              >
                ✓
              </span>
            ) : (
              <div className="w-4 h-4 flex-shrink-0" />
            )}
            <span style={{ color: '#1d1c1d' }}>
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type PanelFeedItemType = 'greeting' | 'loading' | 'planner' | 'confirmation' | 'next-steps';

interface PanelFeedItem {
  id: string;
  type: PanelFeedItemType;
  data?: {
    stepperValue?: number;
  };
}

interface Arc1AgentforcePanelProps {
  currentScreen: Screen; // Kept for backward compatibility with arcNavigation
  panelFeed: PanelFeedItem[]; // Array-based feed for incremental rendering
  stepperValue: number;
  onStepperChange: (value: number) => void;
  onApprove: () => void;
  onChecklistComplete?: () => void; // Callback when checklist animation completes
  onMessageSend?: (message: string) => void;
  onScreenChange?: (screen: Screen) => void;
  onQuickPrompt?: (prompt: string) => void;
  onClose?: () => void;
}

// Linear interpolation functions
function calculateCommission(target: number): number {
  return Math.round(target * 0.14);
}

function calculateAIWorkload(target: number): number {
  // Linear interpolation: 400 tasks at $400K, 1,240 tasks at $600K+
  const minTarget = 400000;
  const maxTarget = 600000;
  const minTasks = 400;
  const maxTasks = 1240;
  
  if (target <= minTarget) return minTasks;
  if (target >= maxTarget) return maxTasks;
  
  const ratio = (target - minTarget) / (maxTarget - minTarget);
  return Math.round(minTasks + (maxTasks - minTasks) * ratio);
}

function calculateClientFacingHours(target: number): number {
  // Inverse scaling: 7 hrs at $500K, 9 hrs at $600K+
  const minTarget = 400000;
  const maxTarget = 600000;
  const minHours = 6;
  const maxHours = 9;
  
  if (target <= minTarget) return minHours;
  if (target >= maxTarget) return maxHours;
  
  const ratio = (target - minTarget) / (maxTarget - minTarget);
  return Math.round((minHours + (maxHours - minHours) * ratio) * 10) / 10;
}

function calculatePipelineGap(target: number): number {
  const inheritedPipeline = 1200000;
  const winRate = 0.52; // 52% win rate
  // Expected close from pipeline = pipeline * win rate
  const expectedClose = inheritedPipeline * winRate;
  // Gap = target - expected close (what we can realistically expect from pipeline)
  return Math.max(0, target - expectedClose);
}

function calculateInternalMeetings(target: number): number {
  // Drops from 3 to 2 as target increases (AI handles pipeline reviews)
  if (target >= 600000) return 2;
  if (target <= 500000) return 3;
  return 3; // Default
}

function calculatePersonalEngagementDeals(target: number): number {
  // At $500K: 6 of 14, At $600K+: 4 of 14 (focused on highest value)
  if (target >= 600000) return 4;
  return 6;
}

function calculateDilutionRisk(target: number): { level: "Low" | "Medium" | "High"; color: string } {
  if (target >= 600000) return { level: "Low", color: "#10b981" }; // green
  if (target <= 500000) return { level: "Medium", color: "#f59e0b" }; // yellow
  return { level: "Medium", color: "#f59e0b" };
}

// Permanent Panel Header Component
function PanelHeader({ onClose }: { onClose?: () => void }) {
  return (
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
          <button 
            type="button" 
            className="p-1.5 rounded hover:bg-[#f8f8f8]" 
            style={{ color: T.colors.textSecondary }} 
            title="Close"
            onClick={onClose}
          >
            <IconX width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
          </button>
        </div>
      </div>
      {/* Tab Bar */}
      <div className="flex items-center border-b" style={{ borderColor: T.colors.border }}>
        <button
          type="button"
          className="px-3 py-2.5 font-medium relative"
          style={{
            fontSize: T.typography.small,
            color: "#6B21A8",
            borderBottom: "2px solid #6B21A8",
          }}
        >
          Messages
        </button>
        <button
          type="button"
          className="px-3 py-2.5 font-medium"
          style={{
            fontSize: T.typography.small,
            color: T.colors.textSecondary,
          }}
        >
          History
        </button>
        <button
          type="button"
          className="px-3 py-2.5 font-medium"
          style={{
            fontSize: T.typography.small,
            color: T.colors.textSecondary,
          }}
        >
          Files
        </button>
        <button type="button" className="p-2 hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Add">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Permanent Input Box Component
function PanelInputBox({ 
  onSubmit, 
  value, 
  onChange 
}: { 
  onSubmit: (message: string) => void; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="shrink-0 border-t bg-white" style={{ borderColor: T.colors.border }}>
      <div className="p-3">
        <MessageInput
          placeholder="Message Slackbot..."
          onSubmit={onSubmit}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// Screen 1 Body Content
function Screen1Body({ onScreenChange }: { onScreenChange?: (screen: Screen) => void }) {
  return (
    <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
      {/* Zone A: Greeting */}
      <div className="py-8 px-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border-2" style={{ borderColor: "#E0E0E0" }}>
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={80} height={80} className="object-contain" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#000000", fontSize: "20px" }}>
          Good morning, Rita!
        </h2>
        <p className="text-sm" style={{ color: "#666666", fontSize: "14px" }}>
          Q1 starts today. Here's how Q4 looked.
        </p>
      </div>

      {/* Zone B: 2×2 Q4 Insight Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Q4 ATTAINMENT */}
          <div
            className="bg-white rounded-lg p-4"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              Q4 ATTAINMENT
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              $471K
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              94% of $500K
            </div>
          </div>

          {/* Card 2: WIN RATE */}
          <div
            className="bg-white rounded-lg p-4"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              WIN RATE
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              52%
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              ↑ from 48% Q3
            </div>
          </div>

          {/* Card 3: TOP DEAL */}
          <div
            className="bg-white rounded-lg p-4"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              TOP DEAL
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              $89K
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              Acme Corp · Dec
            </div>
          </div>

          {/* Card 4: ⚠️ MISSED (Amber treatment) */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: "#FFFBF0",
              borderLeft: "3px solid #A57401",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2 flex items-center gap-1" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              <span>⚠️</span> MISSED
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              $29K short
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              = $4K left on the table
            </div>
          </div>
        </div>
      </div>

      {/* Zone C: 4 Prompt Buttons */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => onScreenChange?.(2)}
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            style={{
              backgroundColor: "#6B21A8",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            🎯 Plan my Q1
          </button>
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3EEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            📊 Q4 deep dive
          </button>
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3EEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            ⚠️ At-risk deals
          </button>
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3EEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            📅 Today's plate
          </button>
        </div>
      </div>
    </div>
  );
}

// Screen 2 Body Content
function Screen2Body() {
  return (
    <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] mb-4" style={{ color: "#1d1c1d" }}>
            On it. Pulling your data now... <span className="inline-block animate-pulse">•••</span>
          </p>
          <LoadingRevealsComponent />
        </div>
      </div>

      {/* Pulsing Skeleton Cards */}
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg opacity-50" />
        ))}
      </div>
    </div>
  );
}

// Screen 3 Body Content - Now supports disabled/locked state
function Screen3Body({
  stepperValue,
  onStepperChange,
  onApprove,
  isDisabled = false,
}: {
  stepperValue: number;
  onStepperChange: (value: number) => void;
  onApprove: () => void;
  isDisabled?: boolean;
}) {
  const commission = calculateCommission(stepperValue);
  const aiWorkload = calculateAIWorkload(stepperValue);
  const clientHours = calculateClientFacingHours(stepperValue);
  const pipelineGap = calculatePipelineGap(stepperValue);
  const internalMeetings = calculateInternalMeetings(stepperValue);
  const personalDeals = calculatePersonalEngagementDeals(stepperValue);
  const dilutionRisk = calculateDilutionRisk(stepperValue);
  const targetK = Math.round(stepperValue / 1000);

  return (
    <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
      {/* Context Bar - Single Line */}
      <div className="mb-6 text-xs" style={{ color: "#666" }}>
        Active Pipeline: $1.2M · Win Rate: 52% · Quota: $500K · Close rate: 68%
        <br />
        <span className="text-[10px]" style={{ color: "#999" }}>
          Source: Capacity Planning · Salesforce · Gong
        </span>
      </div>

      {/* Plan Selector */}
      <div className="mb-6">
        <div className={`flex gap-2 mb-4 ${isDisabled ? "opacity-70 pointer-events-none" : ""}`}>
          {[
            { label: "Conservative", value: 400000 },
            { label: "Quota", value: 500000 },
            { label: "Stretch", value: 600000 },
          ].map(({ label, value }) => {
            const isActive = Math.abs(stepperValue - value) < 50000;
            return (
              <button
                key={value}
                type="button"
                onClick={() => !isDisabled && onStepperChange(value)}
                disabled={isDisabled}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  isActive ? "" : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? "#6B21A8" : "#ffffff",
                  color: isActive ? "#ffffff" : T.colors.text,
                  border: `1px solid ${isActive ? "#6B21A8" : "#E0E0E0"}`,
                }}
              >
                {isActive && <span className="mr-1">●</span>}
                {label}
              </button>
            );
          })}
        </div>
        {/* Stepper */}
        <div className={`flex items-center gap-3 ${isDisabled ? "opacity-70 pointer-events-none" : ""}`}>
          <button
            type="button"
            onClick={() => !isDisabled && onStepperChange(Math.max(400000, stepperValue - 10000))}
            disabled={stepperValue <= 400000 || isDisabled}
            className="px-3 py-2 rounded border disabled:opacity-50 text-sm"
            style={{ borderColor: "#E0E0E0", backgroundColor: "#ffffff" }}
          >
            ← $10K
          </button>
          <div className="flex-1 text-center">
            <motion.span
              key={stepperValue}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
              style={{ color: "#000000" }}
            >
              ${targetK.toLocaleString()},000
            </motion.span>
          </div>
          <button
            type="button"
            onClick={() => !isDisabled && onStepperChange(Math.min(700000, stepperValue + 10000))}
            disabled={stepperValue >= 700000 || isDisabled}
            className="px-3 py-2 rounded border disabled:opacity-50 text-sm"
            style={{ borderColor: "#E0E0E0", backgroundColor: "#ffffff" }}
          >
            $10K →
          </button>
        </div>
      </div>

      {/* Plan Impact Card */}
      <div className="mb-6 p-5 rounded-lg border bg-white" style={{ borderColor: "#E0E0E0", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: "#000000", fontSize: "12px", letterSpacing: "0.5px" }}>
          PLAN IMPACT AT ${targetK.toLocaleString()}K
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#E0E0E0" }}>
            <span className="text-sm" style={{ color: "#666" }}>Estimated Commission</span>
            <motion.span
              key={commission}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
              style={{ color: "#000000" }}
            >
              ${commission.toLocaleString()}
            </motion.span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#666" }}>Pipeline gap to close</span>
            <span className="text-sm font-medium" style={{ color: "#000000" }}>
              ${Math.round(pipelineGap / 1000)}K
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#666" }}>AI workload</span>
            <motion.span
              key={aiWorkload}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-sm font-medium"
              style={{ color: "#000000" }}
            >
              {aiWorkload >= 1000 ? "High" : aiWorkload >= 600 ? "Medium" : "Low"} ({aiWorkload.toLocaleString()} tasks)
            </motion.span>
          </div>
          <div className="pt-3 border-t mt-3" style={{ borderColor: "#E0E0E0" }}>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "#666", letterSpacing: "0.5px" }}>YOUR WEEK</div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#666" }}>Client-facing hours/week</span>
                <span style={{ color: "#000000", fontWeight: 500 }}>{clientHours} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "#666" }}>Internal meetings/week</span>
                <div className="flex items-center gap-2">
                  {stepperValue >= 600000 && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#D1FAE5", color: "#065F46", borderLeft: "3px solid #10b981" }}>
                      3 → 2 ↓
                    </span>
                  )}
                  <span style={{ color: "#000000", fontWeight: 500 }}>{internalMeetings}</span>
                  {stepperValue >= 600000 && (
                    <span className="text-xs" style={{ color: "#666" }}>
                      I handle pipeline reviews. You get this hour back.
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#666" }}>Deals needing personal engagement</span>
                <span style={{ color: "#000000", fontWeight: 500 }}>{personalDeals} of 14</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "#666" }}>Risk: pipeline dilution</span>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: dilutionRisk.color === "#10b981" ? "#D1FAE5" : dilutionRisk.color === "#f59e0b" ? "#FEF3C7" : "#FEE2E2",
                    color: dilutionRisk.color,
                  }}
                >
                  🟡 {dilutionRisk.level}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t mt-3" style={{ borderColor: "#E0E0E0" }}>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "#666", letterSpacing: "0.5px" }}>MACHINE HANDLES</div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#666" }}>Follow-up sequences</span>
                <span style={{ color: "#000000", fontWeight: 500 }}>{aiWorkload}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#666" }}>Prospecting agents</span>
                <span style={{ color: "#000000", fontWeight: 500 }}>{stepperValue >= 600000 ? "8" : "8"} accounts</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#666" }}>Contract chase</span>
                <span style={{ color: "#000000", fontWeight: 500 }}>{stepperValue >= 600000 ? "18" : "18"} automations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Button - Hidden when disabled */}
      {!isDisabled && (
        <button
          type="button"
          onClick={onApprove}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
          style={{
            backgroundColor: "#6B21A8",
            color: "#ffffff",
          }}
        >
          Approve ${targetK.toLocaleString()}K Plan →
        </button>
      )}
    </div>
  );
}

// Screen 4 Body Content - Approval Confirmation Checklist (Styled as Slackbot message)
function Screen4Body({ 
  stepperValue, 
  onComplete 
}: { 
  stepperValue: number;
  onComplete?: () => void;
}) {
  const targetK = Math.round(stepperValue / 1000);
  const checklistContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoize checklistItems to prevent recreation on every render
  const checklistItems = useMemo(
    () => getChecklistItems(targetK, stepperValue),
    [targetK, stepperValue]
  );

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          <div 
            ref={checklistContainerRef}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            {/* CRITICAL: Hardcoded stable key prevents React from unmounting/remounting */}
            <AnimatedChecklist 
              key="q1-planner-checklist" 
              items={checklistItems} 
              onComplete={onComplete}
              containerRef={checklistContainerRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// New Post-Approval Message - Replaces Screen5Body with new structure
// Appears after confirmation checklist completes
// Memoized to prevent unnecessary re-renders that cause blinking
const PostApprovalMessage = memo(function PostApprovalMessage({ stepperValue }: { stepperValue: number }) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const content = (
    <>
      {/* Block A - Two stacked hero cards */}
      <div className="space-y-3 mb-4">
        {/* Card 1 */}
        <div 
          className="rounded-xl border p-4"
          style={{ 
            borderRadius: '12px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#ffffff',
            padding: '16px'
          }}
        >
          <div 
            className="text-xs font-semibold uppercase mb-2 flex items-center gap-1.5"
            style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}
          >
            <IconFilter className="w-3 h-3" />
            FOCUS NOW
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ color: '#1d1c1d', fontFamily: 'DM Sans, sans-serif' }}>
            What's the one deal I close this week?
          </h3>
          <p className="text-[13px] mb-3" style={{ color: '#616061', fontFamily: 'DM Sans, sans-serif' }}>
            Ranked by close probability + your relationship depth
          </p>
          <DropdownMenu 
            open={openDropdownId === 'show-me'} 
            onOpenChange={(open) => setOpenDropdownId(open ? 'show-me' : null)}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2 border transition-colors hover:bg-gray-50 [&[data-state=open]]:border-[#0176D3]"
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: '#1d1c1d',
                  borderColor: '#E5E5E5',
                  fontFamily: 'DM Sans, sans-serif' 
                }}
              >
                <IconSearch className="w-4 h-4" />
                Show me
                <IconChevronDown className="w-3 h-3 ml-auto opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>View all deals</DropdownMenuItem>
              <DropdownMenuItem>Top 3 deals</DropdownMenuItem>
              <DropdownMenuItem>Deals closing this week</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card 2 */}
        <div 
          className="rounded-xl border p-4"
          style={{ 
            borderRadius: '12px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#ffffff',
            padding: '16px'
          }}
        >
          <div 
            className="text-xs font-semibold uppercase mb-2 flex items-center gap-1.5"
            style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}
          >
            <IconMessage className="w-3 h-3" />
            HUMAN SIGNAL
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ color: '#1d1c1d', fontFamily: 'DM Sans, sans-serif' }}>
            Who needs you personally — not the agent?
          </h3>
          <p className="text-[13px] mb-3" style={{ color: '#616061', fontFamily: 'DM Sans, sans-serif' }}>
            3 accounts where your presence is the variable
          </p>
          <DropdownMenu 
            open={openDropdownId === 'whos-on-list'} 
            onOpenChange={(open) => setOpenDropdownId(open ? 'whos-on-list' : null)}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2 border transition-colors hover:bg-gray-50 [&[data-state=open]]:border-[#0176D3]"
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: '#1d1c1d',
                  borderColor: '#E5E5E5',
                  fontFamily: 'DM Sans, sans-serif' 
                }}
              >
                <IconUsers className="w-4 h-4" />
                Who's on the list
                <IconChevronDown className="w-3 h-3 ml-auto opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>View all accounts</DropdownMenuItem>
              <DropdownMenuItem>Accounts needing attention</DropdownMenuItem>
              <DropdownMenuItem>High-priority contacts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Block B - 2×2 chip grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { 
            Icon: IconFilter, 
            label: 'Prioritize',
            options: ['Top deals', 'This week', 'This month', 'All deals']
          },
          { 
            Icon: IconMessage, 
            label: 'Reach out',
            options: ['Call now', 'Schedule call', 'Send email', 'All contacts']
          },
          { 
            Icon: IconSearch, 
            label: 'Understand',
            options: ['Deal insights', 'Account analysis', 'Risk factors', 'All insights']
          },
          { 
            Icon: IconLightbulb, 
            label: 'Prepare',
            options: ['Meeting prep', 'Deck review', 'Talking points', 'All prep']
          },
        ].map((chip, index) => {
          const IconComponent = chip.Icon;
          const dropdownId = `chip-${index}`;
          return (
            <DropdownMenu 
              key={index}
              open={openDropdownId === dropdownId} 
              onOpenChange={(open) => setOpenDropdownId(open ? dropdownId : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all w-full justify-between border hover:bg-gray-50 [&[data-state=open]]:border-[#0176D3]"
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: '#1d1c1d',
                    borderColor: '#E5E5E5',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  <span className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{chip.label}</span>
                  </span>
                  <IconChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {chip.options.map((option, optIndex) => (
                  <DropdownMenuItem key={optIndex}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>

      {/* Block C - Footer */}
      <div 
        className="text-center text-[13px]"
        style={{ color: '#616061', fontFamily: 'DM Sans, sans-serif' }}
      >
        Or just ask me anything about your quarter.
      </div>
    </>
  );

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          {/* Slack Block Kit style - no outer border/outline */}
          <div className="bg-transparent p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'ease' }}
            >
              {content}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

export function Arc1AgentforcePanel({
  currentScreen,
  panelFeed,
  stepperValue,
  onStepperChange,
  onApprove,
  onChecklistComplete,
  onMessageSend,
  onScreenChange,
  onQuickPrompt,
  onClose,
}: Arc1AgentforcePanelProps) {
  const [chatInput, setChatInput] = useState("");
  const [checklistDone, setChecklistDone] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nextStepsRef = useRef<HTMLDivElement>(null);
  const confirmationChecklistRef = useRef<HTMLDivElement>(null);

  // Preserve scroll position when feed updates to prevent scroll-to-top
  const scrollPositionRef = useRef<number>(0);
  const isRestoringScrollRef = useRef<boolean>(false);
  const prevFeedLengthRef = useRef<number>(panelFeed.length);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Save current scroll position before feed updates
      const currentScroll = container.scrollTop;
      scrollPositionRef.current = currentScroll;
    }
  }, [panelFeed.length]); // Save position when feed length changes (before new item renders)

  // Restore scroll position after feed update, BUT skip when confirmation or next-steps is added (we'll scroll to them instead)
  useEffect(() => {
    const container = scrollContainerRef.current;
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');
    const hasConfirmation = panelFeed.some(item => item.type === 'confirmation');
    const prevLength = prevFeedLengthRef.current; // Get the previous length value
    
    // If next-steps or confirmation was just added, DON'T restore - we'll scroll to them instead
    const nextStepsJustAdded = hasNextSteps && panelFeed.length > prevLength;
    const confirmationJustAdded = hasConfirmation && panelFeed.length > prevLength;
    prevFeedLengthRef.current = panelFeed.length; // Update the ref with new length
    
    if (container && !hasScrolledToNextStepsRef.current && !nextStepsJustAdded && !confirmationJustAdded && !isScrollingToChecklistRef.current) {
      // Only restore if next-steps or confirmation wasn't just added AND we're not currently scrolling to checklist
      isRestoringScrollRef.current = true;
      // Use double RAF to ensure DOM has fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (container && scrollPositionRef.current > 0 && !hasScrolledToNextStepsRef.current) {
            container.scrollTop = scrollPositionRef.current;
            isRestoringScrollRef.current = false;
          }
        });
      });
    }
  }, [panelFeed]);

  // Listen for scroll trigger from parent after next-steps is added
  useEffect(() => {
    const handleScrollToNextSteps = () => {
      if (!hasScrolledToNextStepsRef.current && scrollContainerRef.current) {
        // Mark as scrolled immediately to prevent race condition with reset effect
        hasScrolledToNextStepsRef.current = true;
        
        // Scroll directly to bottom (where next-steps is) - simpler and more reliable
        // Use longer delay to ensure DOM has fully rendered next-steps
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            
            // Simple approach: scroll to bottom where next-steps is located
            const scrollBefore = container.scrollTop;
            const targetScroll = container.scrollHeight;
            
            container.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
            
            // Verify scroll actually happened after a delay
            setTimeout(() => {
              if (scrollContainerRef.current) {
                const scrollAfter = scrollContainerRef.current.scrollTop;
                void scrollAfter;
                void scrollBefore;
                void targetScroll;
              }
            }, 1000);
          }
        }, 800);
      }
    };
    
    window.addEventListener('scroll-to-next-steps', handleScrollToNextSteps);
    return () => window.removeEventListener('scroll-to-next-steps', handleScrollToNextSteps);
  }, []);

  // Reset checklistDone when confirmation is removed from feed (e.g., on restart)
  useEffect(() => {
    const hasConfirmation = panelFeed.some(item => item.type === 'confirmation');
    if (!hasConfirmation) {
      setChecklistDone(false);
    }
  }, [panelFeed]);

  // Track if completion callback has been called to prevent multiple calls
  const completionCalledRef = useRef(false);

  // Stable callback for checklist completion - triggers parent to add next-steps and updates local state
  const handleChecklistComplete = useCallback(() => {
    // Only call once to prevent infinite loop
    if (completionCalledRef.current) {
      return;
    }
    completionCalledRef.current = true;

    setChecklistDone(true);
    // Notify parent to add next-steps item to feed
    if (onChecklistComplete) {
      onChecklistComplete();
    }
    
    // Scroll will be triggered by parent via custom event after feed updates
  }, [onChecklistComplete]);

  // Reset completion flag when confirmation is removed from feed
  useEffect(() => {
    const hasConfirmation = panelFeed.some(item => item.type === 'confirmation');
    if (!hasConfirmation) {
      setChecklistDone(false);
      completionCalledRef.current = false;
    }
  }, [panelFeed]);

  const handleChatSubmit = (message: string) => {
    if (message.trim()) {
      onMessageSend?.(message);
      setChatInput("");
    }
  };

  // Track if we've already scrolled to next-steps to prevent blinking
  const hasScrolledToNextStepsRef = useRef(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasScrolledToChecklistRef = useRef(false);
  const isScrollingToChecklistRef = useRef(false);
  
  // Scroll to show confirmation checklist when it's added to feed (on approve)
  useEffect(() => {
    const currentConfirmationCount = panelFeed.filter(item => item.type === 'confirmation').length;
    const confirmationJustAdded = currentConfirmationCount > prevConfirmationCount;

    // Don't check ref here - it might not be attached yet. Check inside delayed callback instead.
    if (confirmationJustAdded && !hasScrolledToChecklistRef.current && scrollContainerRef.current) {
      hasScrolledToChecklistRef.current = true;
      isScrollingToChecklistRef.current = true; // Mark that we're scrolling to prevent restore interference
      
      // Wait for DOM to render and ref to attach, then scroll to show the checklist.
      setTimeout(() => {
        if (scrollContainerRef.current && confirmationChecklistRef.current) {
          const container = scrollContainerRef.current;
          const checklistElement = confirmationChecklistRef.current;
          
          // Get position of checklist relative to scroll container
          const containerRect = container.getBoundingClientRect();
          const checklistRect = checklistElement.getBoundingClientRect();
          
          // Calculate scroll position to show checklist (with small offset from top)
          const currentScrollTop = container.scrollTop;
          const targetOffsetTop = checklistRect.top - containerRect.top + currentScrollTop;
          const scrollToPosition = Math.max(0, targetOffsetTop - 20);
          
          container.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
          });

          setTimeout(() => {
            isScrollingToChecklistRef.current = false;
          }, 800);
        } else {
          isScrollingToChecklistRef.current = false;
        }
      }, 500);
    }
    
    // Always update module-level counter at the end to track current state for the next effect run
    // Update unconditionally to ensure it persists across effect runs and remounts
    prevConfirmationCount = currentConfirmationCount;
    
    // Reset flag when confirmation is removed (e.g., on restart)
    if (currentConfirmationCount === 0) {
      hasScrolledToChecklistRef.current = false;
    }
  }, [panelFeed]);

  // Finish-Line Snap: Scroll DOWN to next-steps section ONLY AFTER the 2nd checklist (AnimatedChecklist/confirmation) completes
  // NOTE: This is tied to the 2nd checklist (confirmation checklist with "$500K committed..."), NOT the 1st checklist (LoadingRevealsComponent)
  // FIX: Only reset scroll flag when feed is cleared (next-steps removed), NOT when checklistDone is false (React batching issue)
  useEffect(() => {
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');

    // Reset scroll flag ONLY when next-steps is removed from feed (e.g., on restart)
    // DO NOT reset when checklistDone is false - this causes race condition with React state batching
    if (!hasNextSteps) {
      hasScrolledToNextStepsRef.current = false;
    }
  }, [panelFeed]);

  // Separate effect that triggers scroll ONLY when checklistDone becomes true AND next-steps exists
  useEffect(() => {
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');
    
    // Clear any pending scroll timer
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }

    // Only scroll if the 2nd checklist (confirmation) is done AND next-steps is in feed AND we haven't scrolled yet
    if (checklistDone && hasNextSteps && !hasScrolledToNextStepsRef.current) {
      // Mark as scrolled immediately to prevent re-triggering
      hasScrolledToNextStepsRef.current = true;
      
      // Wait for DOM to fully render next-steps, then scroll DOWN to the next-steps element
      scrollTimerRef.current = setTimeout(() => {
        if (scrollContainerRef.current && nextStepsRef.current) {
          const container = scrollContainerRef.current;
          const targetElement = nextStepsRef.current;
          
          // Get the position of next-steps relative to the scroll container
          const containerRect = container.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          
          // Calculate the scroll position needed to show next-steps
          // targetRect.top is relative to viewport, containerRect.top is container's position in viewport
          // We need the position relative to the scroll container's content
          const currentScrollTop = container.scrollTop;
          const targetOffsetTop = targetRect.top - containerRect.top + currentScrollTop;
          const scrollToPosition = Math.max(0, targetOffsetTop - 20);
          
          // Scroll DOWN to the next-steps section (with small offset from top for visibility)
          container.scrollTo({
            top: scrollToPosition, // 20px offset from top, ensure non-negative
            behavior: 'smooth'
          });
        }
        scrollTimerRef.current = null;
      }, 800); // Increased delay to ensure checklist animation is fully complete and DOM is ready
    }

    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, [checklistDone, panelFeed]); // Watch checklistDone FIRST to ensure it triggers after state update

  // Single return statement with permanent header, feed-style body, and permanent input box
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: T.colors.background }}>
      {/* Header - PERMANENT, never changes */}
      <PanelHeader onClose={onClose} />

      {/* Body - ARRAY-BASED FEED: Map over feed array with stable keys to prevent remounting */}
      <div 
        ref={(el) => {
          scrollContainerRef.current = el;
        }}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex flex-col gap-6">
          {panelFeed.map((item) => {
            // CRITICAL: Use stable key={item.id} so React never remounts existing items
            switch (item.type) {
              case 'loading':
                return (
                  <div key={item.id}>
                    <Screen2Body />
                  </div>
                );
              
              case 'planner':
                // Planner is disabled if confirmation exists in feed
                const isDisabled = panelFeed.some(feedItem => feedItem.type === 'confirmation');
                return (
                  <div key={item.id}>
                    <Screen3Body 
                      stepperValue={stepperValue} 
                      onStepperChange={onStepperChange} 
                      onApprove={onApprove}
                      isDisabled={isDisabled}
                    />
                  </div>
                );
              
              case 'confirmation':
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      confirmationChecklistRef.current = el;
                    }}
                    className="px-6 pb-6"
                  >
                    <Screen4Body 
                      stepperValue={stepperValue} 
                      onComplete={handleChecklistComplete}
                    />
                  </div>
                );
              
              case 'next-steps':
                // Render next-steps immediately when it appears in feed
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      nextStepsRef.current = el;
                    }}
                    data-next-steps
                    className="px-6 pb-6"
                  >
                    <PostApprovalMessage stepperValue={stepperValue} />
                  </div>
                );
              
              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Input Box - PERMANENT, always present, never conditional */}
      <PanelInputBox onSubmit={handleChatSubmit} value={chatInput} onChange={setChatInput} />
    </div>
  );
}
