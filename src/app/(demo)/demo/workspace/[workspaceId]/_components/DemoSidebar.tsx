"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Hash,
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
    <aside className="w-[260px] flex-shrink-0 flex flex-col bg-white border-r" style={{ borderColor: "#e8e8e8" }}>
      <div className="px-3 py-3 border-b flex items-center gap-2" style={{ borderColor: "#e8e8e8" }}>
        <span className="font-semibold text-[15px] text-[#1d1c1d]">Activity</span>
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[#e8f4fc] text-[#1264a3]">Beta</span>
      </div>

      <div className="flex items-center gap-1 px-2 py-2 border-b" style={{ borderColor: "#e8e8e8" }}>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded",
            filter === "all" ? "bg-[#f8f8f8] text-[#1d1c1d]" : "text-[#616061] hover:bg-[#f8f8f8]"
          )}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded",
            filter === "dms" ? "bg-[#f8f8f8] text-[#1d1c1d]" : "text-[#616061] hover:bg-[#f8f8f8]"
          )}
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

      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: "#e8e8e8" }}>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Checkbox">
          <Square size={14} strokeWidth={2} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Grid">
          <LayoutGrid size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Filter">
          <Filter size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="List">
          <List size={14} />
        </button>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded bg-[#f8f8f8]">
          <Search size={14} className="text-[#616061] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 text-sm bg-transparent placeholder:text-[#616061] focus:outline-none"
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
                "flex items-start gap-2 px-3 py-2 mx-1 rounded group",
                isActive ? "bg-[#f8f8f8] ring-1 ring-[#e8e8e8]" : "hover:bg-[#f8f8f8]"
              )}
            >
              <div className="size-8 rounded-full bg-[#611f69] flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                {item.type === "channel" ? item.name.charAt(0).toUpperCase() : item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[15px] text-[#1d1c1d] truncate font-medium">
                    {item.type === "channel" ? `#${item.name}` : item.name}
                  </span>
                </div>
                {preview && (
                  <p className="text-[13px] text-[#616061] truncate mt-0.5">{preview}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Copy">
                  <Copy size={12} className="text-[#616061]" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Link">
                  <LinkIcon size={12} className="text-[#616061]" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="More">
                  <MoreVertical size={12} className="text-[#616061]" />
                </button>
              </div>
              {timestamp && (
                <span className="text-[12px] text-[#616061] shrink-0 mt-0.5">{timestamp}</span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
