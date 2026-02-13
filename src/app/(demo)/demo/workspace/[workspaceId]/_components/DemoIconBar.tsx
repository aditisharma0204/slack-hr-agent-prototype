"use client";

import {
  Home,
  MessagesSquare,
  Bell,
  Folder,
  Bookmark,
  Bot,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ICON_BAR_BG = "#4a154b";
const ICON_SIZE = 20;

const navItems = [
  { icon: Home, label: "Home" },
  { icon: MessagesSquare, label: "DMs" },
  { icon: Bell, label: "Activity", active: true },
  { icon: Folder, label: "Files" },
  { icon: Bookmark, label: "Later" },
  { icon: Bot, label: "Agentforce" },
  { icon: MoreHorizontal, label: "More" },
];

export function DemoIconBar() {
  return (
    <aside
      className="w-[60px] flex-shrink-0 flex flex-col items-center py-4 gap-1"
      style={{ backgroundColor: ICON_BAR_BG }}
    >
      <div className="mb-4">
        <Image
          src="/logo.svg"
          alt="Salesforce"
          width={28}
          height={28}
          className="object-contain"
        />
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center w-full py-2.5 rounded transition-colors",
              item.active ? "bg-white/15" : "hover:bg-white/10"
            )}
            title={item.label}
          >
            <Icon size={ICON_SIZE} className="text-white" />
          </button>
        );
      })}
      <div className="flex-1" />
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
        title="Add"
      >
        <Plus size={18} />
      </button>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mt-2" title="Profile">
        <span className="text-[10px] font-bold text-white">P</span>
      </div>
    </aside>
  );
}
