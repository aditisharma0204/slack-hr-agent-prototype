"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconHeadphones } from "@/components/icons";
import { useDemoData, getAvatarUrl } from "@/context/DemoDataContext";
import { usePresentationMode, useNav } from "../_context/demo-layout-context";
import { useActiveChat } from "@/components/presentation/SlackAppShell";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { assetPath } from "@/lib/asset-path";

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
  const displayName = item.name;
  const avatarSrc = item.type === "dm" ? assetPath(item.avatarUrl || getAvatarUrl(item.name, 64)) : null;

  // Check if this item is active based on URL query param (for activity page)
  const activeChannelId = searchParams.get("channel");
  const isActiveFromQuery = activeNav === "activity" && activeChannelId === item.id;
  const finalIsActive = isActive || isActiveFromQuery;

  const isUnread = item.unread === true;
  const className = "flex items-start gap-3 px-3 py-2.5 rounded-lg group w-full transition-colors cursor-pointer";
  const style: React.CSSProperties = finalIsActive
    ? { backgroundColor: "#f0f0f0", border: "2px solid #78317F" }
    : {
        border: "1px solid",
        borderColor: isUnread ? "#E6E6E6" : "#E0E0E0",
        ...(isUnread && { borderLeft: "2px solid #78317F" }),
        backgroundColor: isUnread ? "#ffffff" : "#F7F7F7",
      };

  if (isPresentationMode) {
    // Try to get activeChatId and setActiveChatId from context
    let activeChatId: string | undefined;
    let setActiveChatId: ((id: string) => void) | undefined;
    try {
      const chatContext = useActiveChat();
      activeChatId = chatContext.activeChatId;
      setActiveChatId = chatContext.setActiveChatId;
    } catch {
      // Context not available (component used outside DesktopSlackShell)
    }
    
    // Use activeChatId from context for isActive check in presentation mode
    const finalIsActiveInPresentation = isActive || activeChatId === item.id;
    const finalStyle: React.CSSProperties = finalIsActiveInPresentation
      ? { backgroundColor: "#f0f0f0", border: "2px solid #78317F" }
      : {
          border: "1px solid",
          borderColor: isUnread ? "#E6E6E6" : "#E0E0E0",
          ...(isUnread && { borderLeft: "2px solid #78317F" }),
          backgroundColor: isUnread ? "#ffffff" : "#F7F7F7",
        };
    
    return (
      <div
        className={className}
        style={finalStyle}
        onClick={() => {
          if (setActiveChatId) {
            setActiveChatId(item.id);
            // DO NOT update URL in presentation mode - causes 404 errors
            // The prototype is rendered in SceneLayout on root "/" route, not on /demo routes
          } else {
            // Fallback: try to update URL query param if in activity mode
            if (activeNav === "activity" && typeof window !== "undefined") {
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set("channel", item.id);
              window.history.pushState({}, "", currentUrl.toString());
              window.dispatchEvent(new PopStateEvent("popstate"));
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
        {item.type === "channel" ? null : (
          <StatusDot status={item.status} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {item.type === "channel" && (
            <img
              src={assetPath("/Salesforce.png")}
              alt="channel"
              className="w-3.5 h-3.5 object-contain opacity-70 grayscale shrink-0"
            />
          )}
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
        {item.type === "channel" ? null : (
          <StatusDot status={item.status} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {item.type === "channel" && (
            <img
              src={assetPath("/Salesforce.png")}
              alt="channel"
              className="w-3.5 h-3.5 object-contain opacity-70 grayscale shrink-0"
            />
          )}
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
