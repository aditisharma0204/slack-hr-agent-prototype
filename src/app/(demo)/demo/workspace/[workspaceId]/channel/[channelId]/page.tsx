"use client";

import { useParams } from "next/navigation";
import { useDemoMessages, useDemoData } from "@/context/DemoDataContext";
import { DemoChannelHeader } from "./_components/DemoChannelHeader";
import { DemoMessageList } from "./_components/DemoMessageList";
import { DemoMessageInput } from "./_components/DemoMessageInput";

export default function DemoChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const messages = useDemoMessages(channelId);
  const { dms } = useDemoData();
  const isDM = dms.some((d) => d.id === channelId);
  const placeholder = isDM ? "Reply..." : `Message #${channelId}`;

  return (
    <div className="flex flex-col h-full bg-white">
      <DemoChannelHeader channelId={channelId} />
      <DemoMessageList messages={messages} />
      <DemoMessageInput channelId={channelId} placeholder={placeholder} />
    </div>
  );
}
