"use client";

import { assetPath } from "@/lib/asset-path";
import { detectCsIntent } from "./router";
import {
  getSuggestedRoles,
  getSkillGaps,
  getLearningCourses,
  getMentor,
  getActionItems,
  getTimeManagementResources,
} from "./mockData";
import type {
  CsChatMessage,
  CsIntent,
  CsWorkflow,
  CsWorkflowKind,
  CsWorkflowSession,
  PendingAction,
} from "./types";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AGENT_NAME = "Employee Agent";
const AGENT_AVATAR = "/single-person.png";
const AGENT_TAG = "AGENTFORCE";

function botMsg(text: string): CsChatMessage {
  return {
    id: makeId("b"),
    name: AGENT_NAME,
    avatar: assetPath(AGENT_AVATAR),
    time: "Just now",
    isBot: true,
    tag: AGENT_TAG,
    text,
  };
}

function userMsg(text: string): CsChatMessage {
  return {
    id: makeId("u"),
    name: "You",
    avatar: "https://randomuser.me/api/portraits/med/women/75.jpg",
    time: "Just now",
    isBot: false,
    text,
  };
}

function idleWf(): CsWorkflow {
  return { id: makeId("wf"), kind: "idle", step: "start" };
}

function newWf(kind: CsWorkflowKind): CsWorkflow {
  return { id: makeId("wf"), kind, step: "start" };
}

function fmtOptions(options: PendingAction[]): string {
  return options.map((o, i) => `${i + 1}. ${o.label}`).join("\n");
}

function progressBar(pct: number): string {
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty) + ` ${pct}%`;
}

type TurnResult = { next: CsWorkflowSession; emitted: CsChatMessage[] };

function result(session: CsWorkflowSession, wf: CsWorkflow, msgs: CsChatMessage[]): TurnResult {
  return {
    next: { ...session, phase: "active", composerText: "", activeWorkflow: wf, messages: [...session.messages, ...msgs] },
    emitted: [],
  };
}

function resolveNumberedInput(text: string, pending?: PendingAction[]): PendingAction | null {
  if (!pending || pending.length === 0) return null;
  const n = parseInt(text.trim(), 10);
  if (!isNaN(n) && n >= 1 && n <= pending.length) return pending[n - 1];
  const lower = text.trim().toLowerCase();
  return pending.find((p) => p.label.toLowerCase() === lower) ?? null;
}

// ─── Data Formatters ──────────────────────────────────────────────────────

function rolesText(): string {
  const roles = getSuggestedRoles();
  const header = "\ud83d\udcbc *Suggested Internal Roles*\n_Based on your skills and experience:_\n";
  const lines = roles.map((r, i) =>
    `${i + 1}. *${r.title}* — ${r.team}\n   Match: ${progressBar(r.matchPct)}\n   _${r.description}_`
  ).join("\n\n");
  return `${header}\n${lines}`;
}

function readinessText(role: string): string {
  const data = getSkillGaps(role);
  const header = `\ud83c\udfaf *Readiness for ${role}: ${data.readinessPct}%*\n`;
  const barLine = progressBar(data.readinessPct);
  const gapLines = data.gaps.map(
    (g) => `\u2022 *${g.skill}* — Current: ${g.current}/5, Required: ${g.required}/5`
  ).join("\n");
  return `${header}${barLine}\n\n*Top Skill Gaps:*\n${gapLines}`;
}

function coursesText(courses: ReturnType<typeof getLearningCourses>): string {
  return courses.map((c, i) =>
    `${i + 1}. *${c.title}* — ${c.provider} (${c.duration})\n   _${c.description}_`
  ).join("\n\n");
}

function mentorCardText(context: string): string {
  const m = getMentor(context);
  return `\u2b50 *Suggested Mentor*\n\n*${m.name}* — ${m.role}\nExpertise: ${m.expertise}\n\n_\"${m.bio}\"_`;
}

function actionItemsText(): string {
  const items = getActionItems();
  const lines = items.map((a, i) => `${i + 1}. ${a.label}`).join("\n");
  return `\ud83d\udcdd *Your Action Items*\n\n${lines}`;
}

function resourcesText(): string {
  const resources = getTimeManagementResources();
  return resources.map((r, i) =>
    `${i + 1}. *${r.title}* — ${r.provider} (${r.duration})\n   _${r.description}_`
  ).join("\n\n");
}

// ─── Main Engine ──────────────────────────────────────────────────────────

export function csReduceTurn(session: CsWorkflowSession, text: string): TurnResult {
  const trimmed = text.trim();
  if (!trimmed) return { next: session, emitted: [] };

  const cmd = trimmed.toLowerCase();
  const um = userMsg(trimmed);
  const wf = session.activeWorkflow;

  // ─── Global cancel ────────────────────────────────────────────────
  if (cmd === "cancel") {
    return result(session, idleWf(), [um, botMsg("Okay \u2014 cancelled. What would you like to do next?")]);
  }

  // ─── Resolve numbered input ───────────────────────────────────────
  const picked = resolveNumberedInput(trimmed, wf.pendingActions);
  if (picked) {
    const ack = um;
    const key = picked.key;

    // ── Career Discovery actions ──────────────────────────────────
    if (wf.kind === "careerDiscovery") {
      if (key === "career_add_path") {
        return result(session, idleWf(), [ack, botMsg("\u2705 Added to your career plan. Syncing with Cornerstone.\n\nYour manager will be notified about your career interests during your next check-in.\n\nAnything else I can help with?")]);
      }
      if (key === "career_skill_gaps") {
        const roles = getSuggestedRoles();
        const topRole = roles[0];
        const roleName = topRole.title.split(" — ")[0];
        const data = getSkillGaps(roleName);
        const opts: PendingAction[] = [
          { key: "skill_create_plan", label: "Create learning plan" },
          { key: "skill_find_mentor", label: "Find mentor" },
          { key: "skill_track_progress", label: "Track progress" },
        ];
        const nextWf: CsWorkflow = { ...newWf("skillGap"), step: "skill_readiness_shown", meta: { role: roleName }, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${readinessText(roleName)}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "career_recommend_learning") {
        const courses = getLearningCourses();
        const opts: PendingAction[] = [
          { key: "career_enroll", label: "Enroll in course" },
          { key: "career_back_roles", label: "Back to roles" },
        ];
        const nextWf: CsWorkflow = { ...wf, step: "career_learning_shown", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`\ud83d\udcda *Recommended Learning*\n\n${coursesText(courses)}\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "career_enroll") {
        return result(session, idleWf(), [ack, botMsg("\ud83d\udcc5 Enrolled! You're signed up for *Product Strategy Fundamentals*. Calendar invite sent and synced with Cornerstone.\n\nAnything else?")]);
      }
      if (key === "career_back_roles") {
        const opts: PendingAction[] = [
          { key: "career_add_path", label: "Add to career path" },
          { key: "career_skill_gaps", label: "Show skill gaps" },
          { key: "career_recommend_learning", label: "Recommend learning" },
        ];
        const nextWf: CsWorkflow = { ...newWf("careerDiscovery"), step: "career_roles_shown", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${rolesText()}\n\n${fmtOptions(opts)}`)]);
      }
    }

    // ── Skill Gap actions ─────────────────────────────────────────
    if (wf.kind === "skillGap") {
      if (key === "skill_create_plan") {
        return result(session, idleWf(), [ack, botMsg("\u2705 *Learning plan created!*\n\n3 courses have been added to your Cornerstone profile:\n\u2022 Product Strategy Fundamentals (8h)\n\u2022 Data-Driven Decision Making (6h)\n\u2022 Stakeholder Communication Masterclass (4h)\n\nYou'll receive weekly reminders to stay on track.\n\nAnything else?")]);
      }
      if (key === "skill_find_mentor") {
        const opts: PendingAction[] = [
          { key: "skill_request_intro", label: "Request intro" },
          { key: "skill_save_mentor", label: "Save for later" },
        ];
        const nextWf: CsWorkflow = { ...wf, step: "skill_mentor_card", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${mentorCardText("skill")}\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "skill_track_progress") {
        const role = (wf.meta?.role as string) || "Product Manager";
        const data = getSkillGaps(role);
        const opts: PendingAction[] = [
          { key: "skill_back_readiness", label: "Back to readiness" },
        ];
        const nextWf: CsWorkflow = { ...wf, step: "skill_progress", pendingActions: opts };
        const lines = data.gaps.map(
          (g) => `\u2022 *${g.skill}*: ${progressBar(g.current * 20)} \u2192 Target: ${g.required}/5`
        ).join("\n");
        return result(session, nextWf, [ack, botMsg(`\ud83d\udcca *Your Skill Progress*\n\n${lines}\n\n_Synced with Cornerstone. Updated daily._\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "skill_request_intro") {
        const mentor = getMentor("skill");
        return result(session, idleWf(), [ack, botMsg(`\u2709\ufe0f Done! I've sent an introduction request to *${mentor.name}*. They typically respond within 1\u20132 business days.\n\nAnything else?`)]);
      }
      if (key === "skill_save_mentor") {
        const mentor = getMentor("skill");
        return result(session, idleWf(), [ack, botMsg(`\u2b50 Saved *${mentor.name}* to your mentor shortlist.\n\nAnything else?`)]);
      }
      if (key === "skill_back_readiness") {
        const role = (wf.meta?.role as string) || "Product Manager";
        const opts: PendingAction[] = [
          { key: "skill_create_plan", label: "Create learning plan" },
          { key: "skill_find_mentor", label: "Find mentor" },
          { key: "skill_track_progress", label: "Track progress" },
        ];
        const nextWf: CsWorkflow = { ...newWf("skillGap"), step: "skill_readiness_shown", meta: { role }, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${readinessText(role)}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
      }
    }

    // ── Mentorship actions ────────────────────────────────────────
    if (wf.kind === "mentorship") {
      if (key === "mentor_select") {
        const mentor = getMentor("mentorship");
        const opts: PendingAction[] = [
          { key: "mentor_mark_1", label: "Mark item 1 complete" },
          { key: "mentor_mark_2", label: "Mark item 2 complete" },
          { key: "mentor_schedule_followup", label: "Schedule follow-up" },
        ];
        const nextWf: CsWorkflow = { ...wf, step: "mentor_actions", meta: { ...wf.meta, completedItems: 0 }, pendingActions: opts };
        return result(session, nextWf, [
          ack,
          botMsg(`\ud83d\udcc5 Session scheduled with *${mentor.name}* for next Tuesday at 2:00 PM. Calendar invite sent.\n\nHere are your follow-up action items:`),
          botMsg(`${actionItemsText()}\n\n${fmtOptions(opts)}`),
        ]);
      }
      if (key === "mentor_resources") {
        const resources = getTimeManagementResources();
        const opts: PendingAction[] = [
          { key: "mentor_mark_resource", label: "Mark as read" },
          { key: "mentor_back_suggestions", label: "Back to suggestions" },
        ];
        const nextWf: CsWorkflow = { ...wf, step: "mentor_actions", pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`\ud83d\udcda *Learning Resources*\n\n${coursesText(resources)}\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "mentor_mark_1" || key === "mentor_mark_2" || key === "mentor_mark_resource") {
        const prev = ((wf.meta?.completedItems as number) || 0) + 1;
        const total = 3;
        const opts: PendingAction[] = prev >= total
          ? []
          : [
              ...(key !== "mentor_mark_1" ? [{ key: "mentor_mark_1", label: "Mark item 1 complete" }] : []),
              ...(key !== "mentor_mark_2" ? [{ key: "mentor_mark_2", label: "Mark item 2 complete" }] : []),
              { key: "mentor_schedule_followup", label: "Schedule follow-up" },
            ];
        if (prev >= total) {
          return result(session, idleWf(), [ack, botMsg(`\ud83c\udf89 All action items complete! Great progress on improving your time management.\n\nI'll check in again next week. Anything else?`)]);
        }
        const nextWf: CsWorkflow = { ...wf, meta: { ...wf.meta, completedItems: prev }, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`\u2705 Nice work! ${prev} of ${total} action items done.\n\n${fmtOptions(opts)}`)]);
      }
      if (key === "mentor_schedule_followup") {
        return result(session, idleWf(), [ack, botMsg("\ud83d\udcc5 Follow-up scheduled for next week. I'll send you a reminder with your progress summary.\n\nAnything else?")]);
      }
      if (key === "mentor_back_suggestions") {
        const skill = (wf.meta?.skill as string) || "time management";
        const mentor = getMentor("mentorship");
        const opts: PendingAction[] = [
          { key: "mentor_select", label: `Select ${mentor.name} as mentor` },
          { key: "mentor_resources", label: "Start with resources" },
        ];
        const nextWf: CsWorkflow = { ...newWf("mentorship"), step: "mentor_suggestions_shown", meta: { skill }, pendingActions: opts };
        return result(session, nextWf, [ack, botMsg(`${mentorCardText("mentorship")}\n\n\ud83d\udcda *Also recommended:*\n${coursesText(getTimeManagementResources())}\n\n${fmtOptions(opts)}`)]);
      }
    }
  }

  // ─── Active workflow: fallback for free text ──────────────────────
  const hasActive = wf.kind !== "idle";
  if (hasActive) {
    return result(session, wf, [um, botMsg("Pick a numbered option above, or type `cancel` to exit.")]);
  }

  // ─── No active workflow: detect intent ────────────────────────────
  const intent: CsIntent = detectCsIntent(trimmed);

  if (intent.type === "careerDiscovery") {
    const opts: PendingAction[] = [
      { key: "career_add_path", label: "Add to career path" },
      { key: "career_skill_gaps", label: "Show skill gaps" },
      { key: "career_recommend_learning", label: "Recommend learning" },
    ];
    const nextWf: CsWorkflow = { ...newWf("careerDiscovery"), step: "career_roles_shown", pendingActions: opts };
    return result(session, nextWf, [um, botMsg(`${rolesText()}\n\n${fmtOptions(opts)}`)]);
  }

  if (intent.type === "skillGap") {
    const role = intent.role || "Product Manager";
    const opts: PendingAction[] = [
      { key: "skill_create_plan", label: "Create learning plan" },
      { key: "skill_find_mentor", label: "Find mentor" },
      { key: "skill_track_progress", label: "Track progress" },
    ];
    const nextWf: CsWorkflow = { ...newWf("skillGap"), step: "skill_readiness_shown", meta: { role }, pendingActions: opts };
    return result(session, nextWf, [um, botMsg(`${readinessText(role)}\n\nWhat would you like to do?\n\n${fmtOptions(opts)}`)]);
  }

  if (intent.type === "mentorship") {
    const skill = intent.skill || "time management";
    const mentor = getMentor("mentorship");
    const opts: PendingAction[] = [
      { key: "mentor_select", label: `Select ${mentor.name} as mentor` },
      { key: "mentor_resources", label: "Start with resources" },
    ];
    const nextWf: CsWorkflow = { ...newWf("mentorship"), step: "mentor_suggestions_shown", meta: { skill }, pendingActions: opts };
    return result(session, nextWf, [um, botMsg(`I can help with ${skill}! Here's what I found:\n\n${mentorCardText("mentorship")}\n\n\ud83d\udcda *Also recommended:*\n${coursesText(getTimeManagementResources())}\n\n${fmtOptions(opts)}`)]);
  }

  return result(session, idleWf(), [um, botMsg("I can help with: exploring internal career opportunities, checking role readiness and skill gaps, and finding mentors.\n\nTry: \"Explore internal roles\", \"How ready am I for a Product Manager role?\", or \"I need help improving time management\".")]);
}
