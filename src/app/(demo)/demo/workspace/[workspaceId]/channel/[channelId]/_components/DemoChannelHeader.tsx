"use client";

import { useDemoData } from "@/context/DemoDataContext";
import {
  Users,
  Headphones,
  Pin,
  Search,
  MoreHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoChannelHeaderProps {
  channelId: string;
}

const tabs = [
  { id: "messages", label: "Messages", active: true },
  { id: "pins", label: "Pins" },
  { id: "files", label: "Files" },
  { id: "more", label: "More" },
];

export function DemoChannelHeader({ channelId }: DemoChannelHeaderProps) {
  const { channels, dms } = useDemoData();
  const channel = channels.find((c) => c.id === channelId) ?? dms.find((d) => d.id === channelId);
  const name = channel?.name ?? channelId;
  const isChannel = !!channels.find((c) => c.id === channelId);
  const displayName = isChannel ? `#${name}` : name;

  return (
    <header
      className="flex flex-col shrink-0 border-b"
      style={{ borderColor: "#e8e8e8" }}
    >
      <div className="flex items-center justify-between px-4 h-[49px]">
        <span className="text-[18px] font-semibold text-[#1d1c1d]">{displayName}</span>
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8] text-[#616061]" title="People">
            <Users size={18} />
          </button>
          <span className="text-[13px] text-[#616061]">8</span>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Call">
            <Headphones size={18} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Pin">
            <Pin size={18} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Search">
            <Search size={18} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8] text-[#616061]" title="More">
            <MoreHorizontal size={18} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8] text-[#616061]" title="Close">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "px-3 py-1 text-[13px] font-medium rounded",
              tab.active ? "text-[#1d1c1d] bg-[#f8f8f8]" : "text-[#616061] hover:bg-[#f8f8f8]"
            )}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="p-1 rounded text-[#616061] hover:bg-[#f8f8f8]" title="More tabs">
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
