"use client";

import { useState, useEffect } from "react";
import { DesktopSlackShell } from "../DesktopSlackShell";
import { Arc1SlackThread } from "./Arc1SlackThread";
import { Arc1AgentforcePanel } from "./Arc1AgentforcePanel";
import { useArcNavigation } from "@/context/ArcNavigationContext";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";

type Screen = 1 | 2 | 3 | 4 | 5;

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content?: string;
  blocks?: SlackBlock[];
  timestamp: Date;
}

export function Arc1Layout() {
  const arcNavigation = useArcNavigation();
  // Sync local screen state with arc navigation context
  const currentScreen = (arcNavigation.arcState.screen || 1) as Screen;
  const [stepperValue, setStepperValue] = useState<number>(500000);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [isSlackbotOpen, setIsSlackbotOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Auto-open panel for Arc 1
    setIsSlackbotOpen(true);
  }, []);

  // Main chat is static - no initialization needed
  useEffect(() => {
    setHasInitialized(true);
  }, []);

  // Reset local state when arc restarts (screen resets to 1)
  useEffect(() => {
    const isRestart = arcNavigation.arcState.screen === 1 && arcNavigation.arcState.arc === 1 && hasInitialized;
    if (isRestart) {
      setStepperValue(500000);
      setSelectedIntent(null);
      setMessages([]);
    }
  }, [arcNavigation.arcState.screen, arcNavigation.arcState.arc, hasInitialized]);

  const handleIntentSelect = (intent: string) => {
    setSelectedIntent(intent);

    if (intent === "🎯 Plan my Q1 commit" || intent === "🎯 Plan my Q1") {
      // Trigger panel flow - main chat stays static
      arcNavigation.setArcState({ arc: 1, screen: 2 });
      
      // Move to screen 3 after loading (minimum 3 seconds)
      setTimeout(() => {
        arcNavigation.setArcState({ arc: 1, screen: 3 });
      }, 3000);
    }
  };

  const handleScreenChange = (screen: Screen) => {
    arcNavigation.setArcState({ arc: 1, screen });
    
    // Auto-advance from loading to planning after 3 seconds
    if (screen === 2) {
      setTimeout(() => {
        arcNavigation.setArcState({ arc: 1, screen: 3 });
      }, 3000);
    }
  };

  const handleApprove = () => {
    // Add approval message
    const approvalMsg: ChatMessage = {
      id: `bot-approval-${Date.now()}`,
      role: "bot",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `✓ $${Math.round(stepperValue / 1000)}K committed. Here's what just happened:\n✓ Quota logged in Salesforce — confirmed\n✓ Forecast submitted to Sarah via Clari\n✓ Prospecting agent activated on ${stepperValue >= 600000 ? "12" : "8"} named accounts\n✓ Pipeline review meetings: reduced from 3→2/week (I'll handle the pipeline updates, you get the hour back)\n✓ Calendar protected: 2 mornings blocked for in-person meetings (your highest close-rate context)\n✓ Capacity ceiling set: 8 active deals max (based on your Q3 dilution pattern — protecting your rate)`,
          },
        },
      ],
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, approvalMsg]);

    arcNavigation.setArcState({ arc: 1, screen: 4 });
    setTimeout(() => {
      arcNavigation.setArcState({ arc: 1, screen: 5 });
      const nextStepsMsg: ChatMessage = {
        id: `bot-nextsteps-${Date.now()}`,
        role: "bot",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "You're set for Q1. A few things worth doing today:",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "👀 Show me the 12 accounts the agent is targeting" },
                action_id: "show_accounts",
              },
              {
                type: "button",
                text: { type: "plain_text", text: "📞 Who should I call personally this week?" },
                action_id: "who_to_call",
              },
              {
                type: "button",
                text: { type: "plain_text", text: "📋 What did Sarah say about my commit?" },
                action_id: "sarah_feedback",
              },
              {
                type: "button",
                text: { type: "plain_text", text: "⚡ What's the one deal I should focus on today?" },
                action_id: "focus_deal",
              },
            ],
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: { type: "mrkdwn", text: "Or just ask me anything about your quarter." },
              },
            ],
          },
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, nextStepsMsg]);
    }, 4000);
  };

  const handleQuickPrompt = (prompt: string) => {
    // Add user prompt message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    console.log("Quick prompt:", prompt);
  };

  const handleMessageSend = (message: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    
    // Auto-reply after delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: "I'm here to help with your Q1 planning. What would you like to know?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <DesktopSlackShell 
      defaultNav="dms" 
      defaultChannelId="slackbot" 
      hideHeader={false}
      customChatContent={
        <Arc1SlackThread
          currentScreen={currentScreen}
          stepperValue={stepperValue}
          selectedIntent={selectedIntent}
          messages={messages}
          onIntentSelect={handleIntentSelect}
          onApprove={handleApprove}
          onQuickPrompt={handleQuickPrompt}
          onMessageSend={handleMessageSend}
        />
      }
      customSlackbotPanel={
        <Arc1AgentforcePanel
          currentScreen={currentScreen}
          stepperValue={stepperValue}
          onStepperChange={setStepperValue}
          onApprove={handleApprove}
          onMessageSend={handleMessageSend}
          onScreenChange={handleScreenChange}
        />
      }
      forceSlackbotOpen={isSlackbotOpen}
    />
  );
}
