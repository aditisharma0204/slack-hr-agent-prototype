"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { DemoMessageList } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageList";
import { useDemoMessages, useDemoData, type DemoMessage } from "@/context/DemoDataContext";
import { MessageInput } from "@/components/shared/MessageInput";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

interface ChatEngineProps {
  channelId: string;
}

// Mock AI responses for auto-reply
const AI_RESPONSES: Record<string, string[]> = {
  slackbot: [
    "I've updated the CRM and flagged the budget objection for your review.",
    "The deal has been moved to the next stage. I'll notify you when the contract is signed.",
    "I've analyzed the pipeline and identified 3 deals that need immediate attention.",
    "The follow-up email has been scheduled for tomorrow at 10 AM.",
  ],
  "sarah-chen": [
    "Thanks for the update! I'll review the proposal and get back to you by EOD.",
    "Got it. Let me check with the team and circle back.",
  ],
  "jordan-hayes": [
    "Perfect timing! I was just about to reach out about this.",
    "I've shared this with the product team. They'll review it this week.",
  ],
  "priya-shah": [
    "This looks great! I'll add it to our sprint planning.",
    "Thanks for flagging this. I'll prioritize it.",
  ],
};

export function ChatEngine({ channelId }: ChatEngineProps) {
  const currentMessages = useDemoMessages(channelId);
  const [chatMessages, setChatMessages] = useState<DemoMessage[]>(currentMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(currentMessages.length);
  const prevChannelIdRef = useRef<string>("");
  const isNearBottomRef = useRef<boolean>(true);
  const { markChannelAsRead, channels, dms } = useDemoData();
  
  // Get channel/DM name for header
  const channel = channels.find((c) => c.id === channelId) ?? dms.find((d) => d.id === channelId);
  const name = channel?.name ?? channelId;
  const isChannel = !!channels.find((c) => c.id === channelId);
  const displayName = isChannel ? `#${name}` : name;

  // Track scroll position to detect if user is near bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      isNearBottomRef.current = isNearBottom;
    }
  };

  // Handle channel changes - scroll to bottom when channel changes
  useEffect(() => {
    const channelChanged = prevChannelIdRef.current !== channelId;
    prevChannelIdRef.current = channelId;
    
    if (channelChanged && messagesContainerRef.current) {
      // Channel changed - scroll to bottom immediately
      isNearBottomRef.current = true;
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
    
    if (channelId) {
      markChannelAsRead(channelId);
    }
  }, [channelId, markChannelAsRead]);

  // Update messages when messages actually change (based on IDs)
  useEffect(() => {
    const messagesKey = currentMessages.map(m => m.id).join(',');
    const prevKey = chatMessages.map(m => m.id).join(',');
    
    // Only update if messages actually changed
    if (messagesKey !== prevKey) {
      setChatMessages(currentMessages);
    }
  }, [currentMessages, chatMessages]);

  // Auto-scroll to bottom only when new messages are added AND user is at bottom (no animation)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentLength = chatMessages.length;
    const prevLength = prevMessagesLengthRef.current;
    const hasNewMessages = currentLength > prevLength;

    if (hasNewMessages && isNearBottomRef.current) {
      // New messages added and user was at bottom - auto-scroll to show new content
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
    // Otherwise, preserve scroll position - don't touch it
    
    prevMessagesLengthRef.current = currentLength;
  }, [chatMessages]);

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: DemoMessage = {
      id: `user-${Date.now()}`,
      author: "Rita Patel",
      authorImage: "https://randomuser.me/api/portraits/med/women/75.jpg",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      body: messageText.trim(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Auto-reply after 1.5 seconds
    setTimeout(() => {
      const responses = AI_RESPONSES[channelId] || AI_RESPONSES.slackbot;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const aiMessage: DemoMessage = {
        id: `ai-${Date.now()}`,
        author: channelId === "slackbot" ? "Slackbot" : "Agentforce",
        authorImage: channelId === "slackbot" ? "/slackbot-logo.svg" : undefined,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        body: randomResponse,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Channel/DM Header */}
      <header
        className="flex items-center shrink-0 border-b bg-white px-4 h-[49px]"
        style={{ borderColor: T.colors.border }}
      >
        <span className="text-[18px] font-semibold" style={{ color: T.colors.text }}>
          {displayName}
        </span>
      </header>
      <div 
        ref={messagesContainerRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ scrollBehavior: 'auto' }}
      >
        <DemoMessageList messages={chatMessages} channelId={channelId} />
        <div ref={messagesEndRef} />
      </div>
      <div className="shrink-0 px-3 py-2">
        <MessageInput
          placeholder="Reply..."
          onSubmit={handleSendMessage}
          value={inputText}
          onChange={setInputText}
        />
      </div>
    </div>
  );
}
