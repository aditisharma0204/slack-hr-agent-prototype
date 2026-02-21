"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDemoMessages, useDemoData } from "@/context/DemoDataContext";
import { useNav } from "../../_context/demo-layout-context";
import { DemoChannelHeader } from "./_components/DemoChannelHeader";
import { DemoMessageList } from "./_components/DemoMessageList";
import { DemoMessageInput } from "./_components/DemoMessageInput";

export default function DemoChannelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const channelId = params.channelId as string;
  const messages = useDemoMessages(channelId);
  const { dms, markChannelAsRead } = useDemoData();
  const { setActiveNav } = useNav();
  const isDM = dms.some((d) => d.id === channelId);
  const dm = dms.find((d) => d.id === channelId);
  const isSlackbot = dm?.isSlackbot ?? false;
  const placeholder = isDM ? "Reply..." : `Message #${channelId}`;
  const fromActivity = searchParams.get("from") === "activity";

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

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="shrink-0">
        <DemoChannelHeader channelId={channelId} />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <DemoMessageList messages={messages} />
      </div>
      <div className="shrink-0 px-3 py-2">
        <DemoMessageInput channelId={channelId} placeholder={placeholder} />
      </div>
    </div>
  );
}
