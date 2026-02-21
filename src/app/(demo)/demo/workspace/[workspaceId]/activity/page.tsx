"use client";

import { useLayoutEffect, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useNav } from "../_context/demo-layout-context";
import { useDemoData, useDemoMessages } from "@/context/DemoDataContext";
import { DemoChannelHeader } from "../channel/[channelId]/_components/DemoChannelHeader";
import { DemoMessageList } from "../channel/[channelId]/_components/DemoMessageList";
import { DemoMessageInput } from "../channel/[channelId]/_components/DemoMessageInput";

export default function DemoActivityPage() {
  const { setActiveNav } = useNav();
  const { channels, dms } = useDemoData();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = params.workspaceId as string;
  
  // Get all activity items (channels + DMs)
  const channelAndDmItems = [
    ...channels.map((ch) => ({ ...ch, type: "channel" as const })),
    ...dms.map((dm) => ({ ...dm, type: "dm" as const }))
  ];

  // Get selected channel ID from URL or default to first item - ensure synchronous initialization
  const urlChannelId = searchParams.get("channel");
  const firstItemId = channelAndDmItems[0]?.id;
  const selectedChannelId = urlChannelId || firstItemId;
  const selectedItem = channelAndDmItems.find(item => item.id === selectedChannelId);
  
  const messages = useDemoMessages(selectedChannelId || "");
  const { markChannelAsRead } = useDemoData();
  const isDM = dms.some((d) => d.id === selectedChannelId);
  const placeholder = isDM ? "Reply..." : `Message #${selectedChannelId}`;

  useLayoutEffect(() => {
    setActiveNav("activity");
  }, [setActiveNav]);

  // Use useLayoutEffect for synchronous URL update before paint
  useLayoutEffect(() => {
    // Auto-select first item if no channel is selected - must happen synchronously
    if (!urlChannelId && channelAndDmItems.length > 0 && firstItemId) {
      router.replace(`/demo/workspace/${workspaceId}/activity?channel=${firstItemId}`, { scroll: false });
    }
  }, [urlChannelId, channelAndDmItems.length, firstItemId, router, workspaceId]);

  useEffect(() => {
    if (selectedChannelId) {
      markChannelAsRead(selectedChannelId);
    }
  }, [selectedChannelId, markChannelAsRead]);

  // If no items available, show empty state
  if (!channelAndDmItems.length || !selectedItem) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white items-center justify-center">
        <p className="text-[#616061] text-sm">No activity items available.</p>
      </div>
    );
  }

  // Render standard chat view for selected item — same layout as channel page so input is pinned to bottom
  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="shrink-0">
        <DemoChannelHeader channelId={selectedChannelId} />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <DemoMessageList messages={messages} />
      </div>
      <div className="shrink-0 px-3 py-2">
        <DemoMessageInput channelId={selectedChannelId} placeholder={placeholder} />
      </div>
    </div>
  );
}
