"use client";

import { useState, useEffect, useMemo } from "react";
import {
  buildScanDataFromDemo,
  buildProposalCardsFromDemo,
  assignCardHorizons,
  getSupplementalCards,
  getExtraWorkNeededCards,
  computeAmbitionMetrics,
  getDayZeroVerdict,
  type ActionCard,
  type DemoData,
} from "@/lib/vibeface-logic";
import { BlockKitRenderer } from "@/components/block-kit/BlockKitRenderer";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import { cn } from "@/lib/utils";

export function SlackbotProactiveTab() {
  const [demoData, setDemoData] = useState<DemoData | null>(null);
  const [ambitionDays, setAmbitionDays] = useState(45);
  const [activePeriod, setActivePeriod] = useState<"today" | "this_week" | "this_month">("today");
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/demo-data.json")
      .then((r) => r.json())
      .then(setDemoData)
      .catch(console.error);
  }, []);

  const { scanData, mergedCards, verdict, ambitionMetrics } = useMemo(() => {
    if (!demoData) return {};
    const scanData = buildScanDataFromDemo(demoData);
    const baseCards = buildProposalCardsFromDemo(demoData);
    const ambitionMetrics = computeAmbitionMetrics(scanData, ambitionDays);
    const extraCards = getExtraWorkNeededCards(scanData, ambitionMetrics, ambitionDays);
    const withHorizons = assignCardHorizons([...baseCards, ...extraCards]);
    const supplemental = getSupplementalCards(withHorizons, ambitionDays);
    const allMerged = [...withHorizons, ...supplemental];
    const mergedCards = allMerged.filter((c) => !dismissedIds.has(String(c.recordId || "")));
    const verdict = getDayZeroVerdict({ numberBlock: null, cardsCount: mergedCards.length }, scanData);
    return { scanData, mergedCards, verdict, ambitionMetrics };
  }, [demoData, ambitionDays, dismissedIds]);

  const filteredCards = useMemo(() => {
    if (!mergedCards) return [];
    return mergedCards.filter((c) => c.horizon === activePeriod);
  }, [mergedCards, activePeriod]);

  const counts = useMemo(() => {
    if (!mergedCards) return { today: 0, week: 0, month: 0 };
    return {
      today: mergedCards.filter((c) => c.horizon === "today").length,
      week: mergedCards.filter((c) => c.horizon === "this_week").length,
      month: mergedCards.filter((c) => c.horizon === "this_month").length,
    };
  }, [mergedCards]);

  const handleDismiss = (recordId?: string) => {
    if (recordId) setDismissedIds((prev) => new Set([...Array.from(prev), recordId]));
  };

  const handleAction = (action: string, card: ActionCard) => {
    const dismissActions = ["Dismiss", "I'll handle it", "Later", "Not yet"];
    if (dismissActions.includes(action)) {
      handleDismiss(card.recordId);
    } else {
      alert(`Action: ${action} on ${card.title}`);
    }
  };

  if (!demoData || !verdict) {
    return <div className="text-sm text-[#616061]">Loading...</div>;
  }

  const verdictBlocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: "Your quota snapshot", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*On track:*\n${scanData?.formattedOnTrackToClose ?? "$185K"}` },
        { type: "mrkdwn", text: `*Quota:*\n${scanData?.formattedQuota ?? "$1.0M"}` },
        { type: "mrkdwn", text: `*Gap:*\n${scanData?.formattedGap ?? "$815K"}` },
        { type: "mrkdwn", text: `*Commission:*\n${scanData?.formattedCommissionAtPace ?? "$12,950"}` },
      ],
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: verdict.healthSentence ?? "" },
    },
  ];

  return (
    <div className="space-y-4">
      <BlockKitRenderer blocks={verdictBlocks} />

      <div>
        <label className="text-sm font-medium block mb-2 text-[#616061]">
          Meet quota by: <span className="text-[#1d1c1d] font-semibold">{ambitionDays} days</span>
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#616061]">14</span>
          <input
            type="range"
            min={14}
            max={60}
            step={1}
            value={ambitionDays}
            onChange={(e) => setAmbitionDays(Number(e.target.value))}
            className="flex-1 h-2 rounded-full cursor-pointer accent-[#1264a3]"
          />
          <span className="text-xs text-[#616061]">60</span>
        </div>
        {ambitionMetrics && (
          <div className="text-xs text-[#616061] mt-2">
            {ambitionMetrics.formattedPipelineNeeded} pipeline | {ambitionMetrics.formattedMeetingsPerWeek} meetings/week | {ambitionMetrics.commissionAtQuota} at quota
          </div>
        )}
      </div>

      <div className="font-semibold text-[#1d1c1d]">
        Your next focus — {filteredCards.length} action{filteredCards.length !== 1 ? "s" : ""} toward your {verdict.quotaDisplay}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActivePeriod("today")}
          className={cn(
            "px-4 py-2 rounded text-sm font-medium",
            activePeriod === "today"
              ? "bg-[#1264a3] text-white"
              : "border border-[#e8e8e8] text-[#1d1c1d] hover:bg-[#f8f8f8]"
          )}
        >
          Today ({counts.today})
        </button>
        <button
          type="button"
          onClick={() => setActivePeriod("this_week")}
          className={cn(
            "px-4 py-2 rounded text-sm font-medium",
            activePeriod === "this_week"
              ? "bg-[#1264a3] text-white"
              : "border border-[#e8e8e8] text-[#1d1c1d] hover:bg-[#f8f8f8]"
          )}
        >
          This week ({counts.week})
        </button>
        <button
          type="button"
          onClick={() => setActivePeriod("this_month")}
          className={cn(
            "px-4 py-2 rounded text-sm font-medium",
            activePeriod === "this_month"
              ? "bg-[#1264a3] text-white"
              : "border border-[#e8e8e8] text-[#1d1c1d] hover:bg-[#f8f8f8]"
          )}
        >
          This month ({counts.month})
        </button>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-sm text-[#616061]">No recommended actions for this period.</div>
      ) : (
        filteredCards.map((card, idx) => {
          const cardBlocks: SlackBlock[] = [
            {
              type: "section",
              text: { type: "mrkdwn", text: `*${card.title}*` },
            },
            {
              type: "section",
              text: { type: "mrkdwn", text: card.description },
            },
            ...(card.whyThisMatters
              ? [{ type: "section" as const, text: { type: "mrkdwn" as const, text: `_${card.whyThisMatters}_` } }]
              : []),
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: card.primaryAction, emoji: true },
                  action_id: `primary_${card.recordId}_${idx}`,
                  style: card.primaryAction === "Review" || card.primaryAction === "Yes, prep it" ? "primary" : undefined,
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: card.secondaryAction, emoji: true },
                  action_id: `secondary_${card.recordId}_${idx}`,
                },
              ],
            },
          ].filter(Boolean) as SlackBlock[];

          return (
            <div key={card.recordId || idx} className="mb-4">
              <BlockKitRenderer
                blocks={cardBlocks}
                onAction={(actionId) => {
                  if (actionId.startsWith("secondary_")) {
                    handleAction(card.secondaryAction, card);
                  } else {
                    handleAction(card.primaryAction, card);
                  }
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
