"use client";

import { useState, useLayoutEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AppHeader } from "./_components/AppHeader";
import { DemoIconBar } from "./_components/DemoIconBar";
import { DemoSidebar } from "./_components/DemoSidebar";
import { SlackbotPanel } from "@/components/slackbot/SlackbotPanel";
import {
  DemoLayoutProviders,
  type NavView,
} from "./_context/demo-layout-context";

const T = SLACK_TOKENS;

const NAV_VIEWS: NavView[] = ["home", "dms", "activity", "files", "later", "agentforce", "more"];

function getNavFromPathname(pathname: string | null): NavView {
  if (!pathname) return "activity";
  const segments = pathname.split("/");
  const i = segments.indexOf("workspace");
  const segment = i >= 0 ? segments[i + 2] : undefined; // [ '', 'demo', 'workspace', workspaceId, segment ]
  if (segment && NAV_VIEWS.includes(segment as NavView)) return segment as NavView;
  if (segment === "channel") return "activity";
  return "activity";
}

export default function DemoWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navFromPath = useMemo(() => getNavFromPathname(pathname), [pathname]);
  const [isSlackbotOpen, setIsSlackbotOpen] = useState(true);
  const [activeNav, setActiveNav] = useState<NavView>(() => navFromPath);

  useLayoutEffect(() => {
    setActiveNav(navFromPath);
  }, [navFromPath]);

  return (
    <DemoLayoutProviders
        isSlackbotOpen={isSlackbotOpen}
        setIsSlackbotOpen={setIsSlackbotOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
    >
      {/* Single canonical slot: below global header, same height as prototype zone so layout is identical on first frame and after navigation */}
      <div
        className="flex flex-col w-full overflow-hidden"
        style={{
          marginTop: "var(--header-height, 40px)",
          height: "calc(100vh - var(--header-height, 40px))",
        }}
      >
        <div
          className="slack-shell h-full flex flex-col min-h-0 overflow-hidden flex-1"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lato", sans-serif',
            backgroundColor: T.colors.globalBg,
          }}
        >
        {/* Slack App Header - Always rendered, never conditionally hidden */}
        <div className="slack-app-header relative shrink-0 w-full z-[100]">
          <AppHeader />
        </div>
        <div className="slack-body flex-1 flex min-h-0 min-w-0 overflow-hidden" style={{ gap: 2 }}>
          {/* Left nav: icon bar only - no roundness */}
          <DemoIconBar />
          {/* List + chat together: one rounded container - shadow casts left onto nav */}
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="demo-workspace-layout"
            className="flex-1 min-w-0"
          >
            <ResizablePanel minSize={20} defaultSize={isSlackbotOpen ? 55 : 75} className="overflow-visible">
              <div
                className="h-full flex overflow-hidden"
                style={{
                  borderRadius: 24,
                  boxShadow: "-6px 0 24px -4px rgba(0, 0, 0, 0.2), -2px 0 10px -2px rgba(0, 0, 0, 0.15)",
                }}
              >
                <DemoSidebar />
                <div className="flex-1 min-w-0 bg-white">{children}</div>
              </div>
            </ResizablePanel>
            {isSlackbotOpen && (
              <>
                <ResizableHandle withHandle={false} className="!w-[6px] shrink-0 !bg-transparent border-0 cursor-col-resize focus-visible:ring-0" />
                <ResizablePanel minSize={22} defaultSize={25} className="overflow-visible">
                  <div
                    className="h-full overflow-hidden"
                    style={{
                      borderRadius: 24,
                      boxShadow: "-6px 0 24px -4px rgba(0, 0, 0, 0.18), -2px 0 10px -2px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <SlackbotPanel onClose={() => setIsSlackbotOpen(false)} />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        </div>
      </div>
    </DemoLayoutProviders>
  );
}
