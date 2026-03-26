"use client";

import type { CsIntent } from "./types";

export function detectCsIntent(text: string): CsIntent {
  const t = text.toLowerCase();

  // Career discovery
  if (/\b(explore|browse|find|discover|search)\b.*\b(roles?|opportunities|positions?|jobs?|career)\b/.test(t)) {
    return { type: "careerDiscovery" };
  }
  if (/\binternal (roles?|opportunities|positions?)\b/.test(t)) {
    return { type: "careerDiscovery" };
  }
  if (/\bwhat roles?\b/.test(t) || /\bcareer (opportunities|options|paths?)\b/.test(t)) {
    return { type: "careerDiscovery" };
  }

  // Skill gap / readiness
  if (/\bhow ready\b/.test(t) || /\breadiness\b/.test(t)) {
    const roleMatch = t.match(/(?:for|as)\s+(?:a\s+)?(.+?)(?:\s+role)?$/);
    return { type: "skillGap", role: roleMatch?.[1]?.trim() };
  }
  if (/\bskill\s*gaps?\b/.test(t) || /\bcheck\s+(?:my\s+)?readiness\b/.test(t)) {
    return { type: "skillGap" };
  }
  if (/\bready for\b/.test(t) && !/\bpromotion\b/.test(t)) {
    const roleMatch = t.match(/ready for\s+(?:a\s+)?(.+?)$/);
    return { type: "skillGap", role: roleMatch?.[1]?.trim() };
  }

  // Mentorship / help improving
  if (/\b(help|improve|improving|better at|struggle|struggling)\b.*\b(time management|communication|leadership|delegation|prioriti[sz]|focus|productivity)\b/.test(t)) {
    const skillMatch = t.match(/(?:help|improve|improving|better at|struggle|struggling)\s+(?:with\s+)?(?:my\s+)?(.+?)$/);
    return { type: "mentorship", skill: skillMatch?.[1]?.trim() };
  }
  if (/\bfind\s+(?:a\s+)?mentor\b/.test(t) || /\bneed\s+(?:a\s+)?mentor\b/.test(t)) {
    return { type: "mentorship" };
  }
  if (/\bi need help\b/.test(t)) {
    const skillMatch = t.match(/i need help\s+(?:with\s+)?(?:improving\s+)?(.+?)$/);
    return { type: "mentorship", skill: skillMatch?.[1]?.trim() };
  }

  return { type: "unknown" };
}
