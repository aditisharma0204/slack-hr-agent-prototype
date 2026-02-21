"use client";

import { useLayoutEffect, useState, useEffect, useMemo, useRef } from "react";
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
  
  // Memoize channel and DM items to prevent recreation on every render
  // Only recreate when channels or dms arrays actually change (by ID)
  const channelIds = useMemo(() => channels.map(c => c.id).join(','), [channels]);
  const dmIds = useMemo(() => dms.map(d => d.id).join(','), [dms]);
  
  const channelAndDmItems = useMemo(() => [
    ...channels.map((ch) => ({ ...ch, type: "channel" as const })),
    ...dms.map((dm) => ({ ...dm, type: "dm" as const }))
  ], [channelIds, dmIds, channels, dms]);

  // Get selected channel ID from URL or default to first item - ensure synchronous initialization
  const urlChannelId = searchParams.get("channel");
  const firstItemId = useMemo(() => channelAndDmItems[0]?.id, [channelAndDmItems]);
  const selectedChannelId = useMemo(() => urlChannelId || firstItemId || "", [urlChannelId, firstItemId]);
  const selectedItem = useMemo(() => channelAndDmItems.find(item => item.id === selectedChannelId), [channelAndDmItems, selectedChannelId]);
  
  const rawMessages = useDemoMessages(selectedChannelId || "");
  // Memoize messages based on IDs to prevent reload when DM badges update
  const messagesKey = useMemo(() => rawMessages.map(m => m.id).join(','), [rawMessages]);
  const messages = useMemo(() => rawMessages, [messagesKey, selectedChannelId]);
  const { markChannelAsRead } = useDemoData();
  const isDM = useMemo(() => dms.some((d) => d.id === selectedChannelId), [dmIds, selectedChannelId]);
  const placeholder = useMemo(() => isDM ? "Reply..." : `Message #${selectedChannelId}`, [isDM, selectedChannelId]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const prevChannelIdRef = useRef<string>("");

  useLayoutEffect(() => {
    setActiveNav("activity");
  }, [setActiveNav]);

  // Use useLayoutEffect for synchronous URL update before paint
  // Only trigger when urlChannelId or firstItemId actually changes, not when DM badges update
  useLayoutEffect(() => {
    // Auto-select first item if no channel is selected - must happen synchronously
    if (!urlChannelId && channelAndDmItems.length > 0 && firstItemId) {
      router.replace(`/demo/workspace/${workspaceId}/activity?channel=${firstItemId}`, { scroll: false });
    }
  }, [urlChannelId, firstItemId, router, workspaceId]);

  useEffect(() => {
    if (selectedChannelId) {
      markChannelAsRead(selectedChannelId);
    }
  }, [selectedChannelId, markChannelAsRead]);

  // Disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const prevMessagesLengthRef = useRef<number>(0);
  const isNearBottomRef = useRef<boolean>(true);

  // Preserve scroll position and handle new messages naturally
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentLength = messages.length;
    const prevLength = prevMessagesLengthRef.current;
    const hasNewMessages = currentLength > prevLength;
    const channelChanged = prevChannelIdRef.current !== selectedChannelId;

    // Check if user is near bottom (within 100px of bottom)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (channelChanged) {
      // Channel changed - scroll to bottom immediately (no animation)
      if (messages.length > 0) {
        container.scrollTop = container.scrollHeight;
      }
      prevChannelIdRef.current = selectedChannelId;
      isNearBottomRef.current = true;
    } else if (hasNewMessages && isNearBottomRef.current) {
      // New messages added and user was at bottom - auto-scroll to show new content
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
    // Otherwise, preserve scroll position - don't touch it

    prevMessagesLengthRef.current = currentLength;
  }, [selectedChannelId, messages.length]);

  // Save scroll position and track if user is near bottom
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      scrollPositionRef.current = container.scrollTop;
      // Check if user is near bottom (within 100px)
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      isNearBottomRef.current = isNearBottom;
    }
  };

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
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ scrollBehavior: 'auto' }}
      >
        <DemoMessageList messages={messages} channelId={selectedChannelId} />
      </div>
      <div className="shrink-0 px-3 py-2">
        <DemoMessageInput channelId={selectedChannelId} placeholder={placeholder} />
      </div>
    </div>
  );
}
