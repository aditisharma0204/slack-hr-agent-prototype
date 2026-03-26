"use client";

import { atom, useAtom } from "jotai";
import type { CsAgentId, CsChatMessage, CsWorkflow, CsWorkflowSession } from "./types";
import { assetPath } from "@/lib/asset-path";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createIdleWorkflow(): CsWorkflow {
  return {
    id: makeId("wf"),
    kind: "idle",
    step: "start",
  };
}

function createDefaultSession(agentId: CsAgentId): CsWorkflowSession {
  return {
    agentId,
    composerText: "",
    phase: "welcome",
    activeWorkflow: createIdleWorkflow(),
    messages: [
      {
        id: makeId("m"),
        name: "Employee Agent",
        avatar: assetPath("/single-person.png"),
        time: "Just now",
        isBot: true,
        tag: "AGENTFORCE",
        text: "Hi \u2014 I'm here to help with career development, skill growth, and mentorship. Powered by Cornerstone OnDemand.\n\nWhat would you like to work on today?",
      },
    ],
  };
}

type SessionsByAgent = Record<string, CsWorkflowSession | undefined>;

const csSessionsAtom = atom<SessionsByAgent>({});

export function useCsSession(agentId: CsAgentId) {
  const [sessions, setSessions] = useAtom(csSessionsAtom);
  const session = sessions[agentId] ?? createDefaultSession(agentId);

  const updateSession = (updater: (prev: CsWorkflowSession) => CsWorkflowSession) => {
    setSessions((prev) => {
      const current = prev[agentId] ?? createDefaultSession(agentId);
      return { ...prev, [agentId]: updater(current) };
    });
  };

  const appendMessages = (msgs: CsChatMessage[]) => {
    updateSession((prev) => ({ ...prev, messages: [...prev.messages, ...msgs] }));
  };

  const setComposerText = (text: string) => {
    updateSession((prev) => ({ ...prev, composerText: text }));
  };

  const resetComposer = () => {
    updateSession((prev) => ({ ...prev, composerText: "" }));
  };

  const setActiveWorkflow = (workflow: CsWorkflow) => {
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
