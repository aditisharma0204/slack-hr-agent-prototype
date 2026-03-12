import type { HrGoalDraft } from "./types";

const ACTION_VERBS = [
  "deliver",
  "ship",
  "launch",
  "build",
  "design",
  "implement",
  "reduce",
  "increase",
  "improve",
  "complete",
  "publish",
  "present",
  "earn",
  "pass",
  "lead",
  "conduct",
  "mentor",
  "coach",
];

function hasMeasurable(text: string) {
  return /\b\d+(\.\d+)?\s*(%|percent|pts|point|points|ms|seconds?|minutes?|hours?|days?|weeks?|bugs?|tickets?|docs?|reviews?|sessions?|score)\b/i.test(
    text
  );
}

function hasTimebound(text: string) {
  return /\b(by|before|until|on)\b\s+([A-Za-z]{3,9}\s+\d{1,2}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}(\/\d{2,4})?|Q[1-4])\b/i.test(
    text
  );
}

function hasSpecific(text: string) {
  const longEnough = text.trim().length >= 18;
  const hasVerb = ACTION_VERBS.some((v) => new RegExp(`\\b${v}\\b`, "i").test(text));
  const hasNounLike = /\b(service|feature|project|goal|certification|customers?|stakeholders?|api|latency|reliability|design doc|migration|coaching|sessions?|team|feedback|training)\b/i.test(
    text
  );
  return longEnough && (hasVerb || hasNounLike);
}

export function smartCoach(draft: HrGoalDraft): {
  isSmart: boolean;
  missing: Array<"specific" | "measurable" | "timebound">;
  questions: string[];
  suggestedRewrite?: string;
} {
  const raw = draft.raw || "";

  const missing: Array<"specific" | "measurable" | "timebound"> = [];
  if (!hasSpecific(raw)) missing.push("specific");
  if (!hasMeasurable(raw)) missing.push("measurable");
  if (!hasTimebound(raw)) missing.push("timebound");

  const questions: string[] = [];
  if (missing.includes("specific")) {
    questions.push("What's the concrete outcome or deliverable you want to achieve (what will exist when you're done)?");
  }
  if (missing.includes("measurable")) {
    questions.push("How will we measure success (a number, threshold, or observable completion criteria)?");
  }
  if (missing.includes("timebound")) {
    questions.push("What target date should we use (e.g., \"by May 15\")?");
  }

  const isSmart = missing.length === 0;
  const suggestedRewrite = isSmart
    ? undefined
    : `Try: "${raw.trim().replace(/\s+/g, " ")} — measured by <metric>, by <date>."`;

  return { isSmart, missing, questions, suggestedRewrite };
}

/**
 * Generates a concrete SMART goal statement from accumulated draft fields.
 * In production this would call an LLM; here we use template logic.
 */
export function generateSmartGoal(draft: HrGoalDraft): string {
  const title = draft.title || draft.raw || "Achieve goal";
  const outcome = draft.outcome || "";
  const metricLabel = draft.metricLabel || draft.metric || "measurable progress";

  const metricTemplates: Record<string, string> = {
    feedback: "achieve an average feedback score of 4/5 from participants",
    sessions: "complete at least 5 structured sessions",
    certification: "earn a relevant certification or complete a formal training program",
  };

  const metricText = metricTemplates[draft.metric || ""] || metricLabel;
  const dateText = draft.targetDate || "Q3 2026";

  const goalParts: string[] = [];

  if (/coach/i.test(title) || /coach/i.test(outcome)) {
    goalParts.push(
      `Conduct at least 5 structured coaching sessions with junior team members`
    );
    if (draft.metric && metricTemplates[draft.metric]) {
      goalParts.push(`and ${metricText}`);
    }
    goalParts.push(`by *${dateText}*`);
  } else if (/lead/i.test(title) || /leadership/i.test(outcome)) {
    goalParts.push(`Lead a cross-functional initiative that ${outcome || "delivers measurable impact"}`);
    goalParts.push(`with ${metricText}`);
    goalParts.push(`by *${dateText}*`);
  } else {
    const verb = outcome
      ? outcome.charAt(0).toUpperCase() + outcome.slice(1)
      : title.charAt(0).toUpperCase() + title.slice(1);
    goalParts.push(verb);
    goalParts.push(`— ${metricText}`);
    goalParts.push(`by *${dateText}*`);
  }

  return goalParts.join(" ");
}

/**
 * Returns 2-3 example SMART goals for the "See examples" button.
 */
export function getGoalExamples(): string[] {
  return [
    "\"Complete AWS Solutions Architect certification and apply learnings to migrate 2 internal services to EKS by June 30.\"",
    "\"Conduct 6 structured coaching sessions with junior engineers, achieving avg feedback score of 4/5, by end of Q3.\"",
    "\"Reduce API p99 latency from 800ms to 400ms across 3 critical endpoints by April 15.\"",
  ];
}

const INAPPROPRIATE_PATTERNS: Array<{ re: RegExp; replacement: string }> = [
  { re: /\bidiot(s)?\b/gi, replacement: "colleague(s)" },
  { re: /\bstupid\b/gi, replacement: "unhelpful" },
  { re: /\b(dumb|clueless)\b/gi, replacement: "misaligned" },
  { re: /\b(sucks|terrible)\b/gi, replacement: "did not meet expectations" },
  { re: /\b(shut up)\b/gi, replacement: "pause the discussion" },
];

export function sanitizeProfessionalTone(text: string): {
  flagged: boolean;
  suggestion?: string;
  notes: string[];
} {
  let suggestion = text;
  const notes: string[] = [];

  for (const { re, replacement } of INAPPROPRIATE_PATTERNS) {
    if (re.test(suggestion)) {
      notes.push(`Replaced language matching \`${re.source}\`.`);
      suggestion = suggestion.replace(re, replacement);
    }
  }

  const flagged = suggestion !== text;
  return flagged ? { flagged, suggestion, notes } : { flagged: false, notes: [] };
}
