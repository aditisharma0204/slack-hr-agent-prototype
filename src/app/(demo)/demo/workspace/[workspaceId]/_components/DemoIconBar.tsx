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
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

const navItems = [
  { icon: Home, label: "Home" },
  { icon: MessagesSquare, label: "DMs", badge: 231 },
  { icon: Bell, label: "Activity", active: true, badge: 3 },
  { icon: Folder, label: "Files" },
  { icon: Bookmark, label: "Later" },
  { icon: Bot, label: "Agentforce" },
  { icon: MoreHorizontal, label: "More" },
];

export function DemoIconBar() {
  return (
    <aside
      className="w-[60px] flex-shrink-0 flex flex-col items-center py-4 gap-1"
      style={{ backgroundColor: T.colors.iconBar }}
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
              "relative flex flex-col items-center justify-center w-full py-2 rounded transition-colors",
              item.active ? "bg-white/15" : "hover:bg-white/10"
            )}
            title={item.label}
          >
            <Icon size={T.iconSizes.navIcon} className="text-white" />
            {item.badge && (
              <span
                className="absolute top-1 right-[6px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ backgroundColor: T.colors.notificationRed }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
      <div className="flex-1" />
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
        title="Add"
      >
        <Plus size={T.iconSizes.navIconPlus} />
      </button>
      <div
        className="w-8 h-8 bg-white/20 flex items-center justify-center mt-2"
        style={{ borderRadius: `${T.radius.avatar}px` }}
        title="Profile"
      >
        <span className="text-[10px] font-bold text-white">P</span>
      </div>
    </aside>
  );
}
