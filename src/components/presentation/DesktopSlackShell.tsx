"use client";

import { useState, ReactNode, useEffect, createContext, useContext } from "react";
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
import { ChatEngine } from "./ChatEngine";
import { AnimatePresence, motion } from "framer-motion";
import { useDemoData } from "@/context/DemoDataContext";

const T = SLACK_TOKENS;

// Create context for active chat state
const ActiveChatContext = createContext<{
  activeChatId: string;
  setActiveChatId: (id: string) => void;
}>({
  activeChatId: "slackbot",
  setActiveChatId: () => {},
});

export const useActiveChat = () => useContext(ActiveChatContext);

interface DesktopSlackShellProps {
  children?: ReactNode;
  defaultNav?: NavView;
  defaultChannelId?: string;
  onSlackbotOpen?: () => void;
  hideHeader?: boolean; // Deprecated - ignored, AppHeader always renders
  customChatContent?: ReactNode;
  customSlackbotPanel?: ReactNode;
  forceSlackbotOpen?: boolean;
  onSlackbotToggle?: (isOpen: boolean) => void; // Callback when panel is toggled
  onPrimaryNavChange?: (nav: "activity" | "dms") => void;
  showDMBadge?: boolean;
}

export function DesktopSlackShell({ 
  children,
  defaultNav = "activity",
  defaultChannelId = "slackbot",
  onSlackbotOpen,
  hideHeader = false,
  customChatContent,
  customSlackbotPanel,
  forceSlackbotOpen = false,
  onSlackbotToggle,
  onPrimaryNavChange,
  showDMBadge = false,
}: DesktopSlackShellProps) {
  const [isSlackbotOpen, setIsSlackbotOpen] = useState(forceSlackbotOpen);
  const [activeNav, setActiveNav] = useState<NavView>(defaultNav);
  const [activeChatId, setActiveChatId] = useState<string>(defaultChannelId);
  const { channels, dms } = useDemoData();

  // Update Slackbot open state when forceSlackbotOpen changes (bidirectional sync)
  useEffect(() => {
    setIsSlackbotOpen(forceSlackbotOpen);
  }, [forceSlackbotOpen]);

  // Wrapper to notify parent when panel state changes (for AppHeader toggle)
  const handleSetSlackbotOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    const newState = typeof value === 'function' ? value(isSlackbotOpen) : value;
    setIsSlackbotOpen(newState);
    onSlackbotToggle?.(newState);
    if (newState) {
      onSlackbotOpen?.();
    }
  };

  // Sync activeNav when defaultNav changes (for Arc 1 primaryNav changes)
  useEffect(() => {
    if (defaultNav && defaultNav !== activeNav) {
      setActiveNav(defaultNav);
    }
  }, [defaultNav, activeNav]);

  useEffect(() => {
    if (defaultChannelId) {
      setActiveChatId(defaultChannelId);
      // Don't redirect in presentation mode (when on root "/" route) - we're already rendering in SceneLayout's prototype zone
      // Only redirect when actually navigating to demo routes
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/demo")) {
        const workspaceId = "demo-1";
        const newPath = `/demo/workspace/${workspaceId}/channel/${defaultChannelId}`;
        if (window.location.pathname !== newPath) {
          window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, "", newPath);
        }
      }
    }
  }, [defaultChannelId]);


  // Update activeChatId when activeNav changes to activity - select first available item
  // Only do this if onPrimaryNavChange is not provided (not in Arc 1 custom flow)
  useEffect(() => {
    if (!onPrimaryNavChange && activeNav === "activity") {
      const channelAndDmItems = [
        ...(channels || []).map((ch) => ({ ...ch, type: "channel" as const })),
        ...(dms || []).map((dm) => ({ ...dm, type: "dm" as const }))
      ];
      const firstItemId = channelAndDmItems[0]?.id;
      if (firstItemId && firstItemId !== activeChatId) {
        setActiveChatId(firstItemId);
      }
    }
  }, [activeNav, channels, dms, activeChatId, onPrimaryNavChange]);

  // Use custom chat content if provided (for Scene 1), otherwise use default ChatEngine
  const chatContent = customChatContent || (activeChatId ? <ChatEngine channelId={activeChatId} /> : (
    <div className="flex flex-col h-full bg-white items-center justify-center p-8">
      <p className="text-[#616061] text-sm">Select a DM from the sidebar to start a conversation.</p>
    </div>
  ));

  return (
    <ActiveChatContext.Provider value={{ activeChatId, setActiveChatId }}>
      <DemoLayoutProviders
        isSlackbotOpen={isSlackbotOpen}
        setIsSlackbotOpen={handleSetSlackbotOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isPresentationMode={true}
      >
        <div
          className="slack-shell h-full w-full flex flex-col min-h-0 overflow-hidden relative"
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
            <DemoIconBar onPrimaryNavChange={onPrimaryNavChange} showDMBadge={showDMBadge} />
            {/* List + chat together: one rounded container - shadow casts left onto nav */}
            {isSlackbotOpen ? (
              <ResizablePanelGroup
                direction="horizontal"
                autoSaveId="demo-workspace-layout"
                className="flex-1 min-w-0"
              >
                <ResizablePanel 
                  minSize={20} 
                  defaultSize={55} 
                  className="overflow-visible"
                >
                  <div
                    className="h-full flex overflow-hidden"
                    style={{
                      borderRadius: 24,
                      boxShadow: "-6px 0 24px -4px rgba(0, 0, 0, 0.2), -2px 0 10px -2px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <DemoSidebar />
                    <div className="flex-1 min-w-0 bg-white overflow-hidden pointer-events-auto" style={{ pointerEvents: "auto" }}>{chatContent}</div>
                  </div>
                </ResizablePanel>
                <ResizableHandle 
                  withHandle={false} 
                  className="!w-[6px] shrink-0 !bg-transparent border-0 cursor-col-resize focus-visible:ring-0"
                />
                <ResizablePanel 
                  minSize={22} 
                  defaultSize={25} 
                  className="overflow-visible"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full overflow-hidden"
                    style={{
                      borderRadius: 24,
                      boxShadow: "-6px 0 24px -4px rgba(0, 0, 0, 0.18), -2px 0 10px -2px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    {customSlackbotPanel || <SlackbotPanel onClose={() => setIsSlackbotOpen(false)} />}
                  </motion.div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="flex-1 min-w-0 overflow-visible">
                <div
                  className="h-full flex overflow-hidden"
                  style={{
                    borderRadius: 24,
                    boxShadow: "-6px 0 24px -4px rgba(0, 0, 0, 0.2), -2px 0 10px -2px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <DemoSidebar />
                  <div className="flex-1 min-w-0 bg-white overflow-hidden pointer-events-auto" style={{ pointerEvents: "auto" }}>{chatContent}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DemoLayoutProviders>
    </ActiveChatContext.Provider>
  );
}
