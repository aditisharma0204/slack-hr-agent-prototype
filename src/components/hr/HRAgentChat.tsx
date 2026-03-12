"use client";

import { useCallback } from "react";
import { UniversalChatSurface } from "@/components/shared/UniversalChatSurface";
import { ChatMessage } from "@/components/shared/ChatMessage";
import { hrReduceTurn, hrHandleAction } from "@/workflows/hr/engine";
import { useHrSession } from "@/workflows/hr/store";
import { assetPath } from "@/lib/asset-path";

export function HRAgentChat({ agentId = "af-employee" }: { agentId?: string }) {
  const { session, updateSession, setComposerText } = useHrSession(agentId);

  const handleAction = useCallback(
    (actionId: string) => {
      updateSession((prev) => hrHandleAction(prev, actionId).next);
    },
    [updateSession]
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <UniversalChatSurface
        title="Employee Performance Management Agent"
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetPath("/slackbot-logo.svg")}
            className="w-5 h-5 rounded"
            alt="Employee Performance Management Agent"
          />
        }
        placeholder="Ask about goals, self-reviews, promotions, or policy…"
        inputValue={session.composerText}
        onInputChange={setComposerText}
        onSendMessage={(text) => {
          updateSession((prev) => hrReduceTurn(prev, text).next);
        }}
      >
        {session.messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={{
              id: m.id,
              name: m.name,
              avatar: m.avatar,
              time: m.time,
              text: m.text,
              blocks: m.blocks,
              isBot: m.isBot,
            }}
            onAction={handleAction}
          />
        ))}
      </UniversalChatSurface>
    </div>
  );
}
