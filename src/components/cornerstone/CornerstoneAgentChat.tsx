"use client";

import { useCallback } from "react";
import { UniversalChatSurface } from "@/components/shared/UniversalChatSurface";
import { ChatMessage } from "@/components/shared/ChatMessage";
import { StarterPromptChips } from "@/components/hr/StarterPromptChips";
import { csReduceTurn } from "@/workflows/cornerstone/engine";
import { useCsSession } from "@/workflows/cornerstone/store";
import { assetPath } from "@/lib/asset-path";

const STARTER_PROMPTS = [
  "Explore internal roles",
  "How ready am I for a Product Manager role?",
  "I need help improving time management",
];

export function CornerstoneAgentChat({ agentId = "af-employee-cs" }: { agentId?: string }) {
  const { session, updateSession, setComposerText } = useCsSession(agentId);

  const handleSend = useCallback(
    (text: string) => {
      updateSession((prev) => csReduceTurn(prev, text).next);
    },
    [updateSession],
  );

  const isWelcome = session.phase === "welcome";

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <UniversalChatSurface
        title="Employee Agent"
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetPath("/single-person.png")}
            className="w-5 h-5 rounded"
            alt="Employee Agent"
          />
        }
        placeholder="Ask about careers, skills, mentorship, or learning\u2026"
        inputValue={session.composerText}
        onInputChange={setComposerText}
        onSendMessage={handleSend}
      >
        {session.messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isWelcome && (
          <StarterPromptChips prompts={STARTER_PROMPTS} onSelect={handleSend} />
        )}
      </UniversalChatSurface>
    </div>
  );
}
