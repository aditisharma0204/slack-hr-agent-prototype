"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoChannelPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/");
  }, [router]);
  
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <p className="text-[#616061] text-sm">Redirecting to boilerplate...</p>
    </div>
  );
}
  const dm = dms.find((d) => d.id === channelId);
  const isSlackbot = dm?.isSlackbot ?? false;
  const placeholder = isDM ? "Reply..." : `Message #${channelId}`;
  const fromActivity = searchParams.get("from") === "activity";
  const [activeTab, setActiveTab] = useState("messages");

  useLayoutEffect(() => {
    markChannelAsRead(channelId);
  }, [channelId, markChannelAsRead]);

  useLayoutEffect(() => {
    if (fromActivity) {
      setActiveNav("activity");
    } else if (isDM) {
      // Treat all DMs (including Slackbot) as regular DMs
      setActiveNav("dms");
    } else {
      setActiveNav("activity");
    }
  }, [isDM, fromActivity, setActiveNav]);

  const isDealRoom = channelId === "deal-acme-q1-strategic";

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="shrink-0">
        <DemoChannelHeader channelId={channelId} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      {activeTab === "canvas" && isDealRoom ? (
        <DealCanvasTab />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto min-h-0">
            <DemoMessageList messages={messages} channelId={channelId} />
          </div>
          <div className="shrink-0 px-3 py-2">
            <DemoMessageInput channelId={channelId} placeholder={placeholder} />
          </div>
        </>
      )}
    </div>
  );
}
