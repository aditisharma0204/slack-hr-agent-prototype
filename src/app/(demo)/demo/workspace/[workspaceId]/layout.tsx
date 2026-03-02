"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect all old demo routes to root boilerplate
    router.replace("/");
  }, [router]);
  
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <p className="text-[#616061] text-sm">Redirecting to boilerplate...</p>
    </div>
  );
}

  return (
    <DemoLayoutProviders
        isSlackbotOpen={isSlackbotOpen}
        setIsSlackbotOpen={setIsSlackbotOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        demoContext={demoContext}
        setDemoContext={setDemoContext}
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
                    <SlackbotPanel 
                      onClose={() => setIsSlackbotOpen(false)}
                      panelData={slackbotPanelData}
                      history={globalSlackbotHistory}
                      onUpdateHistory={setGlobalSlackbotHistory}
                    />
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
