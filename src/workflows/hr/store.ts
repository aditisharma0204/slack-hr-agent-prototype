"use client";

import { atom, useAtom } from "jotai";
import type { HrAgentId, HrChatMessage, HrWorkflow, HrWorkflowSession } from "./types";
import { assetPath } from "@/lib/asset-path";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowLabel() {
  return "Just now";
}

function createIdleWorkflow(): HrWorkflow {
  return {
    id: makeId("wf"),
    kind: "idle",
    step: "start",
    draft: {},
  };
}

function createDefaultSession(agentId: HrAgentId): HrWorkflowSession {
  return {
    agentId,
    composerText: "",
    activeWorkflow: createIdleWorkflow(),
    messages: [
      {
        id: makeId("m"),
        name: "Employee Performance Management Agent",
        avatar: assetPath("/slackbot-logo.svg"),
        time: nowLabel(),
        isBot: true,
        text:
          "Hi — I’m here to help with goals, self-reviews, and performance questions. What would you like to work on today?",
      },
    ],
  };
}

type SessionsByAgent = Record<string, HrWorkflowSession | undefined>;

const hrSessionsAtom = atom<SessionsByAgent>({});

export function useHrSession(agentId: HrAgentId) {
  const [sessions, setSessions] = useAtom(hrSessionsAtom);
  const session = sessions[agentId] ?? createDefaultSession(agentId);

  const updateSession = (updater: (prev: HrWorkflowSession) => HrWorkflowSession) => {
    setSessions((prev) => {
      const current = prev[agentId] ?? createDefaultSession(agentId);
      return { ...prev, [agentId]: updater(current) };
    });
  };

  const appendMessages = (msgs: HrChatMessage[]) => {
    updateSession((prev) => ({ ...prev, messages: [...prev.messages, ...msgs] }));
  };

  const setComposerText = (text: string) => {
    updateSession((prev) => ({ ...prev, composerText: text }));
  };

  const resetComposer = () => {
    updateSession((prev) => ({ ...prev, composerText: "" }));
  };

  const setActiveWorkflow = (workflow: HrWorkflow) => {
    updateSession((prev) => ({ ...prev, activeWorkflow: workflow }));
  };

  return {
    session,
    updateSession,
    appendMessages,
    setComposerText,
    resetComposer,
    setActiveWorkflow,
  };
}

