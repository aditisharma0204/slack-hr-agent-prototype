"use client";

import type { DemoMessage } from "@/context/DemoDataContext";
import { getMessageAvatarUrl } from "@/context/DemoDataContext";
import { BlockKitRenderer } from "@/components/block-kit/BlockKitRenderer";
import { useSlackbot } from "../../../_context/demo-layout-context";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import Image from "next/image";
import { DemoReactions } from "./DemoReactions";
import { DemoThreadBar } from "./DemoThreadBar";

const T = SLACK_TOKENS;

interface DemoMessageListProps {
  messages: DemoMessage[];
  channelId?: string;
}

export function DemoMessageList({ messages, channelId = "" }: DemoMessageListProps) {
  const { open: openSlackbot } = useSlackbot();
  
  // Always render statically - no animations to prevent scroll jumps

  const handleAction = (actionId: string) => {
    if (actionId === "view_seller_edge") {
      openSlackbot();
    }
  };
  const reversed = [...messages].reverse();

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <p className="text-[15px] text-[#616061]">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
      <div className="space-y-3 flex flex-col">
        {reversed.map((msg) => {
          const avatarUrl = msg.authorImage ?? getMessageAvatarUrl(msg.author);
          const size = T.iconSizes.messageAvatar;
          
          return (
            <div key={msg.id} className="flex gap-3">
              {avatarUrl ? (
                <div
                  className="shrink-0 overflow-hidden"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: `${T.radius.avatar}px`,
                  }}
                >
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={size}
                    height={size}
                    className={`w-full h-full ${avatarUrl.includes("slackbot") ? "object-contain" : "object-cover"}`}
                    unoptimized={avatarUrl.startsWith("/")}
                  />
                </div>
              ) : (
                <div
                  className="shrink-0 flex items-center justify-center text-white text-sm font-semibold"
                  style={{ 
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: T.colors.avatarBg,
                    borderRadius: `${T.radius.avatar}px`
                  }}
                >
                  {msg.author.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-bold text-[15px]" style={{ color: T.colors.text }}>
                    {msg.author}
                  </span>
                  <span className="text-[12px]" style={{ color: T.colors.textSecondary }}>{msg.timestamp}</span>
                </div>
                {msg.blocks ? (
                  <div
                    className="mt-1 px-4 py-3"
                    style={{
                      border: `1px solid ${T.colors.border}`,
                      borderRadius: `${T.radius.large}px`,
                      backgroundColor: T.colors.background
                    }}
                  >
                    <BlockKitRenderer blocks={msg.blocks} onAction={handleAction} />
                  </div>
                ) : (
                  <p className="text-[15px] leading-[1.46668] whitespace-pre-wrap" style={{ color: T.colors.text }}>
                    {msg.body}
                  </p>
                )}
                <DemoReactions reactions={msg.reactions} />
                <DemoThreadBar
                  count={msg.threadCount}
                  lastAuthor={msg.threadLastAuthor}
                  lastAuthorImage={msg.threadLastAuthorImage}
                  lastTimestamp={msg.threadLastTimestamp}
                />
              </div>
            </div>
          );
        })}
        {reversed.length > 0 && (
          <div className="flex items-center gap-4 py-3">
            <div className="h-px flex-1" style={{ backgroundColor: T.colors.border }} />
            <span className="text-[13px] font-medium" style={{ color: T.colors.textSecondary }}>Today</span>
            <div className="h-px flex-1" style={{ backgroundColor: T.colors.border }} />
          </div>
        )}
      </div>
    </div>
  );
}
