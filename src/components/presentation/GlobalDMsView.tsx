"use client";

import { useState, useEffect, useRef } from 'react';
import { UniversalChatSurface } from '@/components/shared/UniversalChatSurface';
import { ChatMessage } from '@/components/shared/ChatMessage';
import { getAvatarUrl } from '@/context/DemoDataContext';
import type { DemoDM } from '@/context/DemoDataContext';

// Generic global dummy DMs with detailed fictional B2B chat history
export interface ChatHistoryMessage {
  name: string;
  avatar: string;
  time: string;
  text: string;
  isBot?: boolean;
  reactions?: Array<{ emoji: string; count: number }>;
  attachment?: {
    filename: string;
    type: 'pdf' | 'doc' | 'sheet' | 'slide';
    size: string;
  };
  threadCount?: number;
}

export interface ExtendedDemoDM extends DemoDM {
  role?: string;
  time?: string;
  preview?: string;
  history?: ChatHistoryMessage[];
}

export const GENERIC_GLOBAL_DMS: ExtendedDemoDM[] = [
  {
    id: "slackbot",
    name: "Slackbot",
    status: "online",
    avatarUrl: "/slackbot-logo.svg",
    role: "System",
    time: "9:00 AM",
    preview: "Reminder: Submit your expense reports by EOD.",
    history: [
      { name: "Slackbot", isBot: true, avatar: "/slackbot-logo.svg", time: "Monday", text: "Hi Rita! Welcome to the workspace. I am here to help you navigate channels, reminders, and automations." },
      { name: "Slackbot", isBot: true, avatar: "/slackbot-logo.svg", time: "Yesterday", text: "You were added to #deal-vanguard-swarm by Sarah Chen.", reactions: [{ emoji: "✅", count: 1 }] },
      { name: "Slackbot", isBot: true, avatar: "/slackbot-logo.svg", time: "9:00 AM", text: "Reminder: Submit your expense reports by EOD today." }
    ]
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    status: "online",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg",
    role: "VP Sales",
    time: "11:42 AM",
    preview: "Great work on Vanguard. Let us review the board deck at 2 PM.",
    history: [
      {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/med/women/44.jpg",
        time: "Yesterday",
        text: "Rita, can you drop the latest QBR deck here? I need to review pipeline metrics before the board meeting.",
        reactions: [{ emoji: "👀", count: 1 }]
      },
      {
        name: "Rita Patel",
        avatar: "",
        time: "Yesterday",
        text: "Just finished it. I added the logo projections and regional expansion notes we discussed.",
        attachment: { filename: "Q3_QBR_Final_v2.slide", type: "slide", size: "4.2 MB" },
        reactions: [{ emoji: "🙌", count: 1 }, { emoji: "🔥", count: 2 }]
      },
      {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/med/women/44.jpg",
        time: "11:42 AM",
        text: "Looks solid. Great work.",
        threadCount: 3
      }
    ]
  },
  {
    id: "jordan-hayes",
    name: "Jordan Hayes",
    status: "online",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/22.jpg",
    role: "Solutions Engineer",
    time: "10:05 AM",
    preview: "Here is the architecture one-pager for the client dev team.",
    history: [
      {
        name: "Rita Patel",
        avatar: "",
        time: "Tuesday",
        text: "Jordan, client asked how our API handles rate limiting at peak load. Can you clarify?"
      },
      {
        name: "Jordan Hayes",
        avatar: "https://randomuser.me/api/portraits/med/men/22.jpg",
        time: "Tuesday",
        text: "Standard tier throttles at 5k/min, with burst to 10k for 60s. Sharing a one-pager for their dev team.",
        attachment: { filename: "API_Rate_Limits_Doc.pdf", type: "pdf", size: "1.1 MB" }
      },
      {
        name: "Rita Patel",
        avatar: "",
        time: "10:05 AM",
        text: "Perfect, sending this over now.",
        reactions: [{ emoji: "✅", count: 1 }]
      }
    ]
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    status: "away",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/32.jpg",
    role: "Legal",
    time: "Yesterday",
    preview: "MSA redlines are attached. Standard indemnification applies.",
    history: [
      { name: "Priya Shah", avatar: "https://randomuser.me/api/portraits/med/women/32.jpg", time: "Yesterday", text: "Rita, legal marked one risky indemnification clause." },
      {
        name: "Priya Shah",
        avatar: "https://randomuser.me/api/portraits/med/women/32.jpg",
        time: "Yesterday",
        text: "Uploading clean redline packet.",
        attachment: { filename: "Vanguard_MSA_Redlines.doc", type: "doc", size: "892 KB" }
      },
      { name: "Rita Patel", avatar: "", time: "Yesterday", text: "Received. Sending to procurement now.", reactions: [{ emoji: "🙏", count: 1 }] }
    ]
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    status: "online",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/41.jpg",
    role: "Marketing",
    time: "Monday",
    preview: "Q4 campaign assets are live in Highspot.",
    history: [
      {
        name: "Alex Rivera",
        avatar: "https://randomuser.me/api/portraits/med/men/41.jpg",
        time: "Monday",
        text: "Q4 campaign assets are live in Highspot. Want custom battlecards for enterprise accounts?",
        reactions: [{ emoji: "🚀", count: 3 }]
      }
    ]
  },
  {
    id: "nina-kapoor",
    name: "Nina Kapoor",
    status: "away",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/58.jpg",
    role: "Security",
    time: "Today",
    preview: "SOC2 bridge letter approved and uploaded.",
    history: [
      { name: "Nina Kapoor", avatar: "https://randomuser.me/api/portraits/med/women/58.jpg", time: "Today", text: "Uploading SOC2 bridge letter and pen-test summary.", attachment: { filename: "SOC2_Bridge_2026.pdf", type: "pdf", size: "2.3 MB" } },
      { name: "Rita Patel", avatar: "", time: "Today", text: "This will unblock the security committee. Thank you!", reactions: [{ emoji: "👏", count: 2 }] }
    ]
  },
  {
    id: "owen-brooks",
    name: "Owen Brooks",
    status: "online",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/17.jpg",
    role: "Implementation",
    time: "Yesterday",
    preview: "Kickoff plan drafted: discovery, mapping, and UAT.",
    history: [
      {
        name: "Owen Brooks",
        avatar: "https://randomuser.me/api/portraits/med/men/17.jpg",
        time: "Yesterday",
        text: "Sharing kickoff timeline for day-30 first value target.",
        attachment: { filename: "Implementation_Kickoff.sheet", type: "sheet", size: "640 KB" }
      },
      { name: "Rita Patel", avatar: "", time: "Yesterday", text: "Exactly what we needed for signature confidence.", reactions: [{ emoji: "🙌", count: 1 }] }
    ]
  }
];

interface GlobalDMsViewProps {
  activeDmId?: string;
  onDmSelect?: (id: string) => void;
  /** Optional custom DM list. If provided, uses this instead of GENERIC_GLOBAL_DMS */
  dms?: ExtendedDemoDM[];
}

export function GlobalDMsView({ activeDmId: propActiveDmId, onDmSelect: propOnDmSelect, dms: propDms }: GlobalDMsViewProps = {}) {
  const [internalActiveDmId, setInternalActiveDmId] = useState<string>('');

  // Use custom DMs if provided, otherwise fall back to GENERIC_GLOBAL_DMS
  const dmList = propDms && propDms.length > 0 ? propDms : GENERIC_GLOBAL_DMS;

  // Use prop if provided, otherwise use internal state
  const activeDmId = propActiveDmId !== undefined ? propActiveDmId : internalActiveDmId;
  
  // Use ref pattern to stabilize onDmSelect callback and prevent infinite loops
  // This ensures the useEffect doesn't re-run when the function reference changes
  const onDmSelectRef = useRef(propOnDmSelect || setInternalActiveDmId);
  useEffect(() => {
    onDmSelectRef.current = propOnDmSelect || setInternalActiveDmId;
  }, [propOnDmSelect]);

  // Auto-select the first DM on mount if no active DM is set
  useEffect(() => {
    if (!activeDmId && dmList.length > 0) {
      onDmSelectRef.current(dmList[0].id);
    }
  }, [activeDmId, dmList]); // Removed onDmSelect from deps - using ref pattern instead

  const activeDm = dmList.find(d => d.id === activeDmId) || dmList[0];

  if (!activeDm) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No messages available
      </div>
    );
  }

  const avatarUrl = activeDm.avatarUrl || getAvatarUrl(activeDm.name, 40);
  const extendedDm = activeDm as ExtendedDemoDM;
  const chatHistory = extendedDm.history || [];

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <UniversalChatSurface 
        title={activeDm.name}
        icon={
          <img 
            src={avatarUrl} 
            className="w-5 h-5 rounded" 
            alt={activeDm.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getAvatarUrl(activeDm.name, 40);
            }}
          />
        }
        placeholder={`Message ${activeDm.name}`}
        onSendMessage={(text) => {
          console.log('Global shell message sent:', text);
          // In a real implementation, this would send the message
        }}
      >
        {/* Render detailed chat history if available */}
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, idx) => {
            // Use provided avatar, or generate one for Rita Patel, or fallback to getAvatarUrl
            const msgAvatar = msg.avatar || (msg.name === "Rita Patel" ? getAvatarUrl("Rita Patel", 40) : getAvatarUrl(msg.name, 40));
            return (
              <ChatMessage
                key={`${activeDm.id}-msg-${idx}`}
                message={{
                  id: `${activeDm.id}-msg-${idx}`,
                  name: msg.name,
                  avatar: msgAvatar,
                  time: msg.time,
                  text: msg.text,
                  isBot: msg.isBot,
                  reactions: msg.reactions,
                  attachment: msg.attachment,
                  threadCount: msg.threadCount,
                }}
              />
            );
          })
        ) : (
          <>
            {/* Fallback placeholder if no history */}
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <img 
                src={avatarUrl} 
                className="w-16 h-16 rounded-lg mb-4" 
                alt={activeDm.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getAvatarUrl(activeDm.name, 64);
                }}
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                This is the beginning of your direct message history with {activeDm.name}.
              </h3>
              <p className="text-sm text-gray-500">
                Messages you send will appear here.
              </p>
            </div>
            
            {/* Generic greeting message */}
            <ChatMessage 
              message={{ 
                id: `greeting-${activeDm.id}`,
                name: activeDm.name, 
                avatar: avatarUrl,
                time: '9:00 AM', 
                text: `Hi Rita, let me know if you need anything today.`, 
              }} 
            />
          </>
        )}
      </UniversalChatSurface>
    </div>
  );
}
