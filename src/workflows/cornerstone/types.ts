export type CsAgentId = string;

export type CsWorkflowKind =
  | "idle"
  | "careerDiscovery"
  | "skillGap"
  | "mentorship";

export type CsWorkflowStep =
  | "start"
  | "done"
  // careerDiscovery
  | "career_roles_shown"
  | "career_learning_shown"
  // skillGap
  | "skill_readiness_shown"
  | "skill_mentor_card"
  | "skill_progress"
  // mentorship
  | "mentor_suggestions_shown"
  | "mentor_scheduled"
  | "mentor_actions";

export interface PendingAction {
  key: string;
  label: string;
}

export interface CsWorkflow {
  id: string;
  kind: CsWorkflowKind;
  step: CsWorkflowStep;
  meta?: Record<string, unknown>;
  pendingActions?: PendingAction[];
}

export interface CsChatMessage {
  id: string;
  name: string;
  avatar: string;
  time: string;
  text?: string;
  tag?: string;
  blocks?: any[];
  isBot?: boolean;
}

export type ConversationPhase = "welcome" | "active";

export interface CsWorkflowSession {
  agentId: CsAgentId;
  messages: CsChatMessage[];
  activeWorkflow: CsWorkflow;
  composerText: string;
  phase: ConversationPhase;
}

export type CsIntent =
  | { type: "careerDiscovery" }
  | { type: "skillGap"; role?: string }
  | { type: "mentorship"; skill?: string }
  | { type: "unknown" };
