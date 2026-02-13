"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DemoIconBar } from "./_components/DemoIconBar";
import { DemoSidebar } from "./_components/DemoSidebar";
import { SlackbotPanel } from "@/components/slackbot/SlackbotPanel";

export default function DemoWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex min-h-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lato", sans-serif' }}>
      <DemoIconBar />
      <DemoSidebar />
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId="demo-workspace-layout"
        className="flex-1"
      >
        <ResizablePanel minSize={20} defaultSize={55}>
          {children}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={22} defaultSize={25}>
          <SlackbotPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
