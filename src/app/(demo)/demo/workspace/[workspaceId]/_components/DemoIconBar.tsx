"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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
import { useNav, usePresentationMode } from "../_context/demo-layout-context";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

const navItems = [
  { icon: IconHome, label: "Home", id: "home" as const, href: "/activity" },
  { icon: IconMessage, label: "DMs", id: "dms" as const, badge: 7, href: "/dms" },
  { icon: IconBell, label: "Activity", id: "activity" as const, badge: 3, href: "/activity" },
  { icon: IconFolder, label: "Files", id: "files" as const, href: "/files" },
  { icon: IconBookmark, label: "Later", id: "later" as const, href: "/later" },
  { icon: IconBot, label: "Agentforce", id: "agentforce" as const, href: "/agentforce" },
  { icon: IconMore, label: "More", id: "more" as const, href: "/more" },
];

export function DemoIconBar() {
  const params = useParams();
  const pathname = usePathname();
  // Fallback to "demo-1" in presentation mode where workspaceId param doesn't exist
  const workspaceId = (params.workspaceId as string) || "demo-1";
  const base = `/demo/workspace/${workspaceId}`;
  const { activeNav, setActiveNav } = useNav();
  const { isPresentationMode } = usePresentationMode();

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
        const href = base + item.href;
        // Single source of truth: only activeNav determines active state
        const isActive = activeNav === item.id;
        return (
          <Link
            key={item.label}
            href={href}
            onClick={(e) => {
              setActiveNav(item.id);
              // In presentation mode, prevent navigation - only update state
              if (isPresentationMode) {
                e.preventDefault();
              }
            }}
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
          </Link>
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
