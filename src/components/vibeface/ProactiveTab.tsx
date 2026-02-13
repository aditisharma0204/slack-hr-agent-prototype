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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AMBITION_OPTIONS = [
  { value: 14, label: "14 days (aggressive)" },
  { value: 30, label: "30 days" },
  { value: 45, label: "45 days" },
  { value: 60, label: "60 days (current pace)" },
];

export function ProactiveTab() {
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
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="font-semibold text-foreground">{verdict.numberBlock}</div>
      {verdict.commissionLine && <div className="text-sm text-muted-foreground">{verdict.commissionLine}</div>}
      <div className={cn("text-sm", verdict.healthStatus === "ok" && "text-green-600", verdict.healthStatus === "at_risk" && "text-amber-600", verdict.healthStatus === "trouble" && "text-red-600")}>
        {verdict.healthSentence}
      </div>
      <div className="border-t border-border my-4" />

      <div>
        <label className="text-sm font-medium block mb-2">Meet quota by:</label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={ambitionDays}
          onChange={(e) => setAmbitionDays(Number(e.target.value))}
        >
          {AMBITION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {ambitionMetrics && (
          <div className="text-xs text-muted-foreground mt-2">
            {ambitionMetrics.formattedPipelineNeeded} pipeline | {ambitionMetrics.formattedMeetingsPerWeek} meetings/week | {ambitionMetrics.commissionAtQuota} at quota
          </div>
        )}
      </div>
      <div className="border-t border-border my-4" />

      <div className="font-semibold">
        Your next focus — {filteredCards.length} action{filteredCards.length !== 1 ? "s" : ""} toward your {verdict.quotaDisplay}
      </div>

      <div className="flex gap-2">
        <Button variant={activePeriod === "today" ? "default" : "outline"} size="sm" onClick={() => setActivePeriod("today")}>
          Today ({counts.today})
        </Button>
        <Button variant={activePeriod === "this_week" ? "default" : "outline"} size="sm" onClick={() => setActivePeriod("this_week")}>
          This week ({counts.week})
        </Button>
        <Button variant={activePeriod === "this_month" ? "default" : "outline"} size="sm" onClick={() => setActivePeriod("this_month")}>
          This month ({counts.month})
        </Button>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-sm text-muted-foreground">No recommended actions for this period.</div>
      ) : (
        filteredCards.map((card, idx) => (
          <div key={card.recordId || idx} className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="text-xs text-muted-foreground">ACTION {idx + 1}</div>
            <div className="font-medium">{card.title}</div>
            <div className="text-sm text-muted-foreground">{card.description}</div>
            {card.whyThisMatters && <div className="text-xs italic text-muted-foreground">{card.whyThisMatters}</div>}
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => handleAction(card.primaryAction, card)}>
                {card.primaryAction}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction(card.secondaryAction, card)}>
                {card.secondaryAction}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
