"use client";

import type { HrIntent, HrWorkflowKind } from "./types";

export function detectIntent(text: string): HrIntent {
  const t = text.toLowerCase();

  // Goals — explicit
  if (/\b(create|add|set|write)\b.*\bgoal\b/.test(t) || /\bnew goal\b/.test(t) || /\bcareer goal\b/.test(t)) {
    return { type: "goalCreate" };
  }
  // Goals — vague aspirational statements that imply a goal
  if (/\bi want to (improve|get better|develop|learn|grow|become|build|strengthen|enhance)\b/.test(t)) {
    return { type: "goalCreate" };
  }
  if (/\bi('d| would) like to (improve|develop|learn|grow|become|build|work on)\b/.test(t)) {
    return { type: "goalCreate" };
  }
  if (/\bhelp me (improve|develop|set|create|build|work on)\b/.test(t)) {
    return { type: "goalCreate" };
  }
  if (/\b(show|view|list)\b.*\bgoals?\b/.test(t) || /\bmy goals?\b/.test(t)) {
    return { type: "goalView" };
  }

  // Performance summary
  if (
    /\b(performance|progress|where do i stand|summary)\b/.test(t) ||
    /\b(on track|behind)\b/.test(t)
  ) {
    return { type: "performanceSummary" };
  }

  // Self-review / appraisal
  if (/\b(self[\s-]?review|appraisal|review writeup)\b/.test(t)) {
    return { type: "selfReview" };
  }

  // Promotion / transfer
  if (/\b(promotion|promote|level up|eligible|ready for promotion)\b/.test(t) || /\btransfer\b/.test(t)) {
    return { type: "promoTransfer" };
  }
  if (/\bam i (eligible|ready)\b/.test(t)) {
    return { type: "promoTransfer" };
  }

  // Policy
  if (/\b(policy|guideline|rules?|faq)\b/.test(t)) {
    return { type: "policyQa" };
  }

  return { type: "unknown" };
}

export function intentToWorkflowKind(intent: HrIntent): HrWorkflowKind {
  switch (intent.type) {
    case "goalCreate":
      return "goalCreate";
    case "goalView":
    case "performanceSummary":
      return "goalView";
    case "selfReview":
      return "selfReview";
    case "promoTransfer":
      return "promoTransfer";
    case "policyQa":
      return "policyQa";
    case "unknown":
    default:
      return "idle";
  }
}

