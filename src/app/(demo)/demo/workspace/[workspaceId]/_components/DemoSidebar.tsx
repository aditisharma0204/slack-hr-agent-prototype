"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  IconSearch,
  IconSquare,
  IconLayoutGrid,
  IconFilter,
  IconList,
  IconCopy,
  IconLink,
  IconMoreVertical,
  IconPlus,
  IconFolder,
  IconBookmark,
  IconSettings,
  IconChevronDown,
  IconPencil,
  IconHeadphones,
  IconHome,
} from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoData, getAvatarUrl } from "@/context/DemoDataContext";
import { ActivityListItem } from "./ActivityListItem";
import { useNav, usePresentationMode } from "../_context/demo-layout-context";
import { useActiveChat } from "@/components/presentation/DesktopSlackShell";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

type ViewFilter = "all" | "dms";

const NAV_TITLES: Record<string, string> = {
  home: "Home",
  dms: "Direct Messages",
  activity: "Activity",
  files: "Files",
  later: "Saved",
  agentforce: "Agentforce",
  more: "More",
};

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

export function DemoSidebar() {
  const params = useParams();
  const channelId = (params.channelId as string) || undefined;
  const { activeNav } = useNav();
  const { isPresentationMode } = usePresentationMode();
  const { workspace, channels, dms, files, savedItems, getChannelPreview, isChannelRead } = useDemoData();
  const searchParams = useSearchParams();
  
  // For activity page, check query param for selected channel
  const activityChannelId = activeNav === "activity" ? searchParams.get("channel") : null;
  
  // Calculate effective channel ID - prioritize URL params, then activity query, then first item
  const effectiveChannelId = channelId || activityChannelId;
  
  // Try to get activeChatId from context (for local state navigation)
  let activeChatId: string | undefined;
  let setActiveChatId: ((id: string) => void) | undefined;
  try {
    const chatContext = useActiveChat();
    activeChatId = chatContext.activeChatId;
    setActiveChatId = chatContext.setActiveChatId;
  } catch {
    // Context not available, fall back to URL params
    activeChatId = channelId;
  }
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [search, setSearch] = useState("");
  const [unreadsOnly, setUnreadsOnly] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "compact">("list");

  const showAllDmsTabs = activeNav === "home" || activeNav === "activity" || activeNav === "more";
  const showSearchAndFilters = activeNav !== "files" && activeNav !== "later";
  const isDmView = activeNav === "dms" || activeNav === "agentforce";
  const useDarkTheme = isDmView;

  const channelAndDmItems = (
    filter === "dms"
      ? dms.map((dm) => ({ ...dm, type: "dm" as const }))
      : [...channels.map((ch) => ({ ...ch, type: "channel" as const })), ...dms.map((dm) => ({ ...dm, type: "dm" as const }))]
  ).filter((item) => {
    if (!search) return true;
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const dmsOnly = dms.filter((dm) => {
    if (unreadsOnly && !dm.unread) return false;
    if (!search) return true;
    return dm.name.toLowerCase().includes(search.toLowerCase());
  });

  const agentforceItems = dms.filter((dm) => dm.isSlackbot).filter((dm) => {
    if (unreadsOnly && !dm.unread) return false;
    if (!search) return true;
    return dm.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredFiles = files.filter((f) => {
    if (!search) return true;
    return f.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredSaved = savedItems.filter((s) => {
    if (!search) return true;
    return s.preview.toLowerCase().includes(search.toLowerCase());
  });

  const title = NAV_TITLES[activeNav] ?? "Activity";

  return (
    // Activity view swaps list content only — never changes outer shell
    <aside
      className="w-[340px] flex-shrink-0 flex flex-col h-full border-r"
      style={{
        background: useDarkTheme ? T.colors.dmSidebarBg : "#ffffff",
        borderColor: useDarkTheme ? "transparent" : T.colors.border,
        ...(useDarkTheme && {
          boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06)",
        }),
      }}
    >
      {/* PERMANENT SIDEBAR HEADER - Never disappears, always visible */}
      {isDmView ? (
        <>
          {/* DM Header - Direct messages title row */}
          <div className="px-4 py-4 flex items-center justify-between gap-3 shrink-0">
            <button type="button" className="flex items-center gap-1.5 hover:opacity-90 shrink-0">
              <span className="font-bold text-white whitespace-nowrap" style={{ fontSize: T.typography.header }}>Direct messages</span>
              <IconChevronDown width={14} height={14} className="text-white shrink-0" stroke="currentColor" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-normal">Unreads</span>
              <button
                type="button"
                role="switch"
                aria-checked={unreadsOnly}
                onClick={() => setUnreadsOnly((v) => !v)}
                className="w-9 h-5 rounded-full transition-colors relative"
                style={{ backgroundColor: T.colors.dmToggleTrack }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{
                    left: unreadsOnly ? "18px" : "4px",
                    backgroundColor: unreadsOnly ? T.colors.dmToggleThumbOn : T.colors.dmToggleThumb,
                  }}
                />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-white/10 text-white" title="New message">
                <IconPencil width={16} height={16} stroke="currentColor" />
              </button>
            </div>
          </div>
          {/* DM Search Bar */}
          <div className="px-4 pb-4 shrink-0">
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 focus-within:border-white focus-within:shadow-[0_0_0_1px_#fff,0_0_0_2px_#a189b2,0_0_12px_rgba(161,137,178,0.35)]"
              style={{
                backgroundColor: T.colors.dmSearchBg,
                border: `1px solid ${T.colors.dmSearchGlow}`,
              }}
            >
              <IconSearch width={14} height={14} style={{ color: T.colors.dmSearchPlaceholder }} stroke="currentColor" />
              <input
                type="text"
                placeholder="Find a DM"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 bg-transparent focus:outline-none placeholder:text-[#c1acD1]"
                style={{ color: "#fff", fontSize: T.typography.small }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Non-DM Header - Title row (Home, Activity, etc.) */}
          <div className="px-3 py-3 border-b flex items-center justify-between gap-2 shrink-0" style={{ borderColor: T.colors.border }}>
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ fontSize: T.typography.header, color: T.colors.text }}>{title}</span>
              {(activeNav === "activity" || activeNav === "home") && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded" style={{ backgroundColor: T.colors.betaBadgeBg, color: T.colors.betaBadgeText }}>Beta</span>
              )}
            </div>
            <button type="button" className="p-2 rounded-md hover:bg-[#e8e8e8] ml-auto flex items-center justify-center" style={{ color: "#555" }} title="Settings">
              <IconSettings width={18} height={18} stroke="currentColor" />
            </button>
          </div>

          {/* All/DMs Tabs - Only for Home, Activity, More views */}
          {showAllDmsTabs && (
            <div className="flex items-center gap-1 px-2 py-2 border-b shrink-0" style={{ borderColor: T.colors.border }}>
              <button
                type="button"
                className={cn(
                  "relative px-3 py-1.5 font-medium rounded flex items-center gap-1.5",
                  filter === "all" ? "" : "hover:bg-[#f8f8f8]"
                )}
                style={filter === "all" ? { color: T.colors.text, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
                onClick={() => setFilter("all")}
              >
                All
                <span className="min-w-[18px] h-[18px] px-1.5 flex items-center justify-center rounded-full text-[11px] font-medium text-white" style={{ backgroundColor: T.colors.avatarBg }}>{channelAndDmItems.length}</span>
                {filter === "all" && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: T.colors.avatarBg }} />}
              </button>
              <button
                type="button"
                className={cn(
                  "relative px-3 py-1.5 font-medium rounded",
                  filter === "dms" ? "" : "hover:bg-[#f8f8f8]"
                )}
                style={filter === "dms" ? { color: T.colors.text, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
                onClick={() => setFilter("dms")}
              >
                DMs
                {filter === "dms" && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: T.colors.avatarBg }} />}
              </button>
              <button
                type="button"
                className="p-1.5 rounded hover:bg-[#f8f8f8]"
                style={{ color: T.colors.textSecondary }}
                title="Add"
              >
                <IconPlus width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
              </button>
            </div>
          )}

          {/* Search and Filters Bar - Only for non-Files/Later views */}
          {showSearchAndFilters && (
            <div className="flex items-center gap-1 px-2 py-1.5 border-b shrink-0" style={{ borderColor: T.colors.border }}>
              <button type="button" className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Select">
                <IconSquare width={14} height={14} stroke="currentColor" strokeWidth={2} />
                <span className="w-px h-4" style={{ backgroundColor: T.colors.border }} />
                <IconChevronDown width={12} height={12} stroke="currentColor" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Capture">
                <IconLayoutGrid width={14} height={14} stroke="currentColor" />
              </button>
              <button type="button" className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Filter">
                <IconFilter width={14} height={14} stroke="currentColor" />
                <span className="w-px h-4" style={{ backgroundColor: T.colors.border }} />
                <IconChevronDown width={12} height={12} stroke="currentColor" />
              </button>
              <div className="flex-1" />
              <div className="flex rounded overflow-hidden border" style={{ borderColor: T.colors.border }}>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn("p-1.5", viewMode === "list" ? "bg-[#f0f0f0]" : "hover:bg-[#f8f8f8]")}
                  style={{ color: T.colors.textSecondary }}
                  title="List view"
                >
                  <IconList width={14} height={14} stroke="currentColor" strokeWidth={viewMode === "list" ? 2.5 : 2} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("compact")}
                  className={cn("p-1.5 border-l", viewMode === "compact" ? "bg-[#f0f0f0]" : "hover:bg-[#f8f8f8]")}
                  style={{ borderColor: T.colors.border, color: T.colors.textSecondary }}
                  title="Compact view"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Files/Later Search Bar */}
          {(activeNav === "files" || activeNav === "later") && (
            <div className="px-2 py-1.5 border-b shrink-0" style={{ borderColor: T.colors.border }}>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: T.colors.backgroundAlt }}>
                <IconSearch width={14} height={14} className="shrink-0" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent focus:outline-none"
                  style={{ color: T.colors.text, fontSize: T.typography.small }}
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 p-3 flex flex-col gap-2">
        {activeNav === "files" && filteredFiles.map((file) => {
          const isActive = activeChatId === file.channelId || channelId === file.channelId;
          const className = cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg group w-full transition-colors cursor-pointer",
            isActive ? "" : "hover:bg-[#f0e6f0]"
          );
          const style = {
            ...(isActive ? { backgroundColor: "#ebe0eb", boxShadow: "inset 0 0 0 1px rgba(97,31,105,0.25)" } : {}),
            borderBottom: "1px solid rgba(97,31,105,0.12)",
          };
          
          if (isPresentationMode && setActiveChatId) {
            // In presentation mode, use local state navigation ONLY - no URL updates
            return (
              <div
                key={file.id}
                className={className}
                style={style}
                onClick={() => {
                  setActiveChatId(file.channelId);
                  // DO NOT update URL in presentation mode - causes 404 errors
                }}
              >
                <IconFolder width={16} height={16} className="shrink-0" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                <div className="flex-1 min-w-0">
                  <span className="truncate block" style={{ fontSize: T.typography.body, color: T.colors.text }}>{file.name}</span>
                </div>
                <span className="shrink-0" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{file.timestamp}</span>
              </div>
            );
          }
          
          return (
            <Link
              key={file.id}
              href={`/demo/workspace/${workspace.id}/channel/${file.channelId}`}
              className={className}
              style={style}
            >
              <IconFolder width={16} height={16} className="shrink-0" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
              <div className="flex-1 min-w-0">
                <span className="truncate block" style={{ fontSize: T.typography.body, color: T.colors.text }}>{file.name}</span>
              </div>
              <span className="shrink-0" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{file.timestamp}</span>
            </Link>
          );
        })}
        {activeNav === "later" && filteredSaved.map((saved) => {
          const isActive = activeChatId === saved.channelId || channelId === saved.channelId;
          const className = cn(
            "flex items-start gap-3 px-3 py-2.5 rounded-lg group w-full transition-colors cursor-pointer",
            isActive ? "" : "hover:bg-[#f0e6f0]"
          );
          const style = {
            ...(isActive ? { backgroundColor: "#ebe0eb", boxShadow: "inset 0 0 0 1px rgba(97,31,105,0.25)" } : {}),
            borderBottom: "1px solid rgba(97,31,105,0.12)",
          };
          
          if (isPresentationMode && setActiveChatId) {
            // In presentation mode, use local state navigation ONLY - no URL updates
            return (
              <div
                key={saved.id}
                className={className}
                style={style}
                onClick={() => {
                  setActiveChatId(saved.channelId);
                  // DO NOT update URL in presentation mode - causes 404 errors
                }}
              >
                <IconBookmark width={16} height={16} className="shrink-0 mt-0.5" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                <div className="flex-1 min-w-0">
                  <p className="min-w-0 line-clamp-2 break-words" style={{ fontSize: T.typography.small, color: T.colors.text }}>{saved.preview}</p>
                </div>
                <span className="shrink-0" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{saved.timestamp}</span>
              </div>
            );
          }
          
          return (
            <Link
              key={saved.id}
              href={`/demo/workspace/${workspace.id}/channel/${saved.channelId}`}
              className={className}
              style={style}
            >
              <IconBookmark width={16} height={16} className="shrink-0 mt-0.5" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
              <div className="flex-1 min-w-0">
                <p className="min-w-0 line-clamp-2 break-words" style={{ fontSize: T.typography.small, color: T.colors.text }}>{saved.preview}</p>
              </div>
              <span className="shrink-0" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{saved.timestamp}</span>
            </Link>
          );
        })}
        {activeNav === "dms" && dmsOnly.map((item, index) => {
          // Check if this is the active item: URL match, context match, or first item if nothing selected
          const isActive = activeChatId === item.id || effectiveChannelId === item.id || (!effectiveChannelId && !activeChatId && index === 0);
          const { preview, timestamp } = getChannelPreview(item.id);
          const avatarSrc = item.isSlackbot ? "/slackbot-logo.svg" : (item.avatarUrl || getAvatarUrl(item.name, 64));
          const className = cn(
            "flex items-start gap-3 px-3 py-2.5 rounded-lg group w-full transition-colors cursor-pointer",
            isActive ? "" : "hover:bg-[#52215A]"
          );
          const style = {
            ...(isActive ? { backgroundColor: T.colors.dmSidebarSelect } : openDropdownId === item.id ? { backgroundColor: "#52215A" } : {}),
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          };
          
          if (isPresentationMode && setActiveChatId) {
            // In presentation mode, use local state navigation ONLY - no URL updates
            // URL updates cause Next.js to try to navigate to routes that don't exist in presentation mode
            return (
              <div
                key={item.id}
                className={className}
                style={style}
                onClick={() => {
                  setActiveChatId(item.id);
                  // DO NOT update URL in presentation mode - causes 404 errors
                  // The prototype is rendered in SceneLayout on root "/" route, not on /demo routes
                }}
              >
              <div className="relative shrink-0 mt-0.5">
                <img src={avatarSrc} alt="" className={`w-8 h-8 rounded-md ${item.isSlackbot ? "object-contain" : "object-cover"}`} />
                <StatusDot status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-white" style={{ fontSize: T.typography.body }}>{item.name}</span>
                </div>
                {preview && (
                  <p className="mt-0.5 min-w-0 line-clamp-2 break-words" style={{ color: T.colors.dmMutedText }}>{preview}</p>
                )}
              </div>
              {/* On hover: white action card (bookmark + more); otherwise timestamp. Keep visible when dropdown open. */}
              <div className="shrink-0 mt-0.5 w-[72px] flex justify-end items-center" onClick={(e) => e.stopPropagation()}>
                <div className={cn("items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-sm", (openDropdownId === item.id ? "flex" : "hidden group-hover:flex"))}>
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="Save for later">
                    <IconBookmark width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                  </button>
                  <DropdownMenu modal={false} open={openDropdownId === item.id} onOpenChange={(open) => setOpenDropdownId(open ? item.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="More options">
                        <IconMoreVertical width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 bg-white rounded-lg shadow-lg border border-gray-200" sideOffset={4}>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconSquare width={14} height={14} stroke="currentColor" />
                        Mark as unread
                        <DropdownMenuShortcut>U</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconBookmark width={14} height={14} stroke="currentColor" />
                        Save for later
                        <DropdownMenuShortcut>A</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                          Remind me about this
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer text-sm">In 20 minutes</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">In 1 hour</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">In 3 hours</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Tomorrow</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Next week</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Custom...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                          Copy
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy name</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy link</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy huddle link</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconHome width={14} height={14} stroke="currentColor" />
                        Open in home
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconLayoutGrid width={14} height={14} stroke="currentColor" />
                        Open in split view
                        <DropdownMenuShortcut>⌘ Opt Click</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconLink width={14} height={14} stroke="currentColor" />
                        Open in new window
                        <DropdownMenuShortcut>⌘ Click</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {timestamp && (
                  <span className={cn("text-right", openDropdownId === item.id ? "hidden" : "group-hover:hidden")} style={{ fontSize: T.typography.smaller, color: T.colors.dmMutedText }}>{timestamp}</span>
                )}
              </div>
              </div>
            );
          }
          
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={className}
              style={style}
            >
              <div className="relative shrink-0 mt-0.5">
                <img src={avatarSrc} alt="" className={`w-8 h-8 rounded-md ${item.isSlackbot ? "object-contain" : "object-cover"}`} />
                <StatusDot status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-white" style={{ fontSize: T.typography.body }}>{item.name}</span>
                </div>
                {preview && (
                  <p className="mt-0.5 min-w-0 line-clamp-2 break-words" style={{ color: T.colors.dmMutedText }}>{preview}</p>
                )}
              </div>
              {/* On hover: white action card (bookmark + more); otherwise timestamp. Keep visible when dropdown open. */}
              <div className="shrink-0 mt-0.5 w-[72px] flex justify-end items-center" onClick={(e) => e.stopPropagation()}>
                <div className={cn("items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-sm", (openDropdownId === item.id ? "flex" : "hidden group-hover:flex"))}>
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="Save for later">
                    <IconBookmark width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                  </button>
                  <DropdownMenu modal={false} open={openDropdownId === item.id} onOpenChange={(open) => setOpenDropdownId(open ? item.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="More options">
                        <IconMoreVertical width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 bg-white rounded-lg shadow-lg border border-gray-200" sideOffset={4}>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconSquare width={14} height={14} stroke="currentColor" />
                        Mark as unread
                        <DropdownMenuShortcut>U</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconBookmark width={14} height={14} stroke="currentColor" />
                        Save for later
                        <DropdownMenuShortcut>A</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                          Remind me about this
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer text-sm">In 20 minutes</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">In 1 hour</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">In 3 hours</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Tomorrow</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Next week</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Custom...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                          Copy
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy name</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy link</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy huddle link</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconHome width={14} height={14} stroke="currentColor" />
                        Open in home
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconLayoutGrid width={14} height={14} stroke="currentColor" />
                        Open in split view
                        <DropdownMenuShortcut>⌘ Opt Click</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconLink width={14} height={14} stroke="currentColor" />
                        Open in new window
                        <DropdownMenuShortcut>⌘ Click</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {timestamp && (
                  <span className={cn("text-right", openDropdownId === item.id ? "hidden" : "group-hover:hidden")} style={{ fontSize: T.typography.smaller, color: T.colors.dmMutedText }}>{timestamp}</span>
                )}
              </div>
            </Link>
          );
        })}
        {activeNav === "agentforce" && agentforceItems.map((item) => {
          const isActive = activeChatId === item.id || channelId === item.id;
          const { preview, timestamp } = getChannelPreview(item.id);
          const avatarSrc = item.isSlackbot ? "/slackbot-logo.svg" : (item.avatarUrl || getAvatarUrl(item.name, 64));
          const className = cn(
            "flex items-start gap-3 px-3 py-2.5 rounded-lg group w-full transition-colors cursor-pointer",
            isActive ? "" : "hover:bg-[#52215A]"
          );
          const style = {
            ...(isActive ? { backgroundColor: T.colors.dmSidebarSelect } : openDropdownId === item.id ? { backgroundColor: "#52215A" } : {}),
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          };
          
          if (isPresentationMode && setActiveChatId) {
            // In presentation mode, use local state navigation ONLY - no URL updates
            return (
              <div
                key={item.id}
                className={className}
                style={style}
                onClick={() => {
                  setActiveChatId(item.id);
                  // DO NOT update URL in presentation mode - causes 404 errors
                }}
              >
                <div className="relative shrink-0 mt-0.5">
                  <img src={avatarSrc} alt="" className={`w-8 h-8 rounded-md ${item.isSlackbot ? "object-contain" : "object-cover"}`} />
                  <StatusDot status={item.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="truncate font-medium text-white" style={{ fontSize: T.typography.body }}>{item.name}</span>
                  </div>
                  {preview && (
                    <p className="mt-0.5 min-w-0 line-clamp-2 break-words" style={{ color: T.colors.dmMutedText }}>{preview}</p>
                  )}
                </div>
                <div className="shrink-0 mt-0.5 w-[72px] flex justify-end items-center" onClick={(e) => e.stopPropagation()}>
                  <div className={cn("items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-sm", (openDropdownId === item.id ? "flex" : "hidden group-hover:flex"))}>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="Save for later">
                      <IconBookmark width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                    </button>
                    <DropdownMenu modal={false} open={openDropdownId === item.id} onOpenChange={(open) => setOpenDropdownId(open ? item.id : null)}>
                      <DropdownMenuTrigger asChild>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="More options">
                          <IconMoreVertical width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="right" className="w-56 bg-white rounded-lg shadow-lg border border-gray-200" sideOffset={4}>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                          <IconSquare width={14} height={14} stroke="currentColor" />
                          Mark as unread
                          <DropdownMenuShortcut>U</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                          <IconBookmark width={14} height={14} stroke="currentColor" />
                          Save for later
                          <DropdownMenuShortcut>A</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                            Remind me about this
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                            <DropdownMenuItem className="cursor-pointer text-sm">In 20 minutes</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">In 1 hour</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">In 3 hours</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">Tomorrow</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">Next week</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">Custom...</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                            Copy
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                            <DropdownMenuItem className="cursor-pointer text-sm">Copy name</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">Copy link</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">Copy huddle link</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                          <IconHome width={14} height={14} stroke="currentColor" />
                          Open in home
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                          <IconLayoutGrid width={14} height={14} stroke="currentColor" />
                          Open in split view
                          <DropdownMenuShortcut>⌘ Opt Click</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                          <IconLink width={14} height={14} stroke="currentColor" />
                          Open in new window
                          <DropdownMenuShortcut>⌘ Click</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {timestamp && (
                    <span className={cn("text-right", openDropdownId === item.id ? "hidden" : "group-hover:hidden")} style={{ fontSize: T.typography.smaller, color: T.colors.dmMutedText }}>{timestamp}</span>
                  )}
                </div>
              </div>
            );
          }
          
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={className}
              style={style}
            >
              <div className="relative shrink-0 mt-0.5">
                <img src={avatarSrc} alt="" className={`w-8 h-8 rounded-md ${item.isSlackbot ? "object-contain" : "object-cover"}`} />
                <StatusDot status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-white" style={{ fontSize: T.typography.body }}>{item.name}</span>
                </div>
                {preview && (
                  <p className="mt-0.5 min-w-0 line-clamp-2 break-words" style={{ color: T.colors.dmMutedText }}>{preview}</p>
                )}
              </div>
              <div className="shrink-0 mt-0.5 w-[72px] flex justify-end items-center" onClick={(e) => e.stopPropagation()}>
                <div className={cn("items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-sm", (openDropdownId === item.id ? "flex" : "hidden group-hover:flex"))}>
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="Save for later">
                    <IconBookmark width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                  </button>
                  <DropdownMenu modal={false} open={openDropdownId === item.id} onOpenChange={(open) => setOpenDropdownId(open ? item.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-0.5 rounded hover:bg-gray-100" title="More options">
                        <IconMoreVertical width={14} height={14} style={{ color: "#1d1c1d" }} stroke="currentColor" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 bg-white rounded-lg shadow-lg border border-gray-200" sideOffset={4}>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconSquare width={14} height={14} stroke="currentColor" />
                        Mark as unread
                        <DropdownMenuShortcut>U</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconBookmark width={14} height={14} stroke="currentColor" />
                        Save for later
                        <DropdownMenuShortcut>A</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                          Remind me about this
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer text-sm">In 20 minutes</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">In 1 hour</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">In 3 hours</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Tomorrow</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Next week</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Custom...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer text-sm text-[#1d1c1d]">
                          Copy
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy name</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy link</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-sm">Copy huddle link</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconHome width={14} height={14} stroke="currentColor" />
                        Open in home
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconLayoutGrid width={14} height={14} stroke="currentColor" />
                        Open in split view
                        <DropdownMenuShortcut>⌘ Opt Click</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-sm text-[#1d1c1d]">
                        <IconLink width={14} height={14} stroke="currentColor" />
                        Open in new window
                        <DropdownMenuShortcut>⌘ Click</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {timestamp && (
                  <span className={cn("text-right", openDropdownId === item.id ? "hidden" : "group-hover:hidden")} style={{ fontSize: T.typography.smaller, color: T.colors.dmMutedText }}>{timestamp}</span>
                )}
              </div>
            </Link>
          );
        })}
        {(activeNav === "home" || activeNav === "activity" || activeNav === "more") && channelAndDmItems.map((item) => {
          // Use activeChatId from context if available, otherwise fall back to effectiveChannelId
          const itemIsActive = activeChatId === item.id || effectiveChannelId === item.id;
          return (
            <ActivityListItem
              key={item.id}
              item={{
                id: item.id,
                name: item.name,
                type: item.type,
                avatarUrl: "avatarUrl" in item ? item.avatarUrl : undefined,
                status: "status" in item ? item.status : undefined,
                unread: ("unread" in item ? item.unread : false) && !isChannelRead(item.id),
              }}
              isActive={itemIsActive}
              workspaceId={workspace.id}
            />
          );
        })}
      </div>
    </aside>
  );
}
