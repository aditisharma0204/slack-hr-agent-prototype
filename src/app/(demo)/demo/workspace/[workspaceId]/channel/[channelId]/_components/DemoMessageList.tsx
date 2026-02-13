"use client";

import type { DemoMessage } from "@/context/DemoDataContext";
import { BlockKitRenderer } from "@/components/block-kit/BlockKitRenderer";

interface DemoMessageListProps {
  messages: DemoMessage[];
}

export function DemoMessageList({ messages }: DemoMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
      <div className="space-y-4">
        {[...messages].reverse().map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div
              className="size-9 rounded shrink-0 flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: "#611f69" }}
            >
              {msg.author.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-bold text-[15px] text-[#1d1c1d]">
                  {msg.author}
                </span>
                <span className="text-xs text-[#616061]">{msg.timestamp}</span>
              </div>
              {msg.blocks ? (
                <BlockKitRenderer blocks={msg.blocks} />
              ) : (
                <p className="text-[15px] leading-[1.46668] text-[#1d1c1d] whitespace-pre-wrap">
                  {msg.body}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
