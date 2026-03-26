"use client";

import { assetPath } from "@/lib/asset-path";
import {
  createGoal,
  createRequest,
  getActiveCycle,
  getEmployeeProfile,
  getPerformanceSnapshot,
  getPromotionTransferEligibility,
  listCompletedGoals,
  listGoals,
  submitSelfReview,
} from "@/lib/hr/mockHrData";
import { searchPolicyKb } from "@/lib/hr/policyKb";
import { detectIntent } from "./router";
import { sanitizeProfessionalTone, generateSmartGoal, getGoalExamples } from "./mockAi";
import type {
  HrChatMessage,
  HrGoalDraft,
  HrIntent,
  HrWorkflow,
  HrWorkflowKind,
  HrWorkflowSession,
  PendingAction,
} from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AGENT_NAME = "Employee Performance Management Agent";

function botMsg(text: string): HrChatMessage {
  return {
    id: makeId("b"),
    name: AGENT_NAME,
    avatar: assetPath("/slackbot-logo.svg"),
    time: "Just now",
    isBot: true,
    text,
  };
}

function userMsg(text: string): HrChatMessage {
  return {
    id: makeId("u"),
    name: "You",
    avatar: "https://randomuser.me/api/portraits/med/women/75.jpg",
    time: "Just now",
    isBot: false,
    text,
  };
}

function idleWf(): HrWorkflow {
  return { id: makeId("wf"), kind: "idle", step: "start", draft: {} };
}

function newWf(kind: HrWorkflowKind): HrWorkflow {
  return { id: makeId("wf"), kind, step: "start", draft: {} };
}

function fmtOptions(options: PendingAction[]): string {
  return options.map((o, i) => `${i + 1}. ${o.label}`).join("\n");
}

function progressBar(pct: number): string {
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty) + ` ${pct}%`;
}

function riskLabel(pct: number, status: string): string {
  if (status === "completed") return "\u2705 Completed";
  if (pct >= 70) return "\u2705 On track";
  if (pct >= 40) return "\u26a0\ufe0f Behind";
  return "\ud83d\udd34 At risk";
}

// ─── Turn Result ────────────────────────────────────────────────────────────

type TurnResult = { next: HrWorkflowSession; emitted: HrChatMessage[] };

function result(session: HrWorkflowSession, wf: HrWorkflow, msgs: HrChatMessage[]): TurnResult {
  return {
    next: { ...session, phase: "active", composerText: "", activeWorkflow: wf, messages: [...session.messages, ...msgs] },
    emitted: [],
  };
}

// ─── Number Resolution ──────────────────────────────────────────────────────

function resolveNumberedInput(text: string, pending?: PendingAction[]): PendingAction | null {
  if (!pending || pending.length === 0) return null;
  const n = parseInt(text.trim(), 10);
  if (!isNaN(n) && n >= 1 && n <= pending.length) return pending[n - 1];
  const lower = text.trim().toLowerCase();
  return pending.find((p) => p.label.toLowerCase() === lower) ?? null;
}

// ─── Data Formatters (plain text, no blocks) ────────────────────────────────

function perfSummaryText(): string {
  const cycle = getActiveCycle();
  const goals = listGoals(cycle.id);
  const snap = getPerformanceSnapshot(cycle.id);

  const header = `\ud83d\udcca *Your Goal Progress — ${cycle.label}*\n${snap.goalsCompleted} of ${snap.goalsTotal} goals completed.\n`;
  const goalLines = goals.map((g) => {
    const risk = riskLabel(g.progressPct, g.status);
    return `\u2022 *${g.title}*\n  ${progressBar(g.progressPct)} \u00b7 ${risk} \u00b7 Target: ${g.targetDate}`;
  }).join("\n\n");

  return `${header}\n${goalLines}`;
}

function perfDetailText(): string {
  const cycle = getActiveCycle();
  const goals = listGoals(cycle.id);
  return goals.map((g) => {
    const statusIcon = g.status === "completed" ? "\u2705" : g.status === "in_progress" ? "\ud83d\udd04" : "\u2b1c";
    return `*${g.title}*\n\u2022 Status: ${statusIcon} ${g.status.replace("_", " ")}\n\u2022 Progress: ${progressBar(g.progressPct)}\n\u2022 Success Metric: ${g.successMetric}\n\u2022 Target: ${g.targetDate}`;
  }).join("\n\n---\n\n");
}

function readinessText(): string {
  const profile = getEmployeeProfile();
  const cycle = getActiveCycle();
  const goals = listGoals(cycle.id);
  const completed = goals.filter((g) => g.status === "completed").length;
  const total = goals.length;

  const checks = [
    { label: "Goal completion", passed: total > 0 && completed / total >= 0.5, detail: `${completed}/${total} goals` },
    { label: "Performance rating", passed: profile.performanceRating >= 4, detail: `${profile.performanceRating}/5` },
    { label: "Time in role", passed: profile.timeInRoleMonths >= 18, detail: `${profile.timeInRoleMonths} months` },
    { label: "Skill readiness", passed: false, detail: "Cross-team leadership needed" },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  const checkLines = checks.map((c) => `${c.passed ? "\u2705" : "\u2b1c"} *${c.label}* \u2014 ${c.detail}`).join("\n");
  const insights = [];
  if (total > 0) insights.push(`You completed ${completed}/${total} goals`);
  insights.push("You need stronger cross-team leadership evidence");

  return `\ud83e\udded *Promotion Readiness Score: ${score}%*\n\n${checkLines}\n\n*Insights*\n${insights.map((i) => `\u2022 ${i}`).join("\n")}`;
}

// ─── Main Engine ────────────────────────────────────────────────────────────

export function hrReduceTurn(session: HrWorkflowSession, text: string): TurnResult {
  const trimmed = text.trim();
  if (!trimmed) return { next: session, emitted: [] };

  const cmd = trimmed.toLowerCase();
  const um = userMsg(trimmed);
  const wf = session.activeWorkflow;

  // ─── Global cancel ────────────────────────────────────────────────
  if (cmd === "cancel") {
    return result(session, idleWf(), [um, botMsg("Okay \u2014 cancelled. What would you like to do next?")]);
  }

  // ─── Resolve numbered input against pending actions ───────────────
  const picked = resolveNumberedInput(trimmed, wf.pendingActions);
  if (picked) {
    const ack = um;
    const key = picked.key;

    // ── Goal Create actions ─────────────────────────────────────────
    if (wf.kind === "goalCreate") {
      if (key === "goal_start_refine") {
        const nextWf: HrWorkflow = { ...wf, step: "goal_refine_outcome", pendingActions: undefined };
        return result(session, nextWf, [ack, botMsg("Got it \u2014 let's refine your goal.\n\nWhat outcome would success look like?\n\n_Examples: \"Become better at coaching junior team members\" or \"Get certified in cloud architecture\"_")]);
      }
      if (key === "goal_see_examples") {
        const examples = getGoalExamples();
        const exText = examples.map((ex, i) => `${i + 1}. ${ex}`).join("\n\n");
        const opts: PendingAction[] = [
          { key: "goal_start_refine", label: "Start refining my goal" },
          { key: "goal_not_now", label: "Not now" },
        ];
        const nextWf: HrWorkflow = { ...wf, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`Here are some well-crafted SMART goals for inspiration:\n\n${exText}\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "goal_not_now" || key === "goal_cancel") {
        return result(session, idleWf(), [ack, botMsg("No problem \u2014 whenever you're ready, just say \"create a goal\" and we'll pick it up. \ud83d\udc4b")]);
      }
      if (key === "goal_metric_feedback" || key === "goal_metric_sessions" || key === "goal_metric_cert") {
        const metricMap: Record<string, { k: string; l: string }> = {
          goal_metric_feedback: { k: "feedback", l: "Feedback from team" },
          goal_metric_sessions: { k: "sessions", l: "Completion of coaching sessions" },
          goal_metric_cert: { k: "certification", l: "Certification / training" },
        };
        const m = metricMap[key];
        const draft: HrGoalDraft = { ...(wf.draft.goal || { raw: "" }), metric: m.k, metricLabel: m.l };
        const smart = generateSmartGoal(draft);
        draft.smartGoal = smart;
        const opts: PendingAction[] = [
          { key: "goal_accept", label: "Accept goal" },
          { key: "goal_edit", label: "Edit" },
          { key: "goal_refine_more", label: "Refine more" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "goal_draft_review", draft: { ...wf.draft, goal: draft }, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`Got it \u2014 ${m.l.toLowerCase()}.\n\n\u2b50 *Suggested Goal*\n\n\"${smart}\"\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "goal_metric_custom") {
        const nextWf: HrWorkflow = { ...wf, step: "goal_refine_metric", pendingActions: undefined, meta: { ...wf.meta, awaitingCustomMetric: true } };
        return result(session, nextWf, [ack, botMsg("Got it \u2014 custom metric.\n\nDescribe how you'd like to measure success in your own words.")]);
      }
      if (key === "goal_accept") {
        const smart = wf.draft.goal?.smartGoal || "Your goal";
        const opts: PendingAction[] = [
          { key: "goal_submit", label: "Submit" },
          { key: "goal_save_draft", label: "Save draft" },
          { key: "goal_cancel", label: "Cancel" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "goal_submit_confirm", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`Great \u2014 ready to submit this goal to your performance plan?\n\n\"${smart}\"\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "goal_edit") {
        const nextWf: HrWorkflow = { ...wf, step: "goal_refine_outcome", pendingActions: undefined };
        return result(session, nextWf, [ack, botMsg("Sure \u2014 tell me the updated outcome you'd like, and I'll rebuild the goal.")]);
      }
      if (key === "goal_refine_more") {
        const nextWf: HrWorkflow = { ...wf, step: "goal_refine_outcome", pendingActions: undefined };
        return result(session, nextWf, [ack, botMsg("What outcome would success look like?")]);
      }
      if (key === "goal_submit") {
        const draft = wf.draft.goal;
        const cycle = getActiveCycle();
        createGoal({
          cycleId: cycle.id,
          title: draft?.smartGoal || draft?.title || "Goal",
          successMetric: draft?.metricLabel || draft?.successMetric || "See goal description",
          targetDate: draft?.targetDate || "Q3 2026",
        });
        return result(session, idleWf(), [ack, botMsg("\ud83c\udfaf Nice work! Your goal has been submitted to your performance plan.\n\nI'll check in every 2 weeks to help you track progress. What else can I help with?")]);
      }
      if (key === "goal_save_draft") {
        return result(session, idleWf(), [ack, botMsg("\ud83d\udcdd Draft saved! You can resume anytime by saying \"create a goal\".\n\nWhat else can I help with?")]);
      }
    }

    // ── Performance Summary actions ─────────────────────────────────
    if (wf.kind === "goalView") {
      if (key === "perf_view_details") {
        const opts: PendingAction[] = [
          { key: "perf_back_dashboard", label: "Back to summary" },
        ];
        const nextWf: HrWorkflow = { ...wf, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`Got it \u2014 here are the full details:\n\n${perfDetailText()}\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "perf_update_progress") {
        const nextWf: HrWorkflow = { ...wf, pendingActions: undefined };
        return result(session, nextWf, [ack, botMsg("Which goal would you like to update? Type the goal name or number:\n\n1. Earn AWS Solutions Architect Associate certification\n2. Improve API latency for Employee Goals service\n3. Deliver self-serve goal creation UX improvements")]);
      }
      if (key === "perf_get_suggestions") {
        const snap = getPerformanceSnapshot();
        const behind = snap.goalsBehind[0];
        const intro = behind
          ? `You're slightly behind on *${behind.title}* (~${behind.behindByPct}% behind expected pace). Let me help you plan next steps.`
          : "You're on track across your goals! Here are some ways to keep the momentum going:";
        const opts: PendingAction[] = [
          { key: "perf_find_learning", label: "Find learning resources" },
          { key: "perf_find_mentor", label: "Find a mentor" },
          { key: "perf_schedule_coaching", label: "Schedule coaching session" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "perf_suggestions", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${intro}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "perf_find_learning") {
        const opts: PendingAction[] = [
          { key: "perf_enroll_workshop", label: "Enroll in Radical Candor Workshop" },
          { key: "perf_back_dashboard", label: "Back to summary" },
        ];
        const nextWf: HrWorkflow = { ...wf, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg("Here are some recommended resources:\n\n1. *Coaching for Performance* \u2014 Sir John Whitmore (book)\n   _The foundational text on GROW model coaching_\n\n2. *Radical Candor Workshop* \u2014 internal L&D (2-day)\n   _Next session: April 10\u201311_\n\n3. *Coaching Skills for Managers* \u2014 LinkedIn Learning (4h)\n   _Self-paced, covers active listening and feedback frameworks_\n\n" + fmtOptions(opts))]);
      }
      if (key === "perf_find_mentor") {
        const opts: PendingAction[] = [
          { key: "perf_request_intro", label: "Request intro" },
          { key: "perf_save_mentor", label: "Save for later" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "perf_mentor_card", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg("\u2b50 *Suggested Mentor*\n\n*Priya Sharma* \u2014 Engineering Manager\nMentored 12 employees in coaching skill development.\n\n_\"I focus on structured feedback loops and pair-coaching to build lasting habits.\"_\n\n" + fmtOptions(opts))]);
      }
      if (key === "perf_schedule_coaching") {
        return result(session, idleWf(), [ack, botMsg("\ud83d\udcc5 I've found 3 open slots with your manager *Sarah Chen*:\n\n\u2022 Tuesday, Mar 17 at 2:00 PM\n\u2022 Wednesday, Mar 18 at 10:30 AM\n\u2022 Friday, Mar 20 at 4:00 PM\n\nI'll send a calendar invite for Tuesday. What else can I help with?")]);
      }
      if (key === "perf_request_intro") {
        return result(session, idleWf(), [ack, botMsg("\u2709\ufe0f Done! I've sent an introduction request to *Priya Sharma*. She typically responds within 1\u20132 business days.\n\nAnything else I can help with?")]);
      }
      if (key === "perf_save_mentor") {
        return result(session, idleWf(), [ack, botMsg("\u2b50 Saved *Priya Sharma* to your mentor shortlist.\n\nAnything else?")]);
      }
      if (key === "perf_enroll_workshop") {
        return result(session, idleWf(), [ack, botMsg("\ud83d\udcc5 You're enrolled in the *Radical Candor Workshop* (April 10\u201311). Calendar invite sent, and your manager *Sarah Chen* has been notified.\n\nAnything else?")]);
      }
      if (key === "perf_back_dashboard") {
        const opts: PendingAction[] = [
          { key: "perf_view_details", label: "View details" },
          { key: "perf_update_progress", label: "Update progress" },
          { key: "perf_get_suggestions", label: "Get suggestions" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "perf_dashboard", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${perfSummaryText()}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
      }
    }

    // ── Promotion actions ───────────────────────────────────────────
    if (wf.kind === "promoTransfer") {
      if (key === "promo_growth_plan") {
        const opts: PendingAction[] = [
          { key: "promo_add_goal", label: "Add to goals" },
          { key: "promo_suggest_another", label: "Suggest another" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "promo_growth_plan", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg("Here's a suggested growth goal to close your leadership gap:\n\n\u2b50 *Suggested Growth Goal*\n_\"Lead a cross-functional initiative impacting 2 teams by Q4.\"_\n\nThis would strengthen your cross-team leadership evidence.\n\n" + fmtOptions(opts))]);
      }
      if (key === "promo_start_request") {
        const profile = getEmployeeProfile();
        const elig = getPromotionTransferEligibility();
        if (!elig.eligible) {
          const opts: PendingAction[] = [
            { key: "promo_growth_plan", label: "Create growth plan" },
          ];
          const nextWf: HrWorkflow = { ...wf, pendingActions: opts };
          return result(session, nextWf, [ack, botMsg(`Based on your current readiness score, I'd recommend building your growth plan first. This will strengthen your case with *${profile.managerName}*.\n\n${fmtOptions(opts)}`)]);
        }
        const req = createRequest("promotion", { summary: "Promotion request via agent" });
        return result(session, idleWf(), [ack, botMsg(`\ud83e\uddf6 Created your promotion request (${req.id}). I've notified *${profile.managerName}* to review it.\n\nAnything else?`)]);
      }
      if (key === "promo_suggested_skills") {
        const opts: PendingAction[] = [
          { key: "promo_growth_plan", label: "Create growth plan" },
          { key: "promo_back_readiness", label: "Back to readiness" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "promo_skills", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg("*Skills to Strengthen for Promotion*\n\n1. *Cross-team leadership* \u2014 Lead a project spanning 2+ teams\n2. *Technical mentorship* \u2014 Mentor 2\u20133 junior engineers\n3. *Strategic communication* \u2014 Present a strategy to senior leadership\n4. *System design ownership* \u2014 Own architecture for a new service\n\n" + fmtOptions(opts))]);
      }
      if (key === "promo_add_goal") {
        const cycle = getActiveCycle();
        createGoal({ cycleId: cycle.id, title: "Lead a cross-functional initiative impacting 2 teams", successMetric: "Deliver project spanning 2+ teams with documented outcomes", targetDate: "2026-12-31" });
        return result(session, idleWf(), [ack, botMsg("\u2705 Added *\"Lead a cross-functional initiative impacting 2 teams\"* to your goals.\n\nThis will help close the leadership gap. I'll check in on progress periodically.\n\nAnything else?")]);
      }
      if (key === "promo_add_alt_goal") {
        const cycle = getActiveCycle();
        createGoal({ cycleId: cycle.id, title: "Design and present next-gen Goals API architecture to engineering leadership", successMetric: "Architecture doc reviewed by senior leadership", targetDate: "2026-09-30" });
        return result(session, idleWf(), [ack, botMsg("\u2705 Added *\"Design and present next-gen Goals API architecture\"* to your goals.\n\nAnything else?")]);
      }
      if (key === "promo_suggest_another") {
        const opts: PendingAction[] = [
          { key: "promo_add_alt_goal", label: "Add to goals" },
          { key: "promo_suggest_more", label: "Suggest another" },
        ];
        const nextWf: HrWorkflow = { ...wf, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg("\u2b50 *Suggested Growth Goal*\n_\"Design and present the architecture for the next-gen Goals API to the engineering leadership team by end of Q3.\"_\n\nThis demonstrates both system design ownership and strategic communication.\n\n" + fmtOptions(opts))]);
      }
      if (key === "promo_suggest_more") {
        return result(session, idleWf(), [ack, botMsg("Here's one more:\n\n\u2b50 _\"Mentor 3 junior engineers through a structured 8-week program, with each mentee completing a stretch project.\"_\n\nThis builds your technical mentorship credentials.\n\nWant to add this to your goals? Just say \"create a goal\" and we'll set it up.")]);
      }
      if (key === "promo_back_readiness") {
        const opts: PendingAction[] = [
          { key: "promo_growth_plan", label: "Create growth plan" },
          { key: "promo_start_request", label: "Start promotion request" },
          { key: "promo_suggested_skills", label: "Suggested skills" },
        ];
        const nextWf: HrWorkflow = { ...wf, step: "promo_readiness", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${readinessText()}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
      }
    }
  }

  // ─── Active workflow: free text input ─────────────────────────────

  const hasActive = wf.kind !== "idle";

  if (hasActive && wf.kind === "goalCreate") {
    if (wf.step === "goal_refine_outcome") {
      const draft: HrGoalDraft = { ...(wf.draft.goal || { raw: "" }), outcome: trimmed };
      const opts: PendingAction[] = [
        { key: "goal_metric_feedback", label: "Feedback from team" },
        { key: "goal_metric_sessions", label: "Completion of coaching sessions" },
        { key: "goal_metric_cert", label: "Certification / training" },
        { key: "goal_metric_custom", label: "Custom input" },
      ];
      const nextWf: HrWorkflow = { ...wf, step: "goal_refine_metric", draft: { ...wf.draft, goal: draft }, pendingActions: opts };
      return result(session, nextWf, [um, botMsg(`Got it \u2014 \"${trimmed}\".\n\nLet's make this measurable. How will you track improvement?\n\n${fmtOptions(opts)}`)]);
    }

    if (wf.step === "goal_refine_metric" && wf.meta?.awaitingCustomMetric) {
      const draft: HrGoalDraft = { ...(wf.draft.goal || { raw: "" }), metric: "custom", metricLabel: trimmed };
      const smart = generateSmartGoal(draft);
      draft.smartGoal = smart;
      const opts: PendingAction[] = [
        { key: "goal_accept", label: "Accept goal" },
        { key: "goal_edit", label: "Edit" },
        { key: "goal_refine_more", label: "Refine more" },
      ];
      const nextWf: HrWorkflow = { ...wf, step: "goal_draft_review", draft: { ...wf.draft, goal: draft }, pendingActions: opts, meta: { ...wf.meta, awaitingCustomMetric: false } };
      return result(session, nextWf, [um, botMsg(`\u2b50 *Suggested Goal*\n\n\"${smart}\"\n\n${fmtOptions(opts)}`)]);
    }

    if (wf.step === "goal_draft_review" || wf.step === "goal_submit_confirm") {
      const draft: HrGoalDraft = { ...(wf.draft.goal || { raw: "" }), outcome: trimmed };
      const opts: PendingAction[] = [
        { key: "goal_metric_feedback", label: "Feedback from team" },
        { key: "goal_metric_sessions", label: "Completion of coaching sessions" },
        { key: "goal_metric_cert", label: "Certification / training" },
        { key: "goal_metric_custom", label: "Custom input" },
      ];
      const nextWf: HrWorkflow = { ...wf, step: "goal_refine_metric", draft: { ...wf.draft, goal: draft }, pendingActions: opts };
      return result(session, nextWf, [um, botMsg(`Got it \u2014 let's rebuild with that.\n\nHow will you track improvement?\n\n${fmtOptions(opts)}`)]);
    }
  }

  if (hasActive && wf.kind === "selfReview") {
    if (cmd === "submit") {
      const cycle = getActiveCycle();
      const draft = wf.draft.selfReview?.raw ?? session.composerText;
      if (!draft || draft.trim().length < 40) {
        return result(session, wf, [um, botMsg("Your draft is a bit short. Add a few specific examples, then type `submit` again.")]);
      }
      submitSelfReview(cycle.id, draft);
      return result(session, idleWf(), [um, botMsg(`Submitted your self-review for ${cycle.label}. I'll notify ${getEmployeeProfile().managerName} that it's ready.\n\nAnything else?`)]);
    }
    const raw = trimmed;
    const sanitize = sanitizeProfessionalTone(raw);
    const nextWf: HrWorkflow = { ...wf, step: "drafting", draft: { ...wf.draft, selfReview: { raw, sanitizedSuggestion: sanitize.suggestion } } };
    const resp = sanitize.flagged
      ? `I noticed language that could land poorly in a formal review. Here's a more professional version:\n\n${sanitize.suggestion}\n\nType \`submit\` when ready, or send an updated draft.`
      : "Saved. Type `submit` when you're happy with it, or send an updated draft.";
    return { next: { ...session, phase: "active", activeWorkflow: nextWf, composerText: raw, messages: [...session.messages, um, botMsg(resp)] }, emitted: [] };
  }

  if (hasActive && wf.kind === "promoTransfer") {
    return result(session, wf, [um, botMsg("Pick a numbered option above, or type `cancel` to exit.")]);
  }

  if (hasActive && wf.kind === "policyQa") {
    const matches = searchPolicyKb(trimmed, 2);
    const answer = matches.length === 0
      ? "I couldn't find a relevant policy. Try asking about goals, self-reviews, promotions, or transfers."
      : matches.map((m) => `*${m.article.title}* (${m.article.sourceLabel})\n${m.article.body}`).join("\n\n");
    return result(session, idleWf(), [um, botMsg(answer)]);
  }

  if (hasActive && wf.kind === "goalView") {
    return result(session, wf, [um, botMsg("Pick a numbered option above, or type `cancel` to exit.")]);
  }

  // ─── No active workflow: detect intent ────────────────────────────

  const intent: HrIntent = detectIntent(trimmed);

  if (intent.type === "goalCreate") {
    const opts: PendingAction[] = [
      { key: "goal_start_refine", label: "Start refining goal" },
      { key: "goal_see_examples", label: "See examples" },
      { key: "goal_not_now", label: "Not now" },
    ];
    const nextWf: HrWorkflow = { ...newWf("goalCreate"), step: "goal_acknowledge", draft: { goal: { raw: trimmed, title: trimmed } }, pendingActions: opts };
    return result(session, nextWf, [um, botMsg(`Great goal to focus on \ud83d\udc4d\n\n_\"${trimmed}\"_\n\nI can help you convert this into a high-quality SMART goal.\n\n${fmtOptions(opts)}`)]);
  }

  if (intent.type === "goalView" || intent.type === "performanceSummary") {
    const opts: PendingAction[] = [
      { key: "perf_view_details", label: "View details" },
      { key: "perf_update_progress", label: "Update progress" },
      { key: "perf_get_suggestions", label: "Get suggestions" },
    ];
    const nextWf: HrWorkflow = { ...newWf("goalView"), step: "perf_dashboard", pendingActions: opts };
    return result(session, nextWf, [um, botMsg(`${perfSummaryText()}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
  }

  if (intent.type === "selfReview") {
    const seed = buildSelfReviewSeed();
    const nextWf: HrWorkflow = { ...newWf("selfReview"), step: "drafting", draft: { selfReview: { raw: seed } } };
    const completed = listCompletedGoals(getActiveCycle().id);
    const line = completed.length === 0
      ? "I didn't find any completed goals yet \u2014 we can still draft a strong self-review."
      : `I pulled ${completed.length} completed goal${completed.length === 1 ? "" : "s"} from this cycle to ground your write-up.`;
    return { next: { ...session, phase: "active", activeWorkflow: nextWf, composerText: seed, messages: [...session.messages, um, botMsg(`${line}\n\nI put a starter draft in your editor. Edit it, then hit send to save an iteration. When you're ready, type \`submit\`.`)] }, emitted: [] };
  }

  if (intent.type === "promoTransfer") {
    const reqType = trimmed.toLowerCase().includes("transfer") ? "transfer" : "promotion";
    const opts: PendingAction[] = [
      { key: "promo_growth_plan", label: "Create promotion growth plan" },
      { key: "promo_start_request", label: "Start promotion request" },
      { key: "promo_suggested_skills", label: "Suggested skills" },
    ];
    const nextWf: HrWorkflow = { ...newWf("promoTransfer"), step: "promo_readiness", pendingActions: opts, meta: { requestedType: reqType } };
    return result(session, nextWf, [um, botMsg("Let me quickly evaluate based on:\n\u2714 Goal completion\n\u2714 Performance rating\n\u2714 Time in role\n\u2714 Skill readiness"), botMsg(`${readinessText()}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
  }

  if (intent.type === "policyQa") {
    const nextWf: HrWorkflow = { ...newWf("policyQa"), step: "drafting", draft: { policyQuestion: trimmed } };
    const matches = searchPolicyKb(trimmed, 2);
    const answer = matches.length === 0
      ? "What policy topic are you looking for (goals, self-reviews, promotions, transfers)?"
      : matches.map((m) => `*${m.article.title}* (${m.article.sourceLabel})\n${m.article.body}`).join("\n\n");
    return result(session, nextWf, [um, botMsg(answer)]);
  }

  return result(session, idleWf(), [um, botMsg("I can help with: creating goals (with SMART coaching), viewing goal progress, drafting your self-review, promotion/transfer requests, and policy.\n\nTry: \"create a goal\", \"show my goals\", or \"help me write my self review\".")]);
}

function buildSelfReviewSeed(): string {
  const cycle = getActiveCycle();
  const completed = listCompletedGoals(cycle.id);
  const bullets = completed.length === 0
    ? "- (No completed goals found yet)"
    : completed.map((g) => `- ${g.title} \u2014 Result: ${g.successMetric}`).join("\n");
  return `Self-review draft for ${cycle.label}\n\n1) Impact\n${bullets}\n\n2) Growth & learnings\n- \n\n3) Collaboration\n- \n\n4) Next cycle focus\n- `;
}
