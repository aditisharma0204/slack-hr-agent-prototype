"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  Square,
  LayoutGrid,
  Filter,
  List,
  Copy,
  Link as LinkIcon,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useDemoData } from "@/context/DemoDataContext";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

type ViewFilter = "all" | "dms";

export function DemoSidebar() {
  const params = useParams();
  const channelId = params.channelId as string;
  const { workspace, channels, dms, getChannelPreview } = useDemoData();
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [search, setSearch] = useState("");

  const allItems = (
    filter === "dms"
      ? dms.map((dm) => ({ ...dm, type: "dm" as const }))
      : [...channels.map((ch) => ({ ...ch, type: "channel" as const })), ...dms.map((dm) => ({ ...dm, type: "dm" as const }))]
  ).filter((item) => {
    if (!search) return true;
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: T.colors.activitySidebar, borderColor: T.colors.border }}>
      <div className="px-3 py-3 border-b flex items-center gap-2" style={{ borderColor: T.colors.border }}>
        <span className="font-semibold text-[15px]" style={{ color: T.colors.text }}>Activity</span>
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded" style={{ backgroundColor: T.colors.betaBadgeBg, color: T.colors.link }}>Beta</span>
      </div>

      <div className="flex items-center gap-1 px-2 py-2 border-b" style={{ borderColor: T.colors.border }}>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded",
            filter === "all" ? "" : "hover:bg-[#f8f8f8]"
          )}
          style={filter === "all" ? { backgroundColor: T.colors.backgroundAlt, color: T.colors.text } : { color: T.colors.textSecondary }}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded",
            filter === "dms" ? "" : "hover:bg-[#f8f8f8]"
          )}
          style={filter === "dms" ? { backgroundColor: T.colors.backgroundAlt, color: T.colors.text } : { color: T.colors.textSecondary }}
          onClick={() => setFilter("dms")}
        >
          DMs
        </button>
        <button
          type="button"
          className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]"
          title="Add"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: T.colors.border }}>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Checkbox">
          <Square size={14} strokeWidth={2} />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Grid">
          <LayoutGrid size={14} />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Filter">
          <Filter size={14} />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="List">
          <List size={14} />
        </button>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: T.colors.backgroundAlt }}>
          <Search size={14} className="shrink-0" style={{ color: T.colors.textSecondary }} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 text-sm bg-transparent focus:outline-none"
            style={{ color: T.colors.text }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 py-1">
        {allItems.map((item) => {
          const isActive = channelId === item.id;
          const { preview, timestamp } = getChannelPreview(item.id);
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={cn(
                "flex items-start gap-2 px-2.5 py-1.5 mx-1 rounded group",
                isActive ? "" : "hover:bg-[#f8f8f8]"
              )}
              style={isActive ? { backgroundColor: T.colors.backgroundAlt, boxShadow: `inset 0 0 0 1px ${T.colors.border}` } : {}}
            >
              <div className="size-8 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5" style={{ backgroundColor: T.colors.avatarBg, borderRadius: `${T.radius.avatar}px` }}>
                {item.type === "channel" ? item.name.charAt(0).toUpperCase() : item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[15px] truncate font-medium" style={{ color: T.colors.text }}>
                    {item.type === "channel" ? `#${item.name}` : item.name}
                  </span>
                </div>
                {preview && (
                  <p className="text-[13px] truncate mt-0.5" style={{ color: T.colors.textSecondary }}>{preview}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Copy">
                  <Copy size={12} style={{ color: T.colors.textSecondary }} />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Link">
                  <LinkIcon size={12} style={{ color: T.colors.textSecondary }} />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="More">
                  <MoreVertical size={12} style={{ color: T.colors.textSecondary }} />
                </button>
              </div>
              {timestamp && (
                <span className="text-[12px] shrink-0 mt-0.5" style={{ color: T.colors.textSecondary }}>{timestamp}</span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
