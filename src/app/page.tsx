"use client";

import { useState, useCallback } from "react";
import { SlackAppShell } from "@/components/presentation/SlackAppShell";
import { GlobalDMsView, GENERIC_GLOBAL_DMS } from "@/components/presentation/GlobalDMsView";
import { SlackTodayView } from "@/components/presentation/SlackTodayView";
import { HRAgentChat } from "@/components/hr/HRAgentChat";
import {
  TemplateChatContent,
  TemplateFilesView,
  TemplateAgentforceContent,
  TemplateMoreView,
} from "@/components/presentation/TemplateViews";
import type { NavView } from "@/app/(demo)/demo/workspace/[workspaceId]/_context/demo-layout-context";

const DEFAULT_CHAT: Record<string, string> = {
  home: "general",
  activity: "deal-acme",
  later: "deal-greentech",
  agentforce: "af-employee",
};

export default function Home() {
  const [activeNavId, setActiveNavId] = useState<NavView>("today");
  const [activeDmId, setActiveDmId] = useState<string | undefined>(undefined);
  const [activeChatId, setActiveChatId] = useState<string>("");

  const handleNavChange = useCallback((nav: NavView) => {
    setActiveNavId(nav);
    // Always set the default chat for the new nav, or empty string if none
    const defaultChat = DEFAULT_CHAT[nav] ?? "";
    setActiveChatId(defaultChat);
    console.log(`Nav changed to: ${nav}, setting activeChatId to: ${defaultChat}`);
  }, []);

  const handleChatChange = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const fullWidthViews: NavView[] = ["today"];
  const showSidebar = !fullWidthViews.includes(activeNavId);

  const effectiveChatId = activeChatId || DEFAULT_CHAT[activeNavId] || "";

  const renderContent = () => {
    switch (activeNavId) {
      case "today":
        return <SlackTodayView onNavigateToActivity={() => handleNavChange("activity")} />;
      case "home":
        return <TemplateChatContent activeChatId={effectiveChatId} channelName="#general" />;
      case "dms":
        return (
          <GlobalDMsView
            activeDmId={activeDmId}
            onDmSelect={setActiveDmId}
            dms={GENERIC_GLOBAL_DMS}
          />
        );
      case "activity":
        return <TemplateChatContent activeChatId={effectiveChatId} channelName="#deal-acme" />;
      case "files":
        return <TemplateFilesView />;
      case "later":
        return <TemplateChatContent activeChatId={effectiveChatId} channelName="#deal-greentech" />;
      case "agentforce":
        console.log(`Agentforce case - effectiveChatId: "${effectiveChatId}", should render HRAgentChat: ${effectiveChatId === "af-employee"}`);
        return effectiveChatId === "af-employee" ? (
          <HRAgentChat agentId="af-employee" />
        ) : (
          <TemplateChatContent activeChatId={effectiveChatId} />
        );
      case "more":
        return <TemplateMoreView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-white h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Blank Slack Canvas</h1>
              <p className="text-sm text-gray-500">Ready for your new concept.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <SlackAppShell
        activeNavId={activeNavId}
        onNavChange={handleNavChange}
        showSidebar={showSidebar}
        activeChatId={activeChatId}
        onChatChange={handleChatChange}
        sidebarActiveDmId={activeNavId === "dms" ? activeDmId : undefined}
        sidebarOnDmSelect={activeNavId === "dms" ? setActiveDmId : undefined}
        sidebarOverrideDms={activeNavId === "dms" ? GENERIC_GLOBAL_DMS : undefined}
      >
        {renderContent()}
      </SlackAppShell>
    </div>
  );
}
