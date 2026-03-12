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
} from "./types";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AGENT_NAME = "Employee Performance Management Agent";

function botMessage(text: string, blocks?: SlackBlock[]): HrChatMessage {
  return {
    id: makeId("b"),
    name: AGENT_NAME,
    avatar: assetPath("/slackbot-logo.svg"),
    time: "Just now",
    isBot: true,
    text: blocks ? undefined : text,
    blocks,
  };
}

function userMessage(text: string): HrChatMessage {
  return {
    id: makeId("u"),
    name: "You",
    avatar: "https://randomuser.me/api/portraits/med/women/75.jpg",
    time: "Just now",
    isBot: false,
    text,
  };
}

function createWorkflow(kind: HrWorkflowKind): HrWorkflow {
  return { id: makeId("wf"), kind, step: "start", draft: {} };
}

// ─── Block Kit Builders for Goal Create Flow ────────────────────────────────

function goalAcknowledgeBlocks(vagueGoal: string): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `💼 *Career Growth Agent*\nGreat goal to focus on 👍\n\n_"${vagueGoal}"_\n\nI can help you convert this into a high-quality SMART goal.`,
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "✏️ Start refining goal", emoji: true },
          action_id: "goal_start_refine",
          style: "primary",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "👀 See examples", emoji: true },
          action_id: "goal_see_examples",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "❌ Not now", emoji: true },
          action_id: "goal_not_now",
        },
      ],
    },
  ];
}

function goalRefineOutcomeBlocks(): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "What outcome would success look like?\n\n_For example: \"Become better at coaching junior team members\" or \"Get certified in cloud architecture\"_",
      },
    },
  ];
}

function goalRefineMetricBlocks(): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Let's make this measurable 👇\nHow will you track improvement?",
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "📊 Feedback from team", emoji: true },
          action_id: "goal_metric_feedback",
          value: "feedback",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "📋 Completion of sessions", emoji: true },
          action_id: "goal_metric_sessions",
          value: "sessions",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "🎓 Certification / training", emoji: true },
          action_id: "goal_metric_cert",
          value: "certification",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "✍️ Custom input", emoji: true },
          action_id: "goal_metric_custom",
          value: "custom",
        },
      ],
    },
  ];
}

function goalDraftReviewBlocks(smartGoal: string): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `⭐ *Suggested Goal*\n\n"${smartGoal}"`,
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "✅ Accept Goal", emoji: true },
          action_id: "goal_accept",
          style: "primary",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "✏️ Edit", emoji: true },
          action_id: "goal_edit",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "🔁 Refine more", emoji: true },
          action_id: "goal_refine_more",
        },
      ],
    },
  ];
}

function goalSubmitConfirmBlocks(smartGoal: string): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Ready to submit this goal to your performance plan?\n\n_"${smartGoal}"_`,
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "🚀 Submit", emoji: true },
          action_id: "goal_submit",
          style: "primary",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "🧾 Save Draft", emoji: true },
          action_id: "goal_save_draft",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "❌ Cancel", emoji: true },
          action_id: "goal_cancel",
        },
      ],
    },
  ];
}

function goalDoneBlocks(): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "🎯 *Nice work!*\nI'll check in every 2 weeks to help you track progress.",
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "📅 Set reminder frequency", emoji: true },
          action_id: "goal_set_reminder",
        },
      ],
    },
  ];
}

function goalExamplesBlocks(): SlackBlock[] {
  const examples = getGoalExamples();
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "👀 *SMART Goal Examples*\n\nHere are some well-crafted goals for inspiration:\n\n" +
          examples.map((ex, i) => `${i + 1}. ${ex}`).join("\n\n"),
      },
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "✏️ Start refining my goal", emoji: true },
          action_id: "goal_start_refine",
          style: "primary",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "❌ Not now", emoji: true },
          action_id: "goal_not_now",
        },
      ],
    },
  ];
}

// ─── Summary helpers (unchanged) ────────────────────────────────────────────

function summarizeGoals() {
  const cycle = getActiveCycle();
  const goals = listGoals(cycle.id);
  const snap = getPerformanceSnapshot(cycle.id);

  const header = `Here's where you stand for ${cycle.label}: you've completed ${snap.goalsCompleted} out of ${snap.goalsTotal} goals.`;
  const behindLine =
    snap.goalsBehind.length > 0
      ? `You're behind on ${snap.goalsBehind.length} goal${snap.goalsBehind.length === 1 ? "" : "s"}: ` +
        snap.goalsBehind
          .map((g) => `~${g.behindByPct}% behind on "${g.title}"`)
          .join(", ") +
        "."
      : "You're on track across your active goals.";

  const list = goals
    .map((g) => {
      const status =
        g.status === "completed" ? "Completed" : g.status === "in_progress" ? `${g.progressPct}%` : "Not started";
      return `- ${g.title} — ${status} (target: ${g.targetDate})`;
    })
    .join("\n");

  const nudge =
    snap.goalsBehind.length > 0
      ? "Would you like to update progress on one of these, or adjust a target date?"
      : "Want to create a new goal, or update progress on an existing one?";

  return `${header}\n\n${behindLine}\n\n${list}\n\n${nudge}`;
}

function buildSelfReviewSeed(): string {
  const cycle = getActiveCycle();
  const completed = listCompletedGoals(cycle.id);

  const bullets =
    completed.length === 0
      ? "- (No completed goals found yet — we can still draft around impact, learnings, and collaboration.)"
      : completed
          .map((g) => `- ${g.title} — Result: ${g.successMetric}`)
          .join("\n");

  return `Self-review draft for ${cycle.label}\n\n1) Impact\n${bullets}\n\n2) Growth & learnings\n- \n\n3) Collaboration\n- \n\n4) Next cycle focus\n- `;
}

function normalizeCommand(text: string) {
  return text.trim().toLowerCase();
}

// ─── Turn Result Type ───────────────────────────────────────────────────────

type TurnResult = {
  next: HrWorkflowSession;
  emitted: HrChatMessage[];
};

// ─── Action Handler (button clicks) ─────────────────────────────────────────

export function hrHandleAction(session: HrWorkflowSession, actionId: string): TurnResult {
  const wf = session.activeWorkflow;

  // ─── Goal Create Actions ──────────────────────────────────────────────
  if (wf.kind === "goalCreate") {
    switch (actionId) {
      case "goal_start_refine": {
        const nextWf: HrWorkflow = { ...wf, step: "goal_refine_outcome" };
        return {
          next: {
            ...session,
            activeWorkflow: nextWf,
            messages: [
              ...session.messages,
              botMessage("", goalRefineOutcomeBlocks()),
            ],
          },
          emitted: [],
        };
      }

      case "goal_see_examples": {
        return {
          next: {
            ...session,
            messages: [
              ...session.messages,
              botMessage("", goalExamplesBlocks()),
            ],
          },
          emitted: [],
        };
      }

      case "goal_not_now":
      case "goal_cancel": {
        return {
          next: {
            ...session,
            composerText: "",
            activeWorkflow: createWorkflow("idle"),
            messages: [
              ...session.messages,
              botMessage("No problem — whenever you're ready, just say \"create a goal\" and we'll pick it up. 👋"),
            ],
          },
          emitted: [],
        };
      }

      case "goal_metric_feedback":
      case "goal_metric_sessions":
      case "goal_metric_cert": {
        const metricMap: Record<string, { key: string; label: string }> = {
          goal_metric_feedback: { key: "feedback", label: "Feedback from team" },
          goal_metric_sessions: { key: "sessions", label: "Completion of coaching sessions" },
          goal_metric_cert: { key: "certification", label: "Certification / training" },
        };
        const chosen = metricMap[actionId];
        const updatedDraft: HrGoalDraft = {
          ...(wf.draft.goal || { raw: "" }),
          metric: chosen.key,
          metricLabel: chosen.label,
        };
        const smartGoal = generateSmartGoal(updatedDraft);
        updatedDraft.smartGoal = smartGoal;

        const nextWf: HrWorkflow = {
          ...wf,
          step: "goal_draft_review",
          draft: { ...wf.draft, goal: updatedDraft },
        };
        return {
          next: {
            ...session,
            activeWorkflow: nextWf,
            messages: [
              ...session.messages,
              botMessage("", goalDraftReviewBlocks(smartGoal)),
            ],
          },
          emitted: [],
        };
      }

      case "goal_metric_custom": {
        const nextWf: HrWorkflow = {
          ...wf,
          step: "goal_refine_metric",
          meta: { ...wf.meta, awaitingCustomMetric: true },
        };
        return {
          next: {
            ...session,
            activeWorkflow: nextWf,
            messages: [
              ...session.messages,
              botMessage("Tell me how you'd like to measure success — describe the metric in your own words."),
            ],
          },
          emitted: [],
        };
      }

      case "goal_accept": {
        const smartGoal = wf.draft.goal?.smartGoal || "Your goal";
        const nextWf: HrWorkflow = {
          ...wf,
          step: "goal_submit_confirm",
        };
        return {
          next: {
            ...session,
            activeWorkflow: nextWf,
            messages: [
              ...session.messages,
              botMessage("", goalSubmitConfirmBlocks(smartGoal)),
            ],
          },
          emitted: [],
        };
      }

      case "goal_edit": {
        return {
          next: {
            ...session,
            activeWorkflow: { ...wf, step: "goal_refine_outcome" },
            messages: [
              ...session.messages,
              botMessage("Sure — tell me the updated outcome you'd like, and I'll rebuild the goal."),
            ],
          },
          emitted: [],
        };
      }

      case "goal_refine_more": {
        return {
          next: {
            ...session,
            activeWorkflow: { ...wf, step: "goal_refine_outcome" },
            messages: [
              ...session.messages,
              botMessage("", goalRefineOutcomeBlocks()),
            ],
          },
          emitted: [],
        };
      }

      case "goal_submit": {
        const draft = wf.draft.goal;
        const cycle = getActiveCycle();
        const created = createGoal({
          cycleId: cycle.id,
          title: draft?.smartGoal || draft?.title || "Goal",
          successMetric: draft?.metricLabel || draft?.successMetric || "See goal description",
          targetDate: draft?.targetDate || "Q3 2026",
        });

        return {
          next: {
            ...session,
            composerText: "",
            activeWorkflow: createWorkflow("idle"),
            messages: [
              ...session.messages,
              botMessage("", goalDoneBlocks()),
            ],
          },
          emitted: [],
        };
      }

      case "goal_save_draft": {
        return {
          next: {
            ...session,
            composerText: "",
            activeWorkflow: createWorkflow("idle"),
            messages: [
              ...session.messages,
              botMessage("📝 Draft saved! You can resume anytime by saying \"create a goal\". I'll remember where you left off."),
            ],
          },
          emitted: [],
        };
      }

      case "goal_set_reminder": {
        return {
          next: {
            ...session,
            messages: [
              ...session.messages,
              botMessage("📅 Done — I'll check in with you every 2 weeks on your goal progress. You can change this anytime.\n\nWhat else can I help with?"),
            ],
          },
          emitted: [],
        };
      }
    }
  }

  return { next: session, emitted: [] };
}

// ─── Text Turn Handler ──────────────────────────────────────────────────────

export function hrReduceTurn(session: HrWorkflowSession, text: string): TurnResult {
  const trimmed = text.trim();
  if (!trimmed) return { next: session, emitted: [] };

  const cmd = normalizeCommand(trimmed);
  const userMsg = userMessage(trimmed);
  const emitted: HrChatMessage[] = [userMsg];

  // Global cancel command
  if (cmd === "cancel") {
    const next: HrWorkflowSession = {
      ...session,
      composerText: "",
      activeWorkflow: createWorkflow("idle"),
      messages: [...session.messages, ...emitted, botMessage("Okay — cancelled. What would you like to do next?")],
    };
    return { next, emitted: [] };
  }

  const wf = session.activeWorkflow;
  const hasActive = wf.kind !== "idle";

  // ─── Goal Create: text input during active workflow ─────────────────
  if (hasActive && wf.kind === "goalCreate") {
    // Refine outcome step: user provides what success looks like
    if (wf.step === "goal_refine_outcome") {
      const updatedDraft: HrGoalDraft = {
        ...(wf.draft.goal || { raw: "" }),
        outcome: trimmed,
      };
      const nextWf: HrWorkflow = {
        ...wf,
        step: "goal_refine_metric",
        draft: { ...wf.draft, goal: updatedDraft },
      };
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: nextWf,
          messages: [
            ...session.messages,
            ...emitted,
            botMessage("", goalRefineMetricBlocks()),
          ],
        },
        emitted: [],
      };
    }

    // Custom metric input
    if (wf.step === "goal_refine_metric" && wf.meta?.awaitingCustomMetric) {
      const updatedDraft: HrGoalDraft = {
        ...(wf.draft.goal || { raw: "" }),
        metric: "custom",
        metricLabel: trimmed,
      };
      const smartGoal = generateSmartGoal(updatedDraft);
      updatedDraft.smartGoal = smartGoal;

      const nextWf: HrWorkflow = {
        ...wf,
        step: "goal_draft_review",
        draft: { ...wf.draft, goal: updatedDraft },
        meta: { ...wf.meta, awaitingCustomMetric: false },
      };
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: nextWf,
          messages: [
            ...session.messages,
            ...emitted,
            botMessage("", goalDraftReviewBlocks(smartGoal)),
          ],
        },
        emitted: [],
      };
    }

    // If in draft review or submit confirm and user types free text,
    // treat it as an edit — go back to refine outcome
    if (wf.step === "goal_draft_review" || wf.step === "goal_submit_confirm") {
      const updatedDraft: HrGoalDraft = {
        ...(wf.draft.goal || { raw: "" }),
        outcome: trimmed,
      };
      const nextWf: HrWorkflow = {
        ...wf,
        step: "goal_refine_metric",
        draft: { ...wf.draft, goal: updatedDraft },
      };
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: nextWf,
          messages: [
            ...session.messages,
            ...emitted,
            botMessage("Got it — let's rebuild with that. How will you track improvement?"),
            botMessage("", goalRefineMetricBlocks()),
          ],
        },
        emitted: [],
      };
    }
  }

  // ─── Self Review: text input during active workflow ─────────────────
  if (hasActive && wf.kind === "selfReview") {
    if (cmd === "submit") {
      const cycle = getActiveCycle();
      const draft = wf.draft.selfReview?.raw ?? session.composerText;
      if (!draft || draft.trim().length < 40) {
        return {
          next: {
            ...session,
            messages: [
              ...session.messages,
              ...emitted,
              botMessage("Your draft is a bit short. Add a few specific examples, then type `submit` again."),
            ],
          },
          emitted: [],
        };
      }
      submitSelfReview(cycle.id, draft);
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: createWorkflow("idle"),
          messages: [
            ...session.messages,
            ...emitted,
            botMessage(
              `Submitted your self-review for ${cycle.label}. I'll notify ${getEmployeeProfile().managerName} that it's ready for appraisal review.`
            ),
          ],
        },
        emitted: [],
      };
    }

    const raw = trimmed;
    const sanitize = sanitizeProfessionalTone(raw);
    const nextWf: HrWorkflow = {
      ...wf,
      step: "drafting",
      draft: { ...wf.draft, selfReview: { raw, sanitizedSuggestion: sanitize.suggestion } },
    };

    const response = sanitize.flagged
      ? `I noticed language that could land poorly in a formal review. Here's a more professional version you can use:\n\n${sanitize.suggestion}\n\nIf you want to submit as-is, type \`submit\`. If you want to keep editing, send an updated draft.`
      : "Saved. If you're happy with this draft, type `submit`. If you want refinements, tell me what to change (tone, structure, or examples).";

    return {
      next: {
        ...session,
        activeWorkflow: nextWf,
        composerText: raw,
        messages: [...session.messages, ...emitted, botMessage(response)],
      },
      emitted: [],
    };
  }

  // ─── Promo / Transfer ──────────────────────────────────────────────
  if (hasActive && wf.kind === "promoTransfer") {
    if (cmd === "submit") {
      const eligibility = getPromotionTransferEligibility();
      if (!eligibility.eligible) {
        const reasons = eligibility.reasons.map((r) => `- ${r}`).join("\n");
        return {
          next: {
            ...session,
            composerText: "",
            activeWorkflow: createWorkflow("idle"),
            messages: [
              ...session.messages,
              ...emitted,
              botMessage(
                `I can't create that request yet based on eligibility signals:\n${reasons}\n\nIf you want, I can help you map a plan to get eligible and align with your manager.`
              ),
            ],
          },
          emitted: [],
        };
      }
      const requestedType = wf.meta?.requestedType === "transfer" ? "transfer" : "promotion";
      const payload = wf.draft.transfer?.raw
        ? { summary: wf.draft.transfer.raw }
        : { summary: "Promotion request created via Employee Performance Management Agent prototype." };
      const req = createRequest(requestedType, payload);
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: createWorkflow("idle"),
          messages: [
            ...session.messages,
            ...emitted,
            botMessage(
              `Created your ${requestedType} request (${req.id}). I notified ${getEmployeeProfile().managerName} to review it.`
            ),
          ],
        },
        emitted: [],
      };
    }

    const requestedType = wf.meta?.requestedType === "transfer" ? "transfer" : "promotion";
    const eligibility = getPromotionTransferEligibility();
    if (!eligibility.eligible) {
      const reasons = eligibility.reasons.map((r) => `- ${r}`).join("\n");
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: createWorkflow("idle"),
          messages: [
            ...session.messages,
            ...emitted,
            botMessage(
              `I can't create that request yet based on eligibility signals:\n${reasons}\n\nIf you want, I can help you draft an alignment note to ${getEmployeeProfile().managerName} on what would make a strong case next cycle.`
            ),
          ],
        },
        emitted: [],
      };
    }

    const nextWf: HrWorkflow = {
      ...wf,
      step: "drafting",
      draft: { ...wf.draft, transfer: { raw: trimmed } },
    };

    const prompt =
      requestedType === "transfer"
        ? "Got it. If you're ready, type `submit` to create the transfer request for manager review."
        : "You look eligible. Type `submit` to create a promotion request for manager review.";

    return {
      next: {
        ...session,
        activeWorkflow: nextWf,
        composerText: "",
        messages: [...session.messages, ...emitted, botMessage(prompt)],
      },
      emitted: [],
    };
  }

  // ─── Policy QA ─────────────────────────────────────────────────────
  if (hasActive && wf.kind === "policyQa") {
    const matches = searchPolicyKb(trimmed, 2);
    const answer =
      matches.length === 0
        ? "I couldn't find a relevant policy snippet in my quick KB. Try asking about goals, self-reviews, promotions, or transfers."
        : matches
            .map(
              (m) =>
                `${m.article.title} (${m.article.sourceLabel})\n${m.article.body}`
            )
            .join("\n\n");

    return {
      next: {
        ...session,
        composerText: "",
        activeWorkflow: createWorkflow("idle"),
        messages: [...session.messages, ...emitted, botMessage(answer)],
      },
      emitted: [],
    };
  }

  // ─── No active workflow: detect intent and start new flow ──────────

  const intent: HrIntent = detectIntent(trimmed);

  if (intent.type === "goalCreate") {
    const vagueGoal = trimmed;
    const nextWf: HrWorkflow = {
      ...createWorkflow("goalCreate"),
      step: "goal_acknowledge",
      draft: { goal: { raw: vagueGoal, title: vagueGoal } },
    };
    return {
      next: {
        ...session,
        activeWorkflow: nextWf,
        composerText: "",
        messages: [
          ...session.messages,
          ...emitted,
          botMessage("", goalAcknowledgeBlocks(vagueGoal)),
        ],
      },
      emitted: [],
    };
  }

  if (intent.type === "goalView" || intent.type === "performanceSummary") {
    return {
      next: {
        ...session,
        composerText: "",
        activeWorkflow: createWorkflow("idle"),
        messages: [...session.messages, ...emitted, botMessage(summarizeGoals())],
      },
      emitted: [],
    };
  }

  if (intent.type === "selfReview") {
    const seed = buildSelfReviewSeed();
    const nextWf: HrWorkflow = {
      ...createWorkflow("selfReview"),
      step: "drafting",
      draft: { selfReview: { raw: seed } },
    };
    const completed = listCompletedGoals(getActiveCycle().id);
    const completedLine =
      completed.length === 0
        ? "I didn't find any completed goals yet — we can still draft a strong self-review."
        : `I pulled ${completed.length} completed goal${completed.length === 1 ? "" : "s"} from this cycle to ground your write-up.`;

    return {
      next: {
        ...session,
        activeWorkflow: nextWf,
        composerText: seed,
        messages: [
          ...session.messages,
          ...emitted,
          botMessage(
            `${completedLine}\n\nI put a starter draft in your editor. Edit it, then hit send to save an iteration. When you're ready, type \`submit\`.`
          ),
        ],
      },
      emitted: [],
    };
  }

  if (intent.type === "promoTransfer") {
    const t = trimmed.toLowerCase();
    const requestedType = t.includes("transfer") ? "transfer" : "promotion";
    const eligibility = getPromotionTransferEligibility();
    const nextWf: HrWorkflow = {
      ...createWorkflow("promoTransfer"),
      step: "drafting",
      draft: {},
      meta: { requestedType },
    };

    if (!eligibility.eligible) {
      const reasons = eligibility.reasons.map((r) => `- ${r}`).join("\n");
      return {
        next: {
          ...session,
          composerText: "",
          activeWorkflow: createWorkflow("idle"),
          messages: [
            ...session.messages,
            ...emitted,
            botMessage(
              `I'll be direct so you can plan effectively: you're not eligible to submit a ${requestedType} request yet.\n\n${reasons}\n\nIf you want, tell me what you're aiming for and I'll help you draft a manager alignment note.`
            ),
          ],
        },
        emitted: [],
      };
    }

    const prompt =
      requestedType === "transfer"
        ? "You look eligible. Tell me the department/team and role you're targeting (one sentence is fine)."
        : "You look eligible. If you want to proceed, type `submit` to create a promotion request for manager review.";

    return {
      next: {
        ...session,
        activeWorkflow: nextWf,
        composerText: "",
        messages: [...session.messages, ...emitted, botMessage(prompt)],
      },
      emitted: [],
    };
  }

  if (intent.type === "policyQa") {
    const nextWf: HrWorkflow = { ...createWorkflow("policyQa"), step: "drafting", draft: { policyQuestion: trimmed } };
    const matches = searchPolicyKb(trimmed, 2);
    const answer =
      matches.length === 0
        ? "What policy topic are you looking for (goals, self-reviews, promotions, transfers)?"
        : matches
            .map((m) => `${m.article.title} (${m.article.sourceLabel})\n${m.article.body}`)
            .join("\n\n");

    return {
      next: {
        ...session,
        activeWorkflow: nextWf,
        composerText: "",
        messages: [...session.messages, ...emitted, botMessage(answer)],
      },
      emitted: [],
    };
  }

  const fallback =
    "I can help with: creating goals (with SMART coaching), viewing goal progress, drafting your self-review, promotion/transfer requests, and goals/appraisal policy.\n\nTry: \"create a goal\", \"show my goals\", or \"help me write my self review\".";

  return {
    next: {
      ...session,
      composerText: "",
      activeWorkflow: createWorkflow("idle"),
      messages: [...session.messages, ...emitted, botMessage(fallback)],
    },
    emitted: [],
  };
}
