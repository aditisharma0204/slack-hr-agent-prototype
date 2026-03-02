"use client";

import React, { useState, useMemo, memo } from "react";
import Image from "next/image";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { cn } from "@/lib/utils";

const T = SLACK_TOKENS;

// Sales Methodology Types - Expanded
type Methodology = "MEDDICC" | "BANT" | "Challenger" | "SPIN" | "Sandler" | "SPICED";

interface MethodologyConfig {
  health: number;
  progress: number;
  quotaImpact: number;
  quotaValue: number;
  milestones: string[]; // Milestone IDs for this methodology
}

const METHODOLOGY_CONFIGS: Record<Methodology, MethodologyConfig> = {
  MEDDICC: {
    health: 92,
    progress: 91,
    quotaImpact: 9,
    quotaValue: 45000,
    milestones: ["tech-validation", "procurement-review", "executive-alignment", "security-alignment", "final-pricing"],
  },
  BANT: {
    health: 60,
    progress: 95,
    quotaImpact: 9,
    quotaValue: 45000,
    milestones: ["procurement-review", "executive-alignment", "final-pricing"], // Drops Technical Validation and Security Alignment
  },
  Challenger: {
    health: 85,
    progress: 70,
    quotaImpact: 9,
    quotaValue: 45000,
    milestones: ["tech-validation", "procurement-review", "executive-alignment", "reframing-insight", "roi-justification"],
  },
  SPIN: {
    health: 88,
    progress: 78,
    quotaImpact: 9,
    quotaValue: 45000,
    milestones: ["tech-validation", "procurement-review", "executive-alignment", "security-alignment"],
  },
  Sandler: {
    health: 82,
    progress: 75,
    quotaImpact: 9,
    quotaValue: 45000,
    milestones: ["tech-validation", "procurement-review", "executive-alignment", "upfront-contract"],
  },
  SPICED: {
    health: 90,
    progress: 88,
    quotaImpact: 9,
    quotaValue: 45000,
    milestones: ["tech-validation", "procurement-review", "executive-alignment", "security-alignment", "final-pricing"],
  },
};

// Human collaborator interface
interface HumanCollaborator {
  name: string;
  role: string;
  avatar: string;
}

// Human Face Pile Component (Seller-Only, Circular Avatars)
interface HumanFacePileProps {
  collaborators: HumanCollaborator[];
  size?: "sm" | "md";
  onAddSeller?: () => void;
}

const HumanFacePile = memo(function HumanFacePile({ collaborators, size = "sm", onAddSeller }: HumanFacePileProps) {
  const sizeClasses = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const pixelSize = size === "sm" ? 20 : 24;

  if (collaborators.length === 0) {
    return (
      <button
        type="button"
        onClick={onAddSeller}
        className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-400 hover:bg-gray-100 transition-colors text-xs font-semibold"
        title="Add Seller"
      >
        +
      </button>
    );
  }

  return (
    <div className="flex -space-x-2 flex-row-reverse justify-end items-center">
      {collaborators.reverse().map((person, index) => (
        <div key={`${person.name}-${index}`} style={{ zIndex: 10 + index }} className="group relative">
          <Image
            src={person.avatar}
            alt={person.name}
            width={pixelSize}
            height={pixelSize}
            className={`${sizeClasses} rounded-full border-2 border-white bg-white relative`}
            style={{ borderRadius: '50%' }}
          />
          {/* Tooltip with names and roles */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none z-[100]">
            <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap relative">
              {collaborators.map(p => `${p.name} (${p.role})`).join(", ")}
              <div className="absolute top-full left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// ToolIcon component (for Ecosystem Signal column only)
interface ToolIconProps {
  name: string;
  size?: "sm" | "md";
}

const ToolIcon = memo(function ToolIcon({ name, size = "sm" }: ToolIconProps) {
  const toolMap: Record<string, string> = {
    "Salesforce": "/Salesforce.png",
    "Gmail": "/Gmail.png",
    "Highspot": "/Highspot.png",
    "Gong": "/gong.png",
    "Google Calendar": "/Google Calendar.png",
    "Google Drive": "/Google Drive.png",
    "Clari": "/Clari.png",
    "Salesloft": "/salesloft.png",
    "Slack": "/Slack.png",
    "Confluence": "/Slack.png", // Fallback
  };

  const iconPath = toolMap[name] || null;
  const encodedPath = iconPath ? encodeURI(iconPath) : null;
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  const pixelSize = size === "sm" ? 16 : 24;

  return (
    <div className="inline-flex items-center justify-center">
      {encodedPath ? (
        <Image
          src={encodedPath}
          alt={name}
          width={pixelSize}
          height={pixelSize}
          className={`${sizeClasses} shrink-0 object-contain`}
          style={{ verticalAlign: 'middle' }}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full bg-gray-300 shrink-0 flex items-center justify-center`}
          title={name}
          aria-label={name}
        />
      )}
    </div>
  );
});

// SlackButton component
interface SlackButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const SlackButton = memo(function SlackButton({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  type = "button"
}: SlackButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-white border border-gray-300 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  );
});

// Milestone data type
interface Milestone {
  id: string;
  name: string;
  collaborators: HumanCollaborator[];
  signal: string;
  signalTool?: string;
  signalSentiment?: "positive" | "neutral" | "negative";
  progress: number;
  status?: "pending" | "in-progress" | "completed";
  nextAction?: string;
  actionType: "Execute" | "Nudge";
}

// Base milestone data - All milestones across methodologies
const baseMilestones: Milestone[] = [
  {
    id: "tech-validation",
    name: "Technical Validation",
    collaborators: [
      { name: "Rita Patel", role: "AE", avatar: "https://randomuser.me/api/portraits/med/women/75.jpg" },
      { name: "Priya Shah", role: "SE", avatar: "https://randomuser.me/api/portraits/med/women/32.jpg" },
    ],
    signal: "Budget questions paused",
    signalTool: "Gong",
    signalSentiment: "positive",
    progress: 75,
    status: "in-progress",
    actionType: "Execute",
  },
  {
    id: "procurement-review",
    name: "Procurement Review",
    collaborators: [
      { name: "Rita Patel", role: "AE", avatar: "https://randomuser.me/api/portraits/med/women/75.jpg" },
    ],
    signal: "Follow-up sent. Auto-reminder set for 24h",
    signalTool: "Gmail",
    signalSentiment: "neutral",
    progress: 60,
    status: "in-progress",
    actionType: "Nudge",
  },
  {
    id: "executive-alignment",
    name: "Executive Alignment",
    collaborators: [
      { name: "Rita Patel", role: "AE", avatar: "https://randomuser.me/api/portraits/med/women/75.jpg" },
      { name: "Jordan Hayes", role: "VP", avatar: "https://randomuser.me/api/portraits/med/men/22.jpg" },
    ],
    signal: "Meeting scheduled",
    signalTool: "Google Calendar",
    signalSentiment: "positive",
    progress: 40,
    status: "pending",
    actionType: "Execute",
  },
  {
    id: "security-alignment",
    name: "Security Alignment",
    collaborators: [
      { name: "Priya Shah", role: "SE", avatar: "https://randomuser.me/api/portraits/med/women/32.jpg" },
    ],
    signal: "InfoSec pack downloaded",
    signalTool: "Confluence",
    signalSentiment: "positive",
    progress: 30,
    status: "pending",
    actionType: "Execute",
  },
  {
    id: "final-pricing",
    name: "Final Pricing Approval",
    collaborators: [
      { name: "Jordan Hayes", role: "VP", avatar: "https://randomuser.me/api/portraits/med/men/22.jpg" },
    ],
    signal: "Discount approved by Finance",
    signalTool: "Salesforce",
    signalSentiment: "positive",
    progress: 20,
    status: "pending",
    actionType: "Nudge",
  },
  {
    id: "reframing-insight",
    name: "Reframing Insight",
    collaborators: [
      { name: "Rita Patel", role: "AE", avatar: "https://randomuser.me/api/portraits/med/women/75.jpg" },
    ],
    signal: "Insight deck shared",
    signalTool: "Highspot",
    signalSentiment: "positive",
    progress: 35,
    status: "pending",
    actionType: "Execute",
  },
  {
    id: "roi-justification",
    name: "ROI Justification",
    collaborators: [
      { name: "Jordan Hayes", role: "VP", avatar: "https://randomuser.me/api/portraits/med/men/22.jpg" },
    ],
    signal: "ROI model validated",
    signalTool: "Highspot",
    signalSentiment: "positive",
    progress: 25,
    status: "pending",
    actionType: "Execute",
  },
  {
    id: "upfront-contract",
    name: "Up-front Contract",
    collaborators: [
      { name: "Rita Patel", role: "AE", avatar: "https://randomuser.me/api/portraits/med/women/75.jpg" },
    ],
    signal: "Contract terms agreed",
    signalTool: "Gmail",
    signalSentiment: "positive",
    progress: 45,
    status: "pending",
    actionType: "Nudge",
  },
];

// Segmented Multi-Tonal Progress Bar Component
interface SegmentedProgressBarProps {
  progress: number;
  completedSegments: number;
  totalSegments: number;
}

const SegmentedProgressBar = memo(function SegmentedProgressBar({ progress, completedSegments, totalSegments }: SegmentedProgressBarProps) {
  const segmentWidth = 100 / totalSegments;
  
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
      {Array.from({ length: totalSegments }).map((_, index) => {
        const segmentStart = index * segmentWidth;
        const segmentEnd = (index + 1) * segmentWidth;
        const isCompleted = index < completedSegments;
        const isInProgress = index === completedSegments && progress > segmentStart;
        const segmentProgress = Math.min(100, Math.max(0, ((progress - segmentStart) / segmentWidth) * 100));
        
        // Color mapping: Dark Green for Completed, Bright Blue for In-Progress, Light Gray for Remaining
        let segmentColor = "#e5e7eb"; // Light gray for remaining
        if (isCompleted) {
          segmentColor = "#059669"; // Dark green for completed
        } else if (isInProgress) {
          segmentColor = "#2563eb"; // Bright blue for in-progress
        }
        
        return (
          <div
            key={index}
            className="h-full absolute top-0 transition-all duration-300"
            style={{
              left: `${segmentStart}%`,
              width: `${segmentWidth}%`,
              backgroundColor: segmentProgress > 0 ? segmentColor : 'transparent',
            }}
          />
        );
      })}
    </div>
  );
});

export function DealCanvasTab() {
  const [showForMe, setShowForMe] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [methodology, setMethodology] = useState<Methodology>("MEDDICC");
  const [milestones, setMilestones] = useState<Milestone[]>(baseMilestones);
  const [overallProgress, setOverallProgress] = useState(91);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  // Get methodology config
  const config = METHODOLOGY_CONFIGS[methodology];

  // Update overall progress when methodology changes
  useMemo(() => {
    setOverallProgress(config.progress);
  }, [methodology, config.progress]);

  // Filter milestones based on methodology
  const filteredMilestones = useMemo(() => {
    return milestones.filter(m => config.milestones.includes(m.id));
  }, [methodology, milestones, config.milestones]);

  // Filter milestones based on "Show for Me" toggle (only show where Rita is present)
  const visibleMilestones = useMemo(() => {
    if (!showForMe) return filteredMilestones;
    return filteredMilestones.filter(m => 
      m.collaborators.some(c => c.name === "Rita Patel")
    );
  }, [showForMe, filteredMilestones]);

  // Count completed milestones
  const completedCount = useMemo(() => {
    return visibleMilestones.filter(m => m.status === "completed").length;
  }, [visibleMilestones]);

  // Handle Add Seller
  const handleAddSeller = (milestoneId: string) => {
    // Mock user picker - in real app would open a modal
    const newCollaborator: HumanCollaborator = {
      name: "Rita Patel",
      role: "AE",
      avatar: "https://randomuser.me/api/portraits/med/women/75.jpg",
    };
    
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId && m.collaborators.length === 0) {
        return {
          ...m,
          collaborators: [newCollaborator],
        };
      }
      return m;
    }));
  };

  // Handle Execute action - increments progress (momentum logic)
  const handleExecute = (milestoneId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const nextAction = m.id === "tech-validation" 
          ? "✅ Technical alignment secured. Sarah Chen viewed the recap. Draft Executive Summary?"
          : m.id === "security-alignment"
          ? "✅ Security review complete. InfoSec team approved. Schedule final walkthrough?"
          : m.id === "reframing-insight"
          ? "✅ Insight reframed. Buyer engaged with new perspective. Schedule follow-up?"
          : m.id === "roi-justification"
          ? "✅ ROI model validated. Finance approved. Present to Economic Buyer?"
          : undefined;
        
        // Momentum Logic: Increment overall progress by 3%
        setOverallProgress(prevProgress => Math.min(100, prevProgress + 3));
        
        return {
          ...m,
          status: "completed" as const,
          progress: 100,
          nextAction,
        };
      }
      return m;
    }));
    setCompletedActions(prev => new Set([...Array.from(prev), milestoneId]));
  };

  // Handle Nudge action
  const handleNudge = (milestoneId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedSignal = m.id === "procurement-review"
          ? "Follow-up sent. Auto-reminder set for 24h"
          : m.id === "final-pricing"
          ? "Reminder sent to Finance. Awaiting approval."
          : m.signal;
        return {
          ...m,
          signal: updatedSignal,
          signalTool: m.id === "procurement-review" ? "Gmail" : m.signalTool,
        };
      }
      return m;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Top Controls - Inline Methodology & View Switcher */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForMe(!showForMe)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded transition-colors",
              showForMe 
                ? "bg-blue-50 text-blue-700" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            )}
            style={{ fontSize: T.typography.small }}
          >
            Show for Me
          </button>
          
          {/* Inline Methodology Dropdown */}
          <div className="relative">
            <select
              value={methodology}
              onChange={(e) => setMethodology(e.target.value as Methodology)}
              className="px-3 py-1.5 text-sm font-medium border rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ fontSize: T.typography.small, borderColor: T.colors.border }}
            >
              <option value="MEDDICC">MEDDICC (Recommended)</option>
              <option value="BANT">BANT</option>
              <option value="Challenger">Challenger</option>
              <option value="SPIN">SPIN</option>
              <option value="Sandler">Sandler</option>
              <option value="SPICED">SPICED</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border rounded-md" style={{ borderColor: T.colors.border }}>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-white text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              )}
              style={{ fontSize: T.typography.small }}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors border-l",
                viewMode === "timeline"
                  ? "bg-white text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              )}
              style={{ fontSize: T.typography.small, borderLeftColor: T.colors.border }}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner - Dynamic based on methodology */}
      <div className="px-4 py-4 border-b shrink-0 bg-gray-50" style={{ borderColor: T.colors.border }}>
        <div className="space-y-3">
          {/* Overall Progress - Segmented Multi-Tonal Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold" style={{ color: T.colors.text }}>
                Finalizing Contract
              </span>
              <span className="text-sm font-semibold" style={{ color: T.colors.text }}>
                {overallProgress}%
              </span>
            </div>
            <SegmentedProgressBar 
              progress={overallProgress} 
              completedSegments={completedCount}
              totalSegments={visibleMilestones.length}
            />
          </div>

          {/* Deal Health & Metrics */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", config.health >= 80 ? "bg-green-500" : "bg-yellow-500")} />
              <span className="text-sm font-medium" style={{ color: T.colors.text }}>
                {config.health >= 80 ? "On Track" : "At Risk"} (Score: {config.health}/100)
              </span>
            </div>
            <div className="text-sm" style={{ color: T.colors.textSecondary }}>
              Days to Close: <span className="font-semibold" style={{ color: T.colors.text }}>12</span>
            </div>
            <div className="text-sm" style={{ color: T.colors.textSecondary }}>
              Value: <span className="font-semibold" style={{ color: T.colors.text }}>$500K</span>{" "}
              <span className="text-xs">(${config.quotaValue.toLocaleString()} / {config.quotaImpact}% Quota Impact)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {viewMode === "list" ? (
          /* List View - Data Table */
          <div className="px-4 py-4">
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="border-b" style={{ borderColor: T.colors.border }}>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: T.colors.text }}>
                    Milestone
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: T.colors.text }}>
                    Owner
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-semibold" style={{ color: T.colors.text }}>
                    Ecosystem Signal
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold" style={{ color: T.colors.text, width: '140px' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleMilestones.map((milestone) => {
                  const isNegativeSignal = milestone.signalSentiment === "negative" || milestone.signalSentiment === "neutral";
                  const isCompleted = milestone.status === "completed";
                  
                  return (
                    <React.Fragment key={milestone.id}>
                      <tr 
                        className={cn(
                          "border-b transition-colors",
                          isNegativeSignal && !isCompleted ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                        )}
                        style={{ borderColor: T.colors.border }}
                      >
                        <td className="py-3 px-2" style={{ verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                Completed
                              </span>
                            )}
                            <span className="text-sm font-medium" style={{ color: T.colors.text }}>
                              {milestone.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2" style={{ verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-2">
                            <HumanFacePile 
                              collaborators={milestone.collaborators} 
                              size="sm"
                              onAddSeller={() => handleAddSeller(milestone.id)}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2" style={{ verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-2">
                            {milestone.signalTool && (
                              <ToolIcon name={milestone.signalTool} size="sm" />
                            )}
                            <span className="text-sm" style={{ color: T.colors.textSecondary }}>
                              {milestone.signalTool ? `${milestone.signalTool}: ` : ""}
                              {milestone.signal}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2" style={{ verticalAlign: 'middle', width: '140px' }}>
                          <div className="flex justify-end items-center w-full">
                            {!isCompleted ? (
                              <SlackButton onClick={() => milestone.actionType === "Execute" ? handleExecute(milestone.id) : handleNudge(milestone.id)}>
                                {milestone.actionType}
                              </SlackButton>
                            ) : (
                              <span className="text-xs text-gray-500 px-4 py-2" style={{ minWidth: '100px', textAlign: 'right', display: 'inline-block' }}>Done</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Next Action Row */}
                      {milestone.nextAction && (
                        <tr>
                          <td colSpan={4} className="px-2 py-2 bg-blue-50">
                            <div className="flex items-center gap-2 text-sm" style={{ color: T.colors.text }}>
                              <span>{milestone.nextAction}</span>
                              <SlackButton onClick={() => {}} className="ml-auto">
                                Draft
                              </SlackButton>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline View - High-Fidelity Gantt Cards */
          <div className="px-4 py-4 space-y-3">
            {visibleMilestones.map((milestone) => {
              const isNegativeSignal = milestone.signalSentiment === "negative" || milestone.signalSentiment === "neutral";
              const isCompleted = milestone.status === "completed";
              
              return (
                <div key={milestone.id} className="space-y-2">
                  <div
                    className={cn(
                      "border rounded-lg p-4 transition-shadow bg-white",
                      isNegativeSignal && !isCompleted && "border-red-200"
                    )}
                    style={{ borderColor: isNegativeSignal && !isCompleted ? "#fca5a5" : T.colors.border }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isCompleted && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                              Completed
                            </span>
                          )}
                          <h3 className="text-sm font-semibold" style={{ color: T.colors.text }}>
                            {milestone.name}
                          </h3>
                        </div>
                        {/* Human Face Pile */}
                        <div className="flex items-center gap-2 mb-2">
                          <HumanFacePile 
                            collaborators={milestone.collaborators} 
                            size="sm"
                            onAddSeller={() => handleAddSeller(milestone.id)}
                          />
                        </div>
                        {/* Next Step Preview */}
                        {milestone.nextAction && (
                          <div className="text-xs mt-2" style={{ color: T.colors.textSecondary }}>
                            Next: {milestone.nextAction.split(".")[0]}
                          </div>
                        )}
                      </div>
                      {!isCompleted && (
                        <SlackButton onClick={() => milestone.actionType === "Execute" ? handleExecute(milestone.id) : handleNudge(milestone.id)}>
                          {milestone.actionType}
                        </SlackButton>
                      )}
                    </div>
                    {/* Horizontal Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ width: `${milestone.progress}%`, backgroundColor: T.colors.link }}
                      />
                    </div>
                    {/* Ecosystem Signal */}
                    <div className="flex items-center gap-2 text-xs mt-2" style={{ color: T.colors.textSecondary }}>
                      {milestone.signalTool && (
                        <ToolIcon name={milestone.signalTool} size="sm" />
                      )}
                      <span>
                        {milestone.signalTool ? `${milestone.signalTool}: ` : ""}
                        {milestone.signal}
                      </span>
                    </div>
                  </div>
                  {/* Next Action Card */}
                  {milestone.nextAction && (
                    <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-sm" style={{ color: T.colors.text }}>
                        <span>{milestone.nextAction}</span>
                        <SlackButton onClick={() => {}} className="ml-auto">
                          Draft
                        </SlackButton>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
