"use client";

import { useState, useEffect, useRef } from "react";
// DemoChannelHeader removed - on-hover header comes on top
import { DemoMessageList } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageList";
import { useDemoMessages, useDemoData, type DemoMessage } from "@/context/DemoDataContext";
import { MessageInput } from "@/components/shared/MessageInput";

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
  const initialMessages = useDemoMessages(channelId);
  const [chatMessages, setChatMessages] = useState<DemoMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { markChannelAsRead } = useDemoData();
  const currentMessages = useDemoMessages(channelId);

  // Update messages when channelId changes
  useEffect(() => {
    setChatMessages(currentMessages);
    markChannelAsRead(channelId);
  }, [channelId, markChannelAsRead, currentMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      {/* Header removed - on-hover header comes on top */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto min-h-0">
        <DemoMessageList messages={chatMessages} />
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
