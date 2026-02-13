"use client";

import { useParams } from "next/navigation";
import { useDemoMessages } from "@/context/DemoDataContext";
import { DemoChannelHeader } from "../_components/DemoChannelHeader";
import { DemoMessageList } from "../_components/DemoMessageList";

export default function DemoChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const messages = useDemoMessages(channelId);

  return (
    <div className="flex flex-col h-full bg-white">
      <DemoChannelHeader channelId={channelId} />
      <DemoMessageList messages={messages} />
      <div className="p-4 border-t border-[#e8e8e8]">
        <input
          type="text"
          placeholder={`Message #${channelId}`}
          className="w-full px-4 py-2 rounded border border-[#e8e8e8] text-[15px] placeholder:text-[#616061] focus:outline-none focus:ring-1 focus:ring-[#1264a3]"
          readOnly
        />
      </div>
    </div>
  );
}
