"use client";

import Image from "next/image";
import { IconHome, IconPencil, IconSearch, IconLightbulb } from "@/components/icons";
import { DEMO_USER_NAME, useDemoData } from "@/context/DemoDataContext";

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export function SlackbotProactiveTab() {
  const { demoData } = useDemoData();
  const data = demoData as Record<string, unknown> | null;

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-[#616061]">
        Loading...
      </div>
    );
  }
  const seller = (data?.seller as Record<string, unknown>) || {};
  const state = (data?.state as Record<string, unknown>) || {};
  const focusBlock = (data?.focus_block as Record<string, unknown>) || {};
  const opportunities = (data?.opportunities as Array<Record<string, unknown>>) || [];

  const quota = (seller.quota as number) || 500000;
  const onTrack = (state.on_track as number) ?? 410000;
  const needsYou = (state.needs_you as number) ?? 90000;
  const daysToClose = (state.days_to_close as number) ?? 48;
  const commissionAtPace = (state.commission_at_pace as number) ?? 14000;
  const commissionAtQuota = (state.commission_at_quota as number) ?? 35000;
  const quotaPacePct = (state.quota_pace_pct as number) ?? 20;
  const weeksLeft = (state.weeks_left as number) ?? 7;
  const actionsCount = (focusBlock.actions_count as number) ?? 20;
  const quotaDisplay = (focusBlock.quota_display as string) ?? "$1.0M";

  const focusCards = (focusBlock.cards as Array<Record<string, unknown>>) ?? [
    {
      title: "Budget objection raised",
      account: "Runners Club",
      deal: "Summer Collection",
      amount: 720000,
      stage: "Closed Won → reopened",
      signal: "CFO joined last call, asked about ROI",
      recommendation: "Send value justification deck. Draft ready for review.",
    },
    {
      title: "Champion silent (14 days)",
      account: "Sporty Nation",
      deal: "Back to School Promo",
      amount: 270000,
      stage: "Closed Lost",
      signal: "Proposal viewed 14x, no reply",
      recommendation: "Find alternate stakeholder.",
    },
  ];

  const onTrackDeals = opportunities.filter(
    (o) => o.champion_status === "active" || o.champion_status === "warm"
  ).length;

  return (
    <div className="w-full">
      {/* Welcome Section */}
      <div className="flex flex-col items-center text-center py-6 px-4">
        <div className="w-16 h-16 mb-3">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={64} height={64} />
        </div>
        <h2 className="text-lg font-bold text-[#1d1c1d] mb-2">
          Good morning, {DEMO_USER_NAME}!
        </h2>
        <p className="text-sm text-[#616061] mb-6">
          Here's where you stand.
        </p>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-2 w-full mb-6">
          <div className="bg-[#f8f8f8] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#1d1c1d]">{formatCurrency(quota)}</div>
            <div className="text-xs font-semibold text-[#1d1c1d] mt-1">Quota</div>
            <div className="text-xs text-[#616061] mt-1">{daysToClose} days to closing Q3</div>
          </div>

          <div className="bg-[#e0f5f0] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#1d1c1d]">{formatCurrency(onTrack)}</div>
            <div className="text-xs font-semibold text-[#1d1c1d] mt-1">On track to close</div>
            <div className="text-xs text-[#616061] mt-1">{onTrackDeals} Active Deals</div>
          </div>

          <div className="bg-[#fce8ee] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#1d1c1d]">{formatCurrency(needsYou)}</div>
            <div className="text-xs font-semibold text-[#1d1c1d] mt-1">Gap</div>
            <div className="text-xs text-[#616061] mt-1">Needs Attention</div>
          </div>
        </div>

        {/* Commission Text */}
        <div className="text-center mb-4 w-full">
          <p className="text-sm font-bold text-[#1d1c1d]">
            Estimated commission at current pace: {formatCurrency(commissionAtPace)} | At Quota: {formatCurrency(commissionAtQuota)}
          </p>
          <p className="text-xs text-[#616061] mt-2">
            You're at {quotaPacePct}% of quota pace with {weeksLeft} weeks left. You need to activate new pipeline or
            accelerate existing deals. 2 deals need you today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconHome width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Discover</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconPencil width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Create</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconSearch width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Find</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconLightbulb width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Brainstorm</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e8e8e8] mx-4" />

      {/* Focus Block Section */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#e8d4f5] text-[#6b2e9d] text-xs font-semibold px-2 py-1 rounded">
            Focus block
          </span>
          <span className="text-xs text-[#616061]">{actionsCount} actions toward your {quotaDisplay}</span>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-[#1d1c1d] mb-2">Meet Quota by</div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#616061]">
            <div className="h-1 w-24 bg-[#7c3eb1] rounded-full shrink-0" />
            <span className="font-semibold">{daysToClose} days</span>
            <span>{(state.pipeline_value as number)?.toLocaleString() ?? "1,559,954"} pipeline</span>
            <span>|</span>
            <span>{(state.meetings_per_week as number) ?? 5} meetings/week</span>
            <span>|</span>
            <span>${((state.daily_pace as number) ?? 17435).toLocaleString()}/day pace</span>
            <span>|</span>
            <span className="font-semibold">{formatCurrency(commissionAtQuota)} at quota</span>
          </div>
        </div>

        {/* Deal Cards - from focus_block */}
        <div className="space-y-3">
          {focusCards.map((card, idx) => {
            const rec = (card.recommendation as string) || "";
            const actionText = rec.startsWith("Send") ? "✨ Send value justification deck" : rec.startsWith("Find") ? "✨ Find alternate stakeholder" : rec.startsWith("Draft") ? "✨ Draft battle card response" : `✨ ${rec}`;
            return (
              <div key={idx} className="border border-[#e8e8e8] rounded-lg p-3 bg-white">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1d1c1d] mb-1">
                      {card.title as string}
                    </div>
                    <div className="text-xs text-[#616061] mb-1">
                      {card.account as string} — {formatCurrency((card.amount as number) || 0)} • Stage: {card.stage as string}
                    </div>
                    <div className="text-xs text-[#616061] mb-3">
                      Signal: {card.signal as string}
                    </div>
                    <button className="text-xs font-medium text-[#1264a3] hover:underline border border-[#1264a3] rounded px-3 py-1.5">
                      {actionText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Autonomous deals - gear cards */}
        {(data?.autonomous_deals as Array<Record<string, unknown>>)?.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-[#1d1c1d] mb-2">Vibeface working autonomously</div>
            <div className="space-y-2">
              {(data.autonomous_deals as Array<Record<string, unknown>>).map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#616061] border border-[#e8e8e8] rounded-lg p-2 bg-[#f8f8f8]">
                  <span className="text-base">⚙️</span>
                  <span className="font-medium text-[#1d1c1d]">{String(d.account ?? "")} ({formatCurrency((d.amount as number) || 0)})</span>
                  <span>—</span>
                  <span>{d.action as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
