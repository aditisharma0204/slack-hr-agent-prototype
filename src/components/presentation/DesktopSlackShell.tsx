"use client";

import { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AppHeader } from "@/app/(demo)/demo/workspace/[workspaceId]/_components/AppHeader";
import { DemoIconBar } from "@/app/(demo)/demo/workspace/[workspaceId]/_components/DemoIconBar";
import { DemoSidebar } from "@/app/(demo)/demo/workspace/[workspaceId]/_components/DemoSidebar";
import { SlackbotPanel } from "@/components/slackbot/SlackbotPanel";
import {
  DemoLayoutProviders,
  type NavView,
} from "@/app/(demo)/demo/workspace/[workspaceId]/_context/demo-layout-context";

const T = SLACK_TOKENS;

interface DesktopSlackShellProps {
  children: ReactNode;
  defaultNav?: NavView;
  defaultChannelId?: string;
  onSlackbotOpen?: () => void;
}

export function DesktopSlackShell({ 
  children, 
  defaultNav = "activity",
  defaultChannelId,
  onSlackbotOpen
}: DesktopSlackShellProps) {
  const [isSlackbotOpen, setIsSlackbotOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavView>(defaultNav);
  const router = useRouter();

  useEffect(() => {
    if (defaultChannelId) {
      // Set the URL to the default channel without navigation
      const workspaceId = "demo-1"; // Default workspace for presentation
      const newPath = `/demo/workspace/${workspaceId}/channel/${defaultChannelId}`;
      if (typeof window !== "undefined") {
        // Use replaceState to update URL without triggering navigation
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, "", newPath);
      }
    }
  }, [defaultChannelId]);

  const handleSlackbotOpen = () => {
    setIsSlackbotOpen(true);
    onSlackbotOpen?.();
  };

  return (
    <DemoLayoutProviders
      isSlackbotOpen={isSlackbotOpen}
      setIsSlackbotOpen={setIsSlackbotOpen}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      isPresentationMode={true}
    >
      <div
        className="h-full flex flex-col min-h-0 overflow-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lato", sans-serif',
          backgroundColor: T.colors.globalBg,
        }}
      >
        <AppHeader />
        <div className="flex-1 flex min-h-0 min-w-0" style={{ gap: 2 }}>
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
                <div className="flex-1 min-w-0 bg-white overflow-y-auto">{children}</div>
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
    </DemoLayoutProviders>
  );
}
