"use client";

import {
  IconHome,
  IconMessage,
  IconBell,
  IconFolder,
  IconBookmark,
  IconBot,
  IconMore,
  IconPlus,
  IconHashtag,
} from "@/components/icons";
import { useNav } from "../_context/demo-layout-context";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

const navItems = [
  { icon: IconHome, label: "Home", id: "home" as const },
  { icon: IconMessage, label: "DMs", id: "dms" as const, badge: 7 },
  { icon: IconBell, label: "Activity", id: "activity" as const, badge: 3 },
  { icon: IconFolder, label: "Files", id: "files" as const },
  { icon: IconBookmark, label: "Later", id: "later" as const },
  { icon: IconBot, label: "Agentforce", id: "agentforce" as const },
  { icon: IconMore, label: "More", id: "more" as const },
];

export function DemoIconBar() {
  const { activeNav, setActiveNav } = useNav();

  return (
    <aside
      className="w-[72px] flex-shrink-0 flex flex-col items-center py-4 gap-0"
      style={{ backgroundColor: T.colors.globalBg }}
    >
      <div className="mb-4 flex items-center justify-center" style={{ color: T.colors.themeSurface }}>
        <IconHashtag width={T.iconSizes.logo} height={T.iconSizes.logo} strokeWidth={2} />
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveNav(item.id)}
            className={cn(
              "relative flex flex-col items-center justify-center w-full py-2 px-1 rounded transition-colors",
              !isActive && "hover:bg-[#5a2b5e]"
            )}
            style={{
              backgroundColor: isActive ? T.colors.sidebarActive : undefined,
            }}
            title={item.label}
          >
            <Icon
              width={T.iconSizes.navIcon}
              height={T.iconSizes.navIcon}
              stroke="currentColor"
              style={{ color: isActive ? "#D9D9D9" : "#A180A2" }}
            />
            <span
              className="text-[10px] font-medium leading-tight truncate w-full text-center mt-0.5"
              style={{ color: isActive ? "#D9D9D9" : "#A180A2" }}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                className="absolute top-0.5 right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
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
        <IconPlus width={T.iconSizes.navIconPlus} height={T.iconSizes.navIconPlus} stroke="currentColor" />
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
