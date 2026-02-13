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
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

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
      style={{ borderColor: T.colors.border }}
    >
      <div className="flex items-center justify-between px-4 h-[49px]">
        <span className="text-[18px] font-semibold" style={{ color: T.colors.text }}>{displayName}</span>
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="People">
            <Users size={T.iconSizes.channelHeader} />
          </button>
          <span className="text-[13px]" style={{ color: T.colors.textSecondary }}>8</span>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Call">
            <Headphones size={T.iconSizes.channelHeader} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Pin">
            <Pin size={T.iconSizes.channelHeader} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Search">
            <Search size={T.iconSizes.channelHeader} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More">
            <MoreHorizontal size={T.iconSizes.channelHeader} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close">
            <X size={T.iconSizes.channelHeader} />
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
              tab.active ? "" : "hover:bg-[#f8f8f8]"
            )}
            style={tab.active ? { color: T.colors.text, backgroundColor: T.colors.backgroundAlt } : { color: T.colors.textSecondary }}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More tabs">
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
