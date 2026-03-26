export type HrAgentId = string;

export type HrWorkflowKind =
  | "idle"
  | "goalCreate"
  | "goalView"
  | "selfReview"
  | "promoTransfer"
  | "policyQa";

export type HrWorkflowStep =
  | "start"
  | "drafting"
  | "review"
  | "submitted"
  | "done"
  // goalCreate sub-steps
  | "goal_acknowledge"
  | "goal_refine_outcome"
  | "goal_refine_metric"
  | "goal_draft_review"
  | "goal_submit_confirm"
  // goalView sub-steps
  | "perf_dashboard"
  | "perf_suggestions"
  | "perf_mentor_card"
  // promoTransfer sub-steps
  | "promo_readiness"
  | "promo_growth_plan"
  | "promo_skills";

/** A numbered action the user can pick by typing "1", "2", etc. */
export interface PendingAction {
  key: string;
  label: string;
}

export interface HrGoalDraft {
  raw: string;
  title?: string;
  outcome?: string;
  metric?: string;
  metricLabel?: string;
  targetDate?: string;
  smartGoal?: string;
  successMetric?: string;
}

export interface HrSelfReviewDraft {
  raw: string;
  sanitizedSuggestion?: string;
}

export interface HrTransferDraft {
  raw: string;
  targetOrg?: string;
  targetRole?: string;
}

export interface HrWorkflow {
  id: string;
  kind: HrWorkflowKind;
  step: HrWorkflowStep;
  draft: {
    goal?: HrGoalDraft;
    selfReview?: HrSelfReviewDraft;
    transfer?: HrTransferDraft;
    policyQuestion?: string;
  };
  meta?: Record<string, unknown>;
  /** Numbered options the user can pick from. Cleared after each selection. */
  pendingActions?: PendingAction[];
}

export interface HrChatMessage {
  id: string;
  name: string;
  avatar: string;
  time: string;
  text?: string;
  blocks?: any[];
  isBot?: boolean;
}

export type ConversationPhase = "welcome" | "active";

export interface HrWorkflowSession {
  agentId: HrAgentId;
  messages: HrChatMessage[];
  activeWorkflow: HrWorkflow;
  composerText: string;
  /** Tracks whether the user has started a conversation yet. */
  phase: ConversationPhase;
}

export type HrIntent =
  | { type: "goalCreate" }
  | { type: "goalView" }
  | { type: "performanceSummary" }
  | { type: "selfReview" }
  | { type: "promoTransfer" }
  | { type: "policyQa" }
  | { type: "unknown" };
