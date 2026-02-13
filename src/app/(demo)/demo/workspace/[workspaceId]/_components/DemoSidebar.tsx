"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  IconChevronDown,
  IconPencil,
  IconMessage,
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
import { useNav } from "../_context/demo-layout-context";
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
  const channelId = params.channelId as string;
  const { activeNav } = useNav();
  const { workspace, channels, dms, files, savedItems, getChannelPreview } = useDemoData();
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [search, setSearch] = useState("");
  const [unreadsOnly, setUnreadsOnly] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
    if (!search) return true;
    return dm.name.toLowerCase().includes(search.toLowerCase());
  });

  const agentforceItems = dms.filter((dm) => dm.isSlackbot).filter((dm) => {
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
    <aside
      className="w-[260px] flex-shrink-0 flex flex-col border-r"
      style={{
        background: useDarkTheme ? T.colors.dmSidebarBg : T.colors.activitySidebar,
        borderColor: useDarkTheme ? "transparent" : T.colors.border,
        ...(useDarkTheme && {
          boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06)",
        }),
      }}
    >
      {/* DM-specific header: Direct messages + dropdown, Unreads toggle, edit icon */}
      {isDmView ? (
        <>
          <div className="px-3 py-3 flex items-center justify-between gap-2">
            <button type="button" className="flex items-center gap-1 hover:opacity-90">
              <IconMessage width={18} height={18} className="text-white shrink-0" stroke="currentColor" />
              <span className="font-bold text-white" style={{ fontSize: T.typography.header }}>Direct messages</span>
              <IconChevronDown width={14} height={14} className="text-white shrink-0" stroke="currentColor" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">Unreads</span>
              <button
                type="button"
                role="switch"
                aria-checked={unreadsOnly}
                onClick={() => setUnreadsOnly((v) => !v)}
                className={cn(
                  "w-9 h-5 rounded-full transition-colors relative",
                  unreadsOnly ? "" : ""
                )}
                style={{ backgroundColor: unreadsOnly ? T.colors.dmToggleThumb : T.colors.dmToggleTrack }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ left: unreadsOnly ? "18px" : "4px" }}
                />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-white/10 text-white" title="New message">
                <IconPencil width={16} height={16} stroke="currentColor" />
              </button>
            </div>
          </div>
          <div className="px-2 pb-2">
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded"
              style={{ backgroundColor: T.colors.dmSearchBg, border: "1px solid #714674" }}
            >
              <IconSearch width={14} height={14} style={{ color: T.colors.dmSearchPlaceholder }} stroke="currentColor" />
              <input
                type="text"
                placeholder="Find a DM"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 bg-transparent focus:outline-none placeholder:text-[#AA81AB]"
                style={{ color: "#fff", fontSize: T.typography.small }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-3 py-3 border-b flex items-center gap-2" style={{ borderColor: T.colors.border }}>
            <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>{title}</span>
            {(activeNav === "activity" || activeNav === "home") && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded" style={{ backgroundColor: T.colors.betaBadgeBg, color: T.colors.betaBadgeText }}>Beta</span>
            )}
          </div>

          {showAllDmsTabs && (
      <div className="flex items-center gap-1 px-2 py-2 border-b" style={{ borderColor: T.colors.border }}>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 font-medium rounded",
            filter === "all" ? "" : "hover:bg-[#f8f8f8]"
          )}
          style={filter === "all" ? { backgroundColor: T.colors.backgroundAlt, color: T.colors.text, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 font-medium rounded",
            filter === "dms" ? "" : "hover:bg-[#f8f8f8]"
          )}
          style={filter === "dms" ? { backgroundColor: T.colors.backgroundAlt, color: T.colors.text, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
          onClick={() => setFilter("dms")}
        >
          DMs
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

      {showSearchAndFilters && (
      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: T.colors.border }}>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Checkbox">
          <IconSquare width={14} height={14} stroke="currentColor" strokeWidth={2} />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Grid">
          <IconLayoutGrid width={14} height={14} stroke="currentColor" />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Filter">
          <IconFilter width={14} height={14} stroke="currentColor" />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="List">
          <IconList width={14} height={14} stroke="currentColor" />
        </button>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: T.colors.backgroundAlt }}>
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

      {(activeNav === "files" || activeNav === "later") && (
        <div className="px-2 py-1.5 border-b" style={{ borderColor: T.colors.border }}>
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

      <div className="flex-1 overflow-y-auto min-h-0 py-1">
        {activeNav === "files" && filteredFiles.map((file) => (
          <Link
            key={file.id}
            href={`/demo/workspace/${workspace.id}/channel/${file.channelId}`}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 mx-1 rounded group",
              channelId === file.channelId ? "" : "hover:bg-[#f8f8f8]"
            )}
            style={channelId === file.channelId ? { backgroundColor: T.colors.backgroundAlt, boxShadow: `inset 0 0 0 1px ${T.colors.border}` } : {}}
          >
            <IconFolder width={16} height={16} className="shrink-0" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
            <div className="flex-1 min-w-0">
              <span className="truncate block" style={{ fontSize: T.typography.body, color: T.colors.text }}>{file.name}</span>
            </div>
            <span className="shrink-0" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{file.timestamp}</span>
          </Link>
        ))}
        {activeNav === "later" && filteredSaved.map((saved) => (
          <Link
            key={saved.id}
            href={`/demo/workspace/${workspace.id}/channel/${saved.channelId}`}
            className={cn(
              "flex items-start gap-2 px-2.5 py-1.5 mx-1 rounded group",
              channelId === saved.channelId ? "" : "hover:bg-[#f8f8f8]"
            )}
            style={channelId === saved.channelId ? { backgroundColor: T.colors.backgroundAlt, boxShadow: `inset 0 0 0 1px ${T.colors.border}` } : {}}
          >
            <IconBookmark width={16} height={16} className="shrink-0 mt-0.5" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: T.typography.small, color: T.colors.text }}>{saved.preview}</p>
            </div>
            <span className="shrink-0" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{saved.timestamp}</span>
          </Link>
        ))}
        {activeNav === "dms" && dmsOnly.map((item) => {
          const isActive = channelId === item.id;
          const { preview, timestamp } = getChannelPreview(item.id);
          const avatarSrc = item.avatarUrl || getAvatarUrl(item.name, 64);
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={cn(
                "flex items-start gap-2 px-3 py-2 rounded group w-full transition-colors",
                isActive ? "" : "hover:bg-[#52215A]"
              )}
              style={{
                ...(isActive ? { backgroundColor: T.colors.dmSidebarSelect } : openDropdownId === item.id ? { backgroundColor: "#52215A" } : {}),
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="relative shrink-0 mt-0.5">
                <img src={avatarSrc} alt="" className="w-8 h-8 rounded-full object-cover" />
                <StatusDot status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-white" style={{ fontSize: T.typography.body }}>{item.name}</span>
                </div>
                {preview && (
                  <p className="truncate mt-0.5 text-[#B8A2B9]">{preview}</p>
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
                  <span className={cn("text-[#AA81AB] text-right", openDropdownId === item.id ? "hidden" : "group-hover:hidden")} style={{ fontSize: T.typography.smaller }}>{timestamp}</span>
                )}
              </div>
            </Link>
          );
        })}
        {activeNav === "agentforce" && agentforceItems.map((item) => {
          const isActive = channelId === item.id;
          const { preview, timestamp } = getChannelPreview(item.id);
          const avatarSrc = item.avatarUrl || getAvatarUrl(item.name, 64);
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={cn(
                "flex items-start gap-2 px-3 py-2 rounded group w-full transition-colors",
                isActive ? "" : "hover:bg-[#52215A]"
              )}
              style={{
                ...(isActive ? { backgroundColor: T.colors.dmSidebarSelect } : openDropdownId === item.id ? { backgroundColor: "#52215A" } : {}),
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="relative shrink-0 mt-0.5">
                <img src={avatarSrc} alt="" className="w-8 h-8 rounded-full object-cover" />
                <StatusDot status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-white" style={{ fontSize: T.typography.body }}>{item.name}</span>
                </div>
                {preview && (
                  <p className="truncate mt-0.5 text-[#B8A2B9]">{preview}</p>
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
                  <span className={cn("text-[#AA81AB] text-right", openDropdownId === item.id ? "hidden" : "group-hover:hidden")} style={{ fontSize: T.typography.smaller }}>{timestamp}</span>
                )}
              </div>
            </Link>
          );
        })}
        {(activeNav === "home" || activeNav === "activity" || activeNav === "more") && channelAndDmItems.map((item) => {
          const isActive = channelId === item.id;
          const { preview, timestamp } = getChannelPreview(item.id);
          const displayName = item.type === "channel" ? `#${item.name}` : item.name;
          const avatarSrc = item.type === "dm" ? ((item as { avatarUrl?: string }).avatarUrl || getAvatarUrl(item.name, 64)) : getAvatarUrl(item.name, 64);
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={cn(
                "flex items-start gap-2 px-2.5 py-1.5 mx-1 rounded group",
                isActive ? "" : "hover:bg-[#f0e6f0]"
              )}
              style={isActive ? { backgroundColor: T.colors.backgroundAlt, boxShadow: `inset 0 0 0 1px ${T.colors.border}` } : {}}
            >
              <div className="relative shrink-0 mt-0.5">
                <img src={avatarSrc} alt="" className="w-8 h-8 rounded object-cover" />
                {item.type === "dm" && "status" in item && <StatusDot status={item.status} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium" style={{ fontSize: T.typography.body, color: T.colors.text }}>
                    {item.type === "channel" ? `#${item.name}` : item.name}
                  </span>
                </div>
                {preview && (
                  <p className="truncate mt-0.5" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>{preview}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Copy">
                  <IconCopy width={12} height={12} style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Link">
                  <IconLink width={12} height={12} style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="More">
                  <IconMoreVertical width={12} height={12} style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                </button>
              </div>
              {timestamp && (
                <span className="shrink-0 mt-0.5" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{timestamp}</span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
