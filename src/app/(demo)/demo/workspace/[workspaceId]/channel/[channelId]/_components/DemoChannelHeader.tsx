"use client";

import { useDemoData } from "@/context/DemoDataContext";

interface DemoChannelHeaderProps {
  channelId: string;
}

export function DemoChannelHeader({ channelId }: DemoChannelHeaderProps) {
  const { channels, dms } = useDemoData();
  const channel = channels.find((c) => c.id === channelId) ?? dms.find((d) => d.id === channelId);
  const name = channel?.name ?? channelId;
  const prefix = dms.find((d) => d.id === channelId) ? "" : "# ";

  return (
    <header
      className="h-[49px] flex items-center px-4 border-b shrink-0"
      style={{ borderColor: "#e8e8e8" }}
    >
      <span className="text-lg font-semibold text-[#1d1c1d]">
        {prefix}{name}
      </span>
    </header>
  );
}
