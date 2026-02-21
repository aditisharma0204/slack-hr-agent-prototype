"use client";

import { SLACK_TOKENS } from "@/design/slack-tokens";
import type { DemoReaction } from "@/context/DemoDataContext";

const T = SLACK_TOKENS;

interface DemoReactionsProps {
  reactions?: DemoReaction[];
}

export function DemoReactions({ reactions }: DemoReactionsProps) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-1 mb-1 flex-wrap">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          className="h-6 px-2 rounded-full bg-slate-200/70 border border-transparent hover:bg-slate-300/70 text-slate-800 flex items-center gap-x-1 transition-colors"
          style={{ fontSize: "13px" }}
        >
          <span>{reaction.emoji}</span>
          <span className="text-xs font-semibold" style={{ color: T.colors.textSecondary }}>
            {reaction.count}
          </span>
        </button>
      ))}
    </div>
  );
}
