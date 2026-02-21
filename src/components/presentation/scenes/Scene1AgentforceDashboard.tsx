"use client";

import { SLACK_TOKENS } from "@/design/slack-tokens";
import Image from "next/image";
import {
  IconStar,
  IconX,
} from "@/components/icons";

const T = SLACK_TOKENS;

type ScenarioType = "conservative" | "quota" | "stretch";

interface Scenario {
  id: ScenarioType;
  label: string;
  commission: number;
  pipelineGap: string;
  aiWorkload: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    label: "Conservative",
    commission: 45000,
    pipelineGap: "$300K",
    aiWorkload: "Low",
  },
  {
    id: "quota",
    label: "Quota",
    commission: 60000,
    pipelineGap: "$500K",
    aiWorkload: "Medium",
  },
  {
    id: "stretch",
    label: "Stretch",
    commission: 75000,
    pipelineGap: "$800K",
    aiWorkload: "High",
  },
];

interface Scene1AgentforceDashboardProps {
  activeScenario: ScenarioType;
  onScenarioChange: (scenario: ScenarioType) => void;
  isApproved: boolean;
  onApprove: () => void;
}

export function Scene1AgentforceDashboard({
  activeScenario,
  onScenarioChange,
  isApproved,
  onApprove,
}: Scene1AgentforceDashboardProps) {
  const currentScenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[1];

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: T.colors.background,
        borderLeft: `1px solid ${T.colors.border}`,
        fontFamily: T.typography.fontFamily,
      }}
    >
      {/* Header - matching SlackbotPanel header style */}
      <div className="border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Favorite">
              <IconStar width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />
            <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>Slackbot</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 p-6">
      {/* Dashboard Title */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1" style={{ color: T.colors.text }}>
          Pipeline Planning
        </h2>
        <p className="text-sm" style={{ color: T.colors.textSecondary }}>
          Q3 Planning & Modeling
        </p>
      </div>

      {/* Top Metrics */}
      <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: "#f8f8f8", borderColor: T.colors.border }}>
        <div className="text-xs font-medium mb-1" style={{ color: T.colors.textSecondary }}>
          Active Pipeline
        </div>
        <div className="text-2xl font-bold" style={{ color: T.colors.text }}>
          $1.2M
        </div>
      </div>

      {/* 3-State Slider */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3" style={{ color: T.colors.text }}>
          Select Your Q3 Commit
        </div>
        <div className="flex gap-2 mb-2">
          {SCENARIOS.map((scenario) => {
            const isActive = activeScenario === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onScenarioChange(scenario.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  isActive ? "shadow-md" : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? "#611f69" : "#ffffff",
                  color: isActive ? "#ffffff" : T.colors.text,
                  border: `2px solid ${isActive ? "#611f69" : T.colors.border}`,
                }}
              >
                {scenario.label}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: T.colors.textSecondary }}>
          <span>{SCENARIOS[0].label}</span>
          <span>{SCENARIOS[1].label}</span>
          <span>{SCENARIOS[2].label}</span>
        </div>
      </div>

      {/* Scenario Details */}
      <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: "#ffffff", borderColor: T.colors.border }}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: T.colors.textSecondary }}>
              Estimated Commission:
            </span>
            <span className="text-lg font-semibold" style={{ color: T.colors.text }}>
              ${currentScenario.commission.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: T.colors.textSecondary }}>
              Pipeline Gap:
            </span>
            <span className="text-sm font-medium" style={{ color: T.colors.text }}>
              {currentScenario.pipelineGap}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: T.colors.textSecondary }}>
              AI Workload:
            </span>
            <span className="text-sm font-medium" style={{ color: T.colors.text }}>
              {currentScenario.aiWorkload}
            </span>
          </div>
        </div>
      </div>

      {/* Approve Button */}
      <button
        type="button"
        onClick={onApprove}
        disabled={isApproved}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
          isApproved ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 shadow-md"
        }`}
        style={{
          backgroundColor: isApproved ? "#cccccc" : "#611f69",
          color: "#ffffff",
        }}
      >
        {isApproved ? "Plan Approved ✓" : "Approve Plan"}
      </button>
      </div>
    </div>
  );
}
