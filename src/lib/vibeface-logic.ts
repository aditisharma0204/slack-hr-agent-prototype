/**
 * Vibeface logic ported from freManager.js
 * Verdict, ambition metrics, card horizons, supplemental cards
 */
import { formatCurrency } from "./format";

export interface DemoData {
  seller?: { quota?: number; commission_rate?: number };
  opportunities?: Array<{
    id: string;
    name: string;
    amount?: number;
    stage?: string;
    forecast_category?: string;
    champion?: string;
    champion_status?: string;
    last_touchpoint_days?: number;
  }>;
  meetings_today?: Array<{ account: string; type: string; time: string; opp_id: string; brief_ready?: boolean }>;
  follow_ups_overdue?: number;
  high_intent_leads?: number;
}

export interface ActionCard {
  type: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  whyThisMatters?: string;
  formattedAmount?: string;
  recordId?: string;
  horizon?: string;
}

export function buildScanDataFromDemo(demoData: DemoData | null) {
  const opps = demoData?.opportunities || [];
  const seller = demoData?.seller || { quota: 1000000, commission_rate: 0.07 };
  const quota = seller.quota || 1000000;
  const commissionRate = seller.commission_rate || 0.07;

  let onTrackToCloseValue = 0;
  const commitOpps = opps.filter(
    (o) =>
      o.forecast_category === "Commit" ||
      o.forecast_category === "Best Case" ||
      ["Negotiation", "Proposal"].includes(o.stage || "")
  );
  for (const o of commitOpps) {
    const amt = o.amount || 0;
    const pct = 0.5;
    onTrackToCloseValue += amt * pct;
  }
  if (onTrackToCloseValue === 0 && opps.length > 0) {
    onTrackToCloseValue = quota * 0.4;
  }

  const pipelineValue = opps.reduce((s, o) => s + (o.amount || 0), 0);
  const gap = Math.max(0, quota - onTrackToCloseValue);
  const closingCount = opps.filter((o) => ["Negotiation", "Proposal"].includes(o.stage || "")).length;

  return {
    opportunityCount: opps.length,
    pipelineValue,
    formattedPipelineValue: formatCurrency(pipelineValue),
    closingThisQuarterCount: closingCount,
    closingThisQuarterValue: pipelineValue * 0.4,
    formattedClosingValue: formatCurrency(pipelineValue * 0.4),
    onTrackToCloseValue,
    formattedOnTrackToClose: formatCurrency(onTrackToCloseValue),
    quota,
    gap,
    formattedQuota: formatCurrency(quota),
    formattedGap: formatCurrency(gap),
    commissionAtPace: onTrackToCloseValue * commissionRate,
    commissionAtQuota: quota * commissionRate,
    formattedCommissionAtPace: formatCurrency(onTrackToCloseValue * commissionRate),
    formattedCommissionAtQuota: formatCurrency(quota * commissionRate),
    meetingCount: demoData?.meetings_today?.length ?? 2,
    leadCount: (demoData?.high_intent_leads ?? 4) + opps.length + 9,
    highIntentLeadCount: demoData?.high_intent_leads ?? 4,
    avgDealCycleDays: 34,
    winRatePct: 38,
  };
}

export function buildProposalCardsFromDemo(demoData: DemoData | null): ActionCard[] {
  const cards: ActionCard[] = [];
  const opps = demoData?.opportunities || [];
  const meetings = demoData?.meetings_today || [];

  const riskOpp = opps.find((o) => o.champion_status === "silent" && (o.amount || 0) > 100000);
  if (riskOpp) {
    cards.push({
      type: "risk_deal",
      title: "Deal at risk",
      description: `${riskOpp.name} — ${formatCurrency(riskOpp.amount)} — no touchpoint in ${riskOpp.last_touchpoint_days} days. Champion may have gone quiet.`,
      primaryAction: "Review",
      secondaryAction: "Dismiss",
      formattedAmount: formatCurrency(riskOpp.amount),
      whyThisMatters: "Re-engaging now could salvage this deal — critical for closing your gap.",
      recordId: riskOpp.id,
    });
  }

  const prepMeeting = meetings.find((m) => m.brief_ready);
  if (prepMeeting) {
    cards.push({
      type: "meeting_prep",
      title: "Meeting prep available",
      description: `${prepMeeting.type} with ${prepMeeting.account} at ${prepMeeting.time} — want me to prep talking points?`,
      primaryAction: "Yes, prep it",
      secondaryAction: "I'll handle it",
      whyThisMatters: "Prepared calls convert 2x better. This helps you stay on track to quota.",
      recordId: `meeting_${prepMeeting.opp_id}`,
    });
  }

  const staleOpp = opps.find((o) => (o.last_touchpoint_days ?? 0) >= 8 && o.champion_status !== "silent");
  if (staleOpp) {
    cards.push({
      type: "follow_up",
      title: "Follow-up needed",
      description: `${staleOpp.champion} at ${staleOpp.name} — ${formatCurrency(staleOpp.amount)}. No activity in ${staleOpp.last_touchpoint_days} days. I drafted a follow-up.`,
      primaryAction: "Review draft",
      secondaryAction: "Dismiss",
      formattedAmount: formatCurrency(staleOpp.amount),
      whyThisMatters: "Re-engaging keeps momentum. Deals that go cold lose 30% of their close rate.",
      recordId: staleOpp.id,
    });
  }

  if ((demoData?.follow_ups_overdue ?? 0) > 0) {
    cards.push({
      type: "overdue_followup",
      title: "Overdue follow-up",
      description: `${demoData!.follow_ups_overdue} follow-ups overdue; oldest 9 days. I can draft a batch so you stay on top.`,
      primaryAction: "Draft batch",
      secondaryAction: "Later",
      whyThisMatters: "Staying on top of follow-ups keeps deals moving.",
      recordId: "overdue_batch",
    });
  }

  return cards;
}

export function assignCardHorizons(cards: ActionCard[]): ActionCard[] {
  return cards.map((card) => {
    let horizon = card.horizon;
    if (!horizon) {
      if (["meeting_prep", "risk_deal", "overdue_followup"].includes(card.type)) horizon = "today";
      else if (["follow_up", "stage_update", "high_intent_lead"].includes(card.type)) horizon = "this_week";
      else horizon = "this_month";
    }
    return { ...card, horizon };
  });
}

export function getSupplementalCards(cards: ActionCard[], targetDays = 45): ActionCard[] {
  const existing = cards || [];
  const todayCount = existing.filter((c) => c.horizon === "today").length;
  const weekCount = existing.filter((c) => c.horizon === "this_week").length;
  const monthCount = existing.filter((c) => c.horizon === "this_month").length;
  const t = Math.max(14, Math.min(60, targetDays));
  const f = (t - 14) / 46;
  const TARGET = {
    today: Math.round(5 - f * 2),
    week: Math.round(10 - f * 4),
    month: Math.round(10 - f * 2),
  };
  const supplemental: ActionCard[] = [];
  const whyBase = "Prioritizing helps you stay on track to quota.";
  const todayTemplates: Partial<ActionCard>[] = [
    {
      type: "meeting_prep",
      title: "Meeting prep available",
      description: "Kickoff call with Acme Corp — want a brief before you jump on?",
      primaryAction: "Yes, prep it",
      secondaryAction: "I'll handle it",
      whyThisMatters: "Prepared calls convert 2x better.",
    },
    {
      type: "stage_update",
      title: "Deal stage may need updating",
      description: "Enterprise deal at FinServe — recent demos suggest it moved to Negotiation.",
      primaryAction: "Approve",
      secondaryAction: "Not yet",
      whyThisMatters: "Accurate stages = accurate forecast.",
    },
  ];
  const weekTemplates: Partial<ActionCard>[] = [
    {
      type: "follow_up",
      title: "Accelerate to close",
      description: "Midwest Retail — $120K in Proposal. Closing this could cover 12% of your gap.",
      primaryAction: "Review",
      secondaryAction: "Dismiss",
      formattedAmount: "$120K",
      whyThisMatters: "This deal is 12% of your remaining gap.",
    },
    {
      type: "high_intent_lead",
      title: "High-intent lead",
      description: "VP Engineering at ScaleUp clicked pricing 3x this week. Ready for outreach?",
      primaryAction: "Reach out",
      secondaryAction: "Later",
      whyThisMatters: "High-intent leads convert 3x faster.",
    },
  ];
  const monthTemplates: Partial<ActionCard>[] = [
    {
      type: "follow_up",
      title: "Pipeline nurture",
      description: "5 prospects in early stage. I can draft a nurture sequence to keep them warm.",
      primaryAction: "Draft sequence",
      secondaryAction: "Later",
      whyThisMatters: "Nurture sequences keep pipeline moving.",
    },
  ];
  let idx = 0;
  for (let i = 0; i < TARGET.today - todayCount && i < todayTemplates.length; i++) {
    supplemental.push({ ...todayTemplates[i], horizon: "today", recordId: "supplemental-" + idx++ } as ActionCard);
  }
  for (let i = 0; i < TARGET.week - weekCount && i < weekTemplates.length; i++) {
    supplemental.push({ ...weekTemplates[i], horizon: "this_week", recordId: "supplemental-" + idx++ } as ActionCard);
  }
  for (let i = 0; i < TARGET.month - monthCount && i < monthTemplates.length; i++) {
    supplemental.push({ ...monthTemplates[i], horizon: "this_month", recordId: "supplemental-" + idx++ } as ActionCard);
  }
  return supplemental;
}

export function getExtraWorkNeededCards(
  scanData: Record<string, unknown>,
  ambitionMetrics: { meetingsNeeded: number; pipelineNeeded: number; formattedMeetingsNeeded: string; commissionAtQuota: string } | null,
  targetDays: number
): ActionCard[] {
  if (targetDays > 45 || !ambitionMetrics) return [];
  const cards: ActionCard[] = [];
  const pipelineShortfall =
    scanData?.pipelineValue != null && scanData?.gap != null
      ? Math.max(0, ambitionMetrics.pipelineNeeded - (scanData.pipelineValue as number) || 0)
      : ambitionMetrics.pipelineNeeded;
  if (ambitionMetrics.meetingsNeeded > 0) {
    cards.push({
      type: "work_needed",
      horizon: "this_month",
      title: "Add more meetings to accelerate",
      description: `To close your gap in ${targetDays} days, you need roughly ${ambitionMetrics.formattedMeetingsNeeded} more meetings this period.`,
      whyThisMatters: `Each meeting moves pipeline toward close. At quota you'd earn ${ambitionMetrics.commissionAtQuota} in commission.`,
      primaryAction: "Got it",
      secondaryAction: "Dismiss",
    });
  }
  if (ambitionMetrics.pipelineNeeded > 0) {
    cards.push({
      type: "work_needed",
      horizon: "this_month",
      title: "Pipeline needs more coverage",
      description: `To close your gap in ${targetDays} days, you need about ${formatCurrency(pipelineShortfall)} more in qualified pipeline.`,
      whyThisMatters: `More pipeline = more deals moving to close. Commission at quota: ${ambitionMetrics.commissionAtQuota}.`,
      primaryAction: "Got it",
      secondaryAction: "Dismiss",
    });
  }
  return cards.slice(0, 2);
}

export function computeAmbitionMetrics(scanData: Record<string, unknown>, targetDays: number) {
  const d = scanData || {};
  const gap = (typeof d.gap === "number" ? d.gap : Number(d.gap) || 0) as number;
  const quota = (typeof d.quota === "number" ? d.quota : Number(d.quota) || 1000000) as number;
  const winRatePct = (d.winRatePct as number) ?? 38;
  const pipelineValue = (d.pipelineValue as number) ?? 0;
  const oppCount = Math.max(1, (d.opportunityCount as number) ?? 1);
  const avgDealCycleDays = (d.avgDealCycleDays as number) ?? 34;
  const meetingCount = (d.meetingCount as number) ?? 0;
  const winRate = winRatePct / 100;
  const pipelineNeeded =
    targetDays > 0 && winRate > 0
      ? (gap * avgDealCycleDays) / (targetDays * winRate)
      : winRate > 0
        ? gap / winRate
        : gap;
  const avgDealSize = pipelineValue > 0 ? pipelineValue / oppCount : 150000;
  const meetingsPerDeal = Math.max(4, Math.ceil(avgDealCycleDays / 7));
  const dealsNeeded = avgDealSize > 0 ? Math.ceil(pipelineNeeded / avgDealSize) : Math.ceil(pipelineNeeded / 150000);
  const meetingsInPeriod = Math.ceil(dealsNeeded * meetingsPerDeal);
  const weeksInTarget = Math.max(0.5, targetDays / 7);
  const meetingsPerWeekRequired = Math.ceil(meetingsInPeriod / weeksInTarget);
  const meetingsNeeded = Math.max(0, meetingsPerWeekRequired - meetingCount);

  return {
    pipelineNeeded,
    meetingsNeeded,
    meetingsPerWeekRequired,
    formattedPipelineNeeded: formatCurrency(pipelineNeeded),
    formattedMeetingsNeeded: String(Math.max(0, meetingsNeeded)),
    formattedMeetingsPerWeek: String(meetingsPerWeekRequired),
    commissionAtQuota: formatCurrency(quota * 0.07),
  };
}

export function getDayZeroVerdict(
  options: { numberBlock?: string | null; cardsCount?: number },
  scanData: Record<string, unknown>
) {
  const { numberBlock, cardsCount = 0 } = options || {};
  const onTrackNum = (scanData?.onTrackToCloseValue as number) ?? 0;
  const quota = (scanData?.quota as number) ?? 1000000;
  const quotaNum = typeof quota === "number" ? quota : Number(quota) || 1000000;
  const onTrackVal = typeof onTrackNum === "number" ? onTrackNum : Number(onTrackNum) || 0;
  const pacePct = quotaNum > 0 ? Math.round((onTrackVal / quotaNum) * 100) : 0;
  const commissionAtPace = (scanData?.formattedCommissionAtPace as string) ?? "$0";
  const commissionAtQuota = (scanData?.formattedCommissionAtQuota as string) ?? "$0";
  const hasCommission = commissionAtPace !== "$0" || commissionAtQuota !== "$0";
  const commissionLine = hasCommission
    ? `Estimated commission at current pace: ${commissionAtPace} | At quota: ${commissionAtQuota}`
    : "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const quarterEndMonth = month < 3 ? 2 : month < 6 ? 5 : month < 9 ? 8 : 11;
  const quarterEnd = new Date(year, quarterEndMonth + 1, 0);
  const daysLeft = Math.max(0, Math.ceil((quarterEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const weeksLeft = Math.max(0, Math.ceil(daysLeft / 7));
  const dealsNeedingAction = Math.min(cardsCount, 2);

  let healthSentence: string;
  let healthStatus = "at_risk";
  if (pacePct >= 100) {
    healthStatus = "ok";
    healthSentence = `You're above quota pace with ${weeksLeft} weeks left.${dealsNeedingAction > 0 ? ` ${dealsNeedingAction} deal${dealsNeedingAction > 1 ? "s" : ""} need your attention today.` : ""}`;
  } else if (pacePct >= 70) {
    healthStatus = "at_risk";
    healthSentence = `You're at ${pacePct}% of quota pace with ${weeksLeft} weeks left. You have pipe to close the gap — but ${dealsNeedingAction} deal${dealsNeedingAction !== 1 ? "s" : ""} need you today.`;
  } else {
    healthStatus = "trouble";
    healthSentence = `You're at ${pacePct}% of quota pace with ${weeksLeft} weeks left. You need to activate new pipeline or accelerate existing deals.${dealsNeedingAction > 0 ? ` ${dealsNeedingAction} deal${dealsNeedingAction > 1 ? "s" : ""} need you today.` : ""}`;
  }

  const numberBlockRes =
    numberBlock ||
    `${(scanData?.formattedOnTrackToClose as string) ?? "$0"} on track to close | Quota: ${(scanData?.formattedQuota as string) ?? "$1.0M"} | Gap: ${(scanData?.formattedGap as string) ?? "$0"}`;

  return {
    numberBlock: numberBlockRes,
    commissionLine,
    healthSentence,
    healthStatus,
    quotaDisplay: (scanData?.formattedQuota as string) ?? "$1.0M",
  };
}
