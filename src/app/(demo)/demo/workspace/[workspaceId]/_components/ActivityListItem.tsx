"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconHashtag, IconHeadphones } from "@/components/icons";
import { useDemoData, getAvatarUrl } from "@/context/DemoDataContext";
import { usePresentationMode, useNav } from "../_context/demo-layout-context";
import { useActiveChat } from "@/components/presentation/DesktopSlackShell";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

export type ActivityListItemData = {
  id: string;
  name: string;
  type: "channel" | "dm";
  avatarUrl?: string;
  status?: "online" | "away" | "dnd" | "call";
  unread?: boolean;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusDot({ status }: { status?: "online" | "away" | "dnd" | "call" }) {
  if (!status) return null;
  if (status === "online")
    return <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500" />;
  if (status === "away")
    return <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-400" />;
  if (status === "dnd")
    return <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-red-500" />;
  if (status === "call")
    return (
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 flex items-center justify-center rounded bg-gray-600">
        <IconHeadphones width={10} height={10} className="text-white" stroke="currentColor" />
      </span>
    );
  return null;
}

export function ActivityListItem({
  item,
  isActive,
  workspaceId,
}: {
  item: ActivityListItemData;
  isActive: boolean;
  workspaceId: string;
}) {
  const { getChannelPreview } = useDemoData();
  const { isPresentationMode } = usePresentationMode();
  const { activeNav } = useNav();
  const searchParams = useSearchParams();
  const { preview, timestamp } = getChannelPreview(item.id);
  const displayName = item.type === "channel" ? `#${item.name}` : item.name;
  const avatarSrc = item.type === "dm" ? (item.avatarUrl || getAvatarUrl(item.name, 64)) : null;
  
  // Check if this item is active based on URL query param (for activity page)
  const activeChannelId = searchParams.get("channel");
  const isActiveFromQuery = activeNav === "activity" && activeChannelId === item.id;
  const finalIsActive = isActive || isActiveFromQuery;

  const isUnread = item.unread === true;
  const className = "flex items-start gap-3 px-3 py-2.5 rounded-lg group w-full transition-colors";
  const style: React.CSSProperties = finalIsActive
    ? { backgroundColor: "#f0f0f0", border: "2px solid #78317F" }
    : {
        border: "1px solid",
        borderColor: isUnread ? "#E6E6E6" : "#E0E0E0",
        ...(isUnread && { borderLeft: "2px solid #78317F" }),
        backgroundColor: isUnread ? "#ffffff" : "#F7F7F7",
      };

  if (isPresentationMode) {
    // Try to get setActiveChatId from context
    let setActiveChatId: ((id: string) => void) | undefined;
    try {
      const chatContext = useActiveChat();
      setActiveChatId = chatContext.setActiveChatId;
    } catch {
      // Context not available (component used outside DesktopSlackShell)
    }
    
    return (
      <div
        className={`${className} cursor-pointer`}
        style={style}
        onClick={() => {
          if (setActiveChatId) {
            setActiveChatId(item.id);
            const newPath = `/demo/workspace/${workspaceId}/channel/${item.id}`;
            if (typeof window !== "undefined") {
              window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, "", newPath);
            }
          }
        }}
      >
      <div className="relative shrink-0 mt-0.5">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="w-8 h-8 rounded-md object-cover" />
        ) : (
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-white text-xs font-semibold"
            style={{ backgroundColor: T.colors.avatarBg }}
          >
            {getInitials(item.name)}
          </div>
        )}
        {item.type === "channel" ? (
          <div className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full bg-[#616061] flex items-center justify-center">
            <IconHashtag width={8} height={8} className="text-white" stroke="currentColor" strokeWidth={2.5} />
          </div>
        ) : (
          <StatusDot status={item.status} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="truncate font-medium" style={{ fontSize: T.typography.body, color: T.colors.text }}>
            {displayName}
          </span>
        </div>
        {preview && (
          <p className="mt-0.5 min-w-0 line-clamp-2 break-words" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>
            {preview}
          </p>
        )}
      </div>
      {timestamp && (
        <span className="shrink-0 mt-0.5" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>
          {timestamp}
        </span>
      )}
      </div>
    );
  }

  // Determine the correct href based on activeNav
  const getHref = () => {
    // If we're in activity mode, use the activity page with channel query param
    if (activeNav === "activity") {
      return `/demo/workspace/${workspaceId}/activity?channel=${item.id}`;
    }
    // Otherwise, use the standard channel route
    return `/demo/workspace/${workspaceId}/channel/${item.id}`;
  };

  return (
    <Link
      href={getHref()}
      className={className}
      style={style}
    >
      <div className="relative shrink-0 mt-0.5">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="w-8 h-8 rounded-md object-cover" />
        ) : (
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-white text-xs font-semibold"
            style={{ backgroundColor: T.colors.avatarBg }}
          >
            {getInitials(item.name)}
          </div>
        )}
        {item.type === "channel" ? (
          <div className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full bg-[#616061] flex items-center justify-center">
            <IconHashtag width={8} height={8} className="text-white" stroke="currentColor" strokeWidth={2.5} />
          </div>
        ) : (
          <StatusDot status={item.status} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="truncate font-medium" style={{ fontSize: T.typography.body, color: T.colors.text }}>
            {displayName}
          </span>
        </div>
        {preview && (
          <p className="mt-0.5 min-w-0 line-clamp-2 break-words" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>
            {preview}
          </p>
        )}
      </div>
      {timestamp && (
        <span className="shrink-0 mt-0.5" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>
          {timestamp}
        </span>
      )}
    </Link>
  );
}
