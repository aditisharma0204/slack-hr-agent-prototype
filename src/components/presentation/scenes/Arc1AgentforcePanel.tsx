"use client";

import { motion } from "framer-motion";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import Image from "next/image";
import { IconStar, IconPencil, IconMoreVertical, IconX } from "@/components/icons";
import { MessageInput } from "@/components/shared/MessageInput";
import { useState, useEffect } from "react";

const T = SLACK_TOKENS;

type Screen = 1 | 2 | 3 | 4 | 5;

// Loading reveals component
function LoadingRevealsComponent() {
  const [revealed, setRevealed] = useState<string[]>([]);
  const reveals = [
    "✓ Quota confirmed from Capacity Planning: $500K",
    "✓ Inherited pipeline loaded: $1.2M · 14 deals",
    "✓ Q4 velocity analysed: win rate, cycle, deal size",
    "✓ Closing pattern mapped: 68% personal vs 41% delegated",
    "✓ Three scenarios modelled. Here's your Q1.",
  ];

  useEffect(() => {
    reveals.forEach((text, index) => {
      setTimeout(() => {
        setRevealed((prev) => [...prev, text]);
      }, index * 600);
    });
  }, []);

  return (
    <div className="space-y-1">
      {revealed.map((text, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[15px]"
          style={{ color: "#1d1c1d" }}
        >
          {text}
        </motion.p>
      ))}
    </div>
  );
}

interface Arc1AgentforcePanelProps {
  currentScreen: Screen;
  stepperValue: number;
  onStepperChange: (value: number) => void;
  onApprove: () => void;
  onMessageSend?: (message: string) => void;
  onScreenChange?: (screen: Screen) => void;
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
function PanelHeader() {
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
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close">
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
    <div className="flex-1 overflow-y-auto min-h-0" style={{ backgroundColor: "#ffffff" }}>
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
    <div className="flex-1 overflow-y-auto min-h-0 p-6" style={{ backgroundColor: "#ffffff" }}>
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

// Screen 3 Body Content
function Screen3Body({
  stepperValue,
  onStepperChange,
  onApprove,
}: {
  stepperValue: number;
  onStepperChange: (value: number) => void;
  onApprove: () => void;
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
    <div className="flex-1 overflow-y-auto min-h-0 p-6" style={{ backgroundColor: "#ffffff" }}>
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
        <div className="flex gap-2 mb-4">
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
                onClick={() => onStepperChange(value)}
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onStepperChange(Math.max(400000, stepperValue - 10000))}
            disabled={stepperValue <= 400000}
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
            onClick={() => onStepperChange(Math.min(700000, stepperValue + 10000))}
            disabled={stepperValue >= 700000}
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

      {/* Approve Button */}
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
    </div>
  );
}

// Screen 4 Body Content
function Screen4Body({ stepperValue }: { stepperValue: number }) {
  const commission = calculateCommission(stepperValue);
  const targetK = Math.round(stepperValue / 1000);

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6">
      <div className="mb-6">
        <div className="text-lg font-semibold mb-1" style={{ color: T.colors.text }}>Q1 Plan: APPROVED ✓</div>
        <div className="text-sm" style={{ color: T.colors.textSecondary }}>
          Commit: ${targetK.toLocaleString()}K | Commission target: ${commission.toLocaleString()}
        </div>
      </div>
      <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: "#f0fdf4", borderColor: "#10b981" }}>
        <div className="text-sm font-semibold mb-2" style={{ color: "#10b981" }}>Agent status: ACTIVE — working tonight</div>
        <div className="text-xs space-y-1" style={{ color: T.colors.textSecondary }}>
          <div>🤖 Prospecting Agent</div>
          <div>Researching {stepperValue >= 600000 ? "12" : "8"} target accounts</div>
          <div>First sequences: Tonight 11 PM</div>
          <div>Expected responses: Jan 4–5</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: "#10b981" }}>✓</span>
          <span style={{ color: T.colors.text }}>Submitted to Salesforce</span>
          <span className="text-xs" style={{ color: T.colors.textSecondary }}>4 seconds ago</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: "#10b981" }}>✓</span>
          <span style={{ color: T.colors.text }}>Sarah notified via Clari</span>
          <span className="text-xs" style={{ color: T.colors.textSecondary }}>Just now</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: "#10b981" }}>✓</span>
          <span style={{ color: T.colors.text }}>Calendar blocks created</span>
          <span className="text-xs" style={{ color: T.colors.textSecondary }}>2 mornings/week</span>
        </div>
      </div>
    </div>
  );
}

// Screen 5 Body Content
function Screen5Body() {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6">
      <div className="text-sm mb-4" style={{ color: T.colors.textSecondary }}>
        Ready for your next question.
      </div>
    </div>
  );
}

export function Arc1AgentforcePanel({
  currentScreen,
  stepperValue,
  onStepperChange,
  onApprove,
  onMessageSend,
  onScreenChange,
}: Arc1AgentforcePanelProps) {
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = (message: string) => {
    if (message.trim()) {
      onMessageSend?.(message);
      setChatInput("");
    }
  };

  // Single return statement with permanent header, conditional body, and permanent input box
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: T.colors.background }}>
      {/* Header - PERMANENT, never changes */}
      <PanelHeader />

      {/* Body - ONLY this changes with state */}
      {currentScreen === 1 && <Screen1Body onScreenChange={onScreenChange} />}
      {currentScreen === 2 && <Screen2Body />}
      {currentScreen === 3 && <Screen3Body stepperValue={stepperValue} onStepperChange={onStepperChange} onApprove={onApprove} />}
      {currentScreen === 4 && <Screen4Body stepperValue={stepperValue} />}
      {currentScreen === 5 && <Screen5Body />}

      {/* Input Box - PERMANENT, always present, never conditional */}
      <PanelInputBox onSubmit={handleChatSubmit} value={chatInput} onChange={setChatInput} />
    </div>
  );
}
