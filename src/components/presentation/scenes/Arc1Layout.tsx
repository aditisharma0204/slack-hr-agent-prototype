"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DesktopSlackShell, useActiveChat } from "../DesktopSlackShell";
import { Arc1SlackThread } from "./Arc1SlackThread";
import { Arc1AgentforcePanel } from "./Arc1AgentforcePanel";
import { ChatEngine } from "../ChatEngine";
import { useArcNavigation } from "@/context/ArcNavigationContext";
import { useDemoData } from "@/context/DemoDataContext";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";

type Screen = 1 | 2 | 3 | 4 | 5;

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content?: string;
  blocks?: SlackBlock[];
  timestamp: Date;
}

// Panel feed item types for array-based feed architecture
type PanelFeedItemType = 'greeting' | 'loading' | 'planner' | 'confirmation' | 'next-steps';

interface PanelFeedItem {
  id: string;
  type: PanelFeedItemType;
  data?: {
    stepperValue?: number;
  };
}

export function Arc1Layout() {
  const arcNavigation = useArcNavigation();
  // Sync local screen state with arc navigation context
  const currentScreen = (arcNavigation.arcState.screen || 1) as Screen;
  const [stepperValue, setStepperValue] = useState<number>(500000);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Panel starts closed - only opens when CTA is clicked
  // Panel feed array - replaces screen-based logic to prevent unmounting/re-animation
  const [panelFeed, setPanelFeed] = useState<PanelFeedItem[]>([]);
  // Initialize with welcome message for Slackbot DM
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-q4",
      role: "bot",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Good morning Rita. Q4 wrapped: *$471K attained* (94% of $500K quota). Win rate 52% ↑ from Q3. Here's your Q1 snapshot.",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "⚠️ *You missed your accelerator by $29K last quarter.*\nThat was $4.2K in commission left on the table.",
          },
        },
      ],
      timestamp: new Date(),
    },
  ]);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Primary navigation state - start in Activity tab
  const [primaryNav, setPrimaryNav] = useState<"activity" | "dms">("activity");
  const [showDMBadge, setShowDMBadge] = useState(false);
  
  // Get initial channel for Activity view (deal-runners or first available)
  const { channels } = useDemoData();
  const initialChannelId = channels.find(c => c.id === "deal-runners")?.id || channels[0]?.id || "general";
  const [activeChatId, setActiveChatId] = useState<string>(initialChannelId);

  // Main chat is static - no initialization needed
  useEffect(() => {
    setHasInitialized(true);
  }, []);

  // AI finishing work timer - show DM badge after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDMBadge(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle primary navigation change
  const handlePrimaryNavChange = (nav: "activity" | "dms") => {
    setPrimaryNav(nav);
    if (nav === "dms") {
      // Clear badge when DMs is clicked
      setShowDMBadge(false);
      // Route to slackbot DM
      setActiveChatId("slackbot");
      // Reset messages to show welcome message with Q4 snapshot
      setMessages([
        {
          id: "welcome-q4",
          role: "bot",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "Good morning Rita. Q4 wrapped: *$471K attained* (94% of $500K quota). Win rate 52% ↑ from Q3. Here's your Q1 snapshot.",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "⚠️ *You missed your accelerator by $29K last quarter.*\nThat was $4.2K in commission left on the table.",
              },
            },
          ],
          timestamp: new Date(),
        },
      ]);
      // Reset screen to 1 when opening DMs
      arcNavigation.setArcState({ arc: 1, screen: 1 });
    } else if (nav === "activity") {
      // Return to initial channel when switching back to activity
      setActiveChatId(initialChannelId);
    }
  };

  // Handle card clicks from Activity sidebar - update activeChatId directly
  useEffect(() => {
    // This effect ensures that when a card is clicked in Activity view,
    // the activeChatId updates immediately without jitter
  }, [activeChatId]);

  // Track restart key to force card remount and reset animations
  const [restartKey, setRestartKey] = useState(0);
  const prevRestartCounterRef = useRef<number>(0);
  
  // Reset function to be called when restart is detected
  const resetArc1State = useCallback(() => {
    setStepperValue(500000);
    setSelectedIntent(null);
    setIsPanelOpen(false);
    setPanelFeed([]); // Reset panel feed
    setPrimaryNav("activity");
    setShowDMBadge(false);
    setActiveChatId(initialChannelId);
    setRestartKey(prev => prev + 1); // Force card remount
    setMessages([
      {
        id: "welcome-q4",
        role: "bot",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Good morning Rita. Q4 wrapped: *$471K attained* (94% of $500K quota). Win rate 52% ↑ from Q3. Here's your Q1 snapshot.",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "⚠️ *You missed your accelerator by $29K last quarter.*\nThat was $4.2K in commission left on the table.",
            },
          },
        ],
        timestamp: new Date(),
      },
    ]);
    
    // Reset DM badge timer
    setTimeout(() => {
      setShowDMBadge(true);
    }, 2500);
  }, [initialChannelId]);
  
  // Reset local state when arc restarts - listen to restartCounter
  useEffect(() => {
    const currentArc = arcNavigation.arcState.arc;
    const currentScreen = arcNavigation.arcState.screen;
    const currentRestartCounter = arcNavigation.restartCounter;
    const prevRestartCounter = prevRestartCounterRef.current;
    
    // Detect restart: restartCounter changed and we're in arc 1
    if (currentArc === 1 && currentScreen === 1 && currentRestartCounter !== prevRestartCounter) {
      resetArc1State();
    }
    
    // Always update prevRestartCounterRef at the end
    prevRestartCounterRef.current = currentRestartCounter;
  }, [arcNavigation.restartCounter, arcNavigation.arcState.arc, arcNavigation.arcState.screen, resetArc1State]);

  const handleIntentSelect = (intent: string) => {
    setSelectedIntent(intent);

    if (intent === "🎯 Plan my Q1 commit" || intent === "🎯 Plan my Q1") {
      // Open the panel when Q1 planning CTA is clicked - start directly with loading
      setIsPanelOpen(true);
      // Initialize feed with loading state (no greeting - that's in main chat)
      setPanelFeed([{ id: 'loading-1', type: 'loading' }]);
      // Trigger panel flow - main chat stays static
      arcNavigation.setArcState({ arc: 1, screen: 2 });
      
      // Add planner after loading completes (minimum 3 seconds)
      setTimeout(() => {
        setPanelFeed(prev => {
          // Remove loading, add planner
          const withoutLoading = prev.filter(item => item.type !== 'loading');
          return [...withoutLoading, { id: 'planner-1', type: 'planner', data: { stepperValue } }];
        });
        arcNavigation.setArcState({ arc: 1, screen: 3 });
      }, 3000);
    }
  };

  const handleScreenChange = (screen: Screen) => {
    arcNavigation.setArcState({ arc: 1, screen });
    
    // Auto-advance from loading to planning after 3 seconds
    // Only update feed if loading exists and planner doesn't exist yet
    if (screen === 2) {
      setTimeout(() => {
        setPanelFeed(prev => {
          const hasLoading = prev.some(item => item.type === 'loading');
          const hasPlanner = prev.some(item => item.type === 'planner');
          if (hasLoading && !hasPlanner) {
            const withoutLoading = prev.filter(item => item.type !== 'loading');
            return [...withoutLoading, { id: 'planner-1', type: 'planner', data: { stepperValue } }];
          }
          return prev; // Don't update if already processed
        });
        arcNavigation.setArcState({ arc: 1, screen: 3 });
      }, 3000);
    }
  };


  const handleApprove = () => {
    // Don't add messages to main chat - all post-approval UI goes to right panel
    // Add confirmation checklist block (animated checkmarks)
    setPanelFeed(prev => {
      const newFeed = [...prev, { id: 'confirmation-1', type: 'confirmation', data: { stepperValue } }];
      return newFeed;
    });
    arcNavigation.setArcState({ arc: 1, screen: 4 });
    // Next-steps will be added when checklist completes via handleChecklistComplete callback
  };

  // Callback to add next-steps when checklist animation completes
  const handleChecklistComplete = useCallback(() => {
    setPanelFeed(prev => {
      // Prevent duplicate next-steps items
      const hasNextSteps = prev.some(item => item.type === 'next-steps');
      if (hasNextSteps) {
        return prev; // Don't add duplicate
      }
      const newFeed = [...prev, { id: 'next-steps-1', type: 'next-steps', data: { stepperValue } }];
      
      // Trigger scroll after feed updates - use setTimeout to ensure React has rendered
      setTimeout(() => {
        // Dispatch custom event that panel can listen to
        window.dispatchEvent(new CustomEvent('scroll-to-next-steps'));
      }, 200);
      
      return newFeed;
    });
    arcNavigation.setArcState({ arc: 1, screen: 5 });
  }, [stepperValue]);

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

  // Component that conditionally renders based on primaryNav and activeChatId
  // This is rendered as customChatContent, so it has access to ActiveChatContext
  function Arc1ConditionalChat() {
    const { activeChatId: contextActiveChatId, setActiveChatId: setContextActiveChatId } = useActiveChat();
    
    // Sync DMs view - ensure slackbot is always selected
    useEffect(() => {
      if (primaryNav === "dms" && contextActiveChatId !== "slackbot") {
        setContextActiveChatId("slackbot");
      }
    }, [primaryNav, contextActiveChatId, setContextActiveChatId]);

    // When primaryNav is 'dms', always show slackbot thread
    if (primaryNav === "dms") {
      return (
        <Arc1SlackThread
          key={`slack-thread-${restartKey}`}
          currentScreen={currentScreen}
          stepperValue={stepperValue}
          selectedIntent={selectedIntent}
          messages={messages}
          onIntentSelect={handleIntentSelect}
          onApprove={handleApprove}
          onQuickPrompt={handleQuickPrompt}
          onMessageSend={handleMessageSend}
        />
      );
    }

    // When primaryNav is 'activity', show ChatEngine for the selected channel
    // Use contextActiveChatId (from sidebar clicks) or fall back to local activeChatId
    const channelIdToShow = contextActiveChatId || activeChatId;
    return <ChatEngine channelId={channelIdToShow} />;
  }
  

  return (
    <DesktopSlackShell 
      defaultNav={primaryNav}
      defaultChannelId={primaryNav === "dms" ? "slackbot" : activeChatId}
      hideHeader={false}
      customChatContent={<Arc1ConditionalChat />}
      customSlackbotPanel={isPanelOpen ? (
        <Arc1AgentforcePanel
          currentScreen={currentScreen}
          panelFeed={panelFeed}
          stepperValue={stepperValue}
          onStepperChange={setStepperValue}
          onApprove={handleApprove}
          onChecklistComplete={handleChecklistComplete}
          onMessageSend={handleMessageSend}
          onScreenChange={handleScreenChange}
          onQuickPrompt={handleQuickPrompt}
          onClose={() => {
            setIsPanelOpen(false);
            setPanelFeed([]); // Reset feed when panel closes
          }}
        />
      ) : null}
      forceSlackbotOpen={isPanelOpen}
      onSlackbotToggle={(isOpen) => {
        setIsPanelOpen(isOpen);
        if (!isOpen) {
          setPanelFeed([]); // Reset feed when panel closes via header toggle
        }
      }} // Sync AppHeader toggle with Arc1Layout state
      onPrimaryNavChange={handlePrimaryNavChange}
      showDMBadge={showDMBadge}
    />
  );
}
