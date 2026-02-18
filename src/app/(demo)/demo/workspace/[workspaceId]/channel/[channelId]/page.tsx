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
    } else if (isSlackbot) {
      setActiveNav("agentforce");
    } else if (isDM) {
      setActiveNav("dms");
    } else {
      setActiveNav("activity");
    }
  }, [isDM, isSlackbot, fromActivity, setActiveNav]);

  return (
    <div className="flex flex-col h-full bg-white">
      <DemoChannelHeader channelId={channelId} />
      <DemoMessageList messages={messages} />
      <DemoMessageInput channelId={channelId} placeholder={placeholder} />
    </div>
  );
}
