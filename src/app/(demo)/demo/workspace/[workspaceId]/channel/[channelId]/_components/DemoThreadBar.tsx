"use client";

import { SLACK_TOKENS } from "@/design/slack-tokens";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getMessageAvatarUrl } from "@/context/DemoDataContext";

const T = SLACK_TOKENS;

interface DemoThreadBarProps {
  count?: number;
  lastAuthor?: string;
  lastAuthorImage?: string | null;
  lastTimestamp?: string;
  onClick?: () => void;
}

export function DemoThreadBar({
  count,
  lastAuthor,
  lastAuthorImage,
  lastTimestamp,
  onClick,
}: DemoThreadBarProps) {
  if (!count || count === 0) return null;

  const avatarUrl = lastAuthorImage ?? (lastAuthor ? getMessageAvatarUrl(lastAuthor) : null);
  const avatarFallback = lastAuthor?.charAt(0).toUpperCase() || "?";

  return (
    <button
      onClick={onClick}
      className="mt-1 p-1 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {avatarUrl ? (
          <div
            className="shrink-0 overflow-hidden"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: `${T.radius.avatar}px`,
            }}
          >
            <Image
              src={avatarUrl}
              alt=""
              width={24}
              height={24}
              className={`w-full h-full ${avatarUrl.includes("slackbot") ? "object-contain" : "object-cover"}`}
              unoptimized={avatarUrl.startsWith("/")}
            />
          </div>
        ) : (
          <div
            className="shrink-0 flex items-center justify-center text-white text-xs font-semibold"
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: T.colors.avatarBg,
              borderRadius: `${T.radius.avatar}px`,
            }}
          >
            {avatarFallback}
          </div>
        )}
        <span className="text-xs font-semibold truncate" style={{ color: "#1264a3" }}>
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        {lastTimestamp && (
          <span className="text-xs truncate group-hover/thread-bar:hidden block" style={{ color: T.colors.textSecondary }}>
            Last reply {lastTimestamp}
          </span>
        )}
        <span className="text-xs truncate group-hover/thread-bar:block hidden" style={{ color: T.colors.textSecondary }}>
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" style={{ color: T.colors.textSecondary }} />
    </button>
  );
}
