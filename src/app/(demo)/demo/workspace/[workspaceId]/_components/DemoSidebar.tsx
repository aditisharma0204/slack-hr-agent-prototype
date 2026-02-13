"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HashIcon, MessageCircle } from "lucide-react";
import { useDemoData } from "@/context/DemoDataContext";

export function DemoSidebar() {
  const params = useParams();
  const channelId = params.channelId as string;
  const { workspace, channels, dms } = useDemoData();

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col"
      style={{ backgroundColor: "#4a154b" }}
    >
      <div className="px-4 py-3 border-b border-white/10">
        <span className="font-bold text-lg text-white truncate block">
          {workspace.name}
        </span>
      </div>
      <div className="px-2 py-2">
        <div className="px-3 py-1 text-xs font-semibold text-white/70 uppercase tracking-wide">
          Channels
        </div>
        {channels.map((ch) => (
          <Link
            key={ch.id}
            href={`/demo/workspace/${workspace.id}/channel/${ch.id}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[15px] text-white/95 hover:bg-white/10 ${
              channelId === ch.id ? "bg-[#1164a3] text-white" : ""
            }`}
          >
            <HashIcon className="size-4 opacity-70 shrink-0" />
            <span className="truncate">{ch.name}</span>
          </Link>
        ))}
      </div>
      <div className="px-2 py-2">
        <div className="px-3 py-1 text-xs font-semibold text-white/70 uppercase tracking-wide">
          Direct Messages
        </div>
        {dms.map((dm) => (
          <Link
            key={dm.id}
            href={`/demo/workspace/${workspace.id}/channel/${dm.id}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[15px] text-white/95 hover:bg-white/10 ${
              channelId === dm.id ? "bg-[#1164a3] text-white" : ""
            }`}
          >
            <span className="size-2 rounded-full bg-green-400 shrink-0" />
            <span className="truncate">{dm.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
