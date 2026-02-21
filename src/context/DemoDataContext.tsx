"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface DemoMessage {
  id: string;
  author: string;
  authorImage?: string | null;
  timestamp: string;
  body?: string | null;
  blocks?: SlackBlock[] | null;
}

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: Array<{ type: string; text: string }>;
  elements?: Array<{
    type: string;
    text: { type: string; text: string; emoji?: boolean };
    action_id?: string;
    style?: string;
  }>;
}

export interface DemoWorkspace {
  id: string;
  name: string;
}

export interface DemoChannel {
  id: string;
  name: string;
  unread?: boolean;
}

export interface DemoDM {
  id: string;
  name: string;
  isSlackbot?: boolean;
  avatarUrl?: string; // Optional avatar; falls back to UI Avatars from name
  status?: "online" | "away" | "dnd" | "call"; // Status indicator
  unread?: boolean; // For Unreads toggle filter
}

export interface DemoFile {
  id: string;
  name: string;
  channelId: string;
  timestamp: string;
}

export interface DemoSavedItem {
  id: string;
  channelId: string;
  preview: string;
  timestamp: string;
}

export interface DemoActivityPost {
  id: string;
  author: string;
  authorImage?: string;
  channelId: string;
  channelName: string;
  content: string;
  timestamp: string;
  read?: boolean;
  commentCount?: number;
  type?: "post" | "dm";
}

const DEMO_WORKSPACE: DemoWorkspace = { id: "demo-1", name: "Vibeface" };
const DEMO_CHANNELS: DemoChannel[] = [
  { id: "general", name: "general", unread: true },
  { id: "sales", name: "sales", unread: true },
  { id: "q3-pipeline", name: "q3-pipeline", unread: true },
  { id: "deal-acme", name: "deal-acme", unread: true },
  { id: "deal-runners", name: "deal-runners" },
  { id: "deal-greentech", name: "deal-greentech" },
  { id: "deal-sporty", name: "deal-sporty" },
  { id: "deal-techstart", name: "deal-techstart" },
];
// Avatar helper: fallback to initials for channels; DMs use explicit avatarUrl (real photos)
export function getAvatarUrl(name: string, size = 64): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=611f69&color=fff&size=${size}`;
}

// Author name -> avatar URL for chat messages (human photos + Slackbot logo)
const MESSAGE_AVATAR_MAP: Record<string, string> = {
  "Rita Patel": "https://randomuser.me/api/portraits/med/women/75.jpg",
  Slackbot: "/slackbot-logo.svg",
  "Sarah Chen": "https://randomuser.me/api/portraits/med/women/44.jpg",
  "Priya Shah": "https://randomuser.me/api/portraits/med/women/32.jpg",
  "Jordan Hayes": "https://randomuser.me/api/portraits/med/men/22.jpg",
  "Dana Torres": "https://randomuser.me/api/portraits/med/women/28.jpg",
  "Marcus Lee": "https://randomuser.me/api/portraits/med/men/8.jpg",
  "Lisa Park": "https://randomuser.me/api/portraits/med/women/65.jpg",
  "Daniel Kim": "https://randomuser.me/api/portraits/med/men/33.jpg",
  "Mike Torres": "https://randomuser.me/api/portraits/med/men/45.jpg",
  "Jen Walsh": "https://randomuser.me/api/portraits/med/women/52.jpg",
  "Srinivas Tallapragada": "https://randomuser.me/api/portraits/med/men/33.jpg",
  "Jack Lakkapragada": "https://randomuser.me/api/portraits/med/men/45.jpg",
  "Mike Lenz": "https://randomuser.me/api/portraits/med/men/46.jpg",
};

export function getMessageAvatarUrl(author: string): string | null {
  return MESSAGE_AVATAR_MAP[author] ?? null;
}

// Real human photos from RandomUser.me (portraits 0-99 for men/women)
// All DMs must have meaningful preview data - see DM_PREVIEWS above
const DEMO_DMS: DemoDM[] = [
  { id: "slackbot", name: "Slackbot", isSlackbot: true, unread: true },
  { id: "sarah-chen", name: "Sarah Chen", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg", unread: true },
  { id: "priya-shah", name: "Priya Shah", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/women/32.jpg" },
  { id: "jordan-hayes", name: "Jordan Hayes", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/men/22.jpg", unread: true },
  { id: "dana-torres", name: "Dana Torres", status: "dnd", avatarUrl: "https://randomuser.me/api/portraits/med/women/28.jpg" },
  { id: "marcus-lee", name: "Marcus Lee", status: "call", avatarUrl: "https://randomuser.me/api/portraits/med/men/8.jpg", unread: true },
  { id: "lisa-park", name: "Lisa Park", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/65.jpg" },
  // Additional contacts from fictional universe
  { id: "daniel-kim", name: "Daniel Kim", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/men/33.jpg" },
  { id: "mike-torres", name: "Mike Torres", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/men/45.jpg" },
];

const DEMO_FILES: DemoFile[] = [
  { id: "f1", name: "Q3 Pipeline Deck.pdf", channelId: "q3-pipeline", timestamp: "Yesterday" },
  { id: "f2", name: "Greentech SOW Draft.docx", channelId: "deal-greentech", timestamp: "Yesterday" },
  { id: "f3", name: "TechStart QBR Slides.pptx", channelId: "deal-techstart", timestamp: "Today" },
  { id: "f4", name: "Runners Club Value Justification.pdf", channelId: "deal-runners", timestamp: "Today" },
  { id: "f5", name: "Acme Org Chart & Champions.docx", channelId: "deal-acme", timestamp: "Today" },
];

const DEMO_SAVED: DemoSavedItem[] = [
  { id: "s1", channelId: "general", preview: "Champion departed: Acme Corp — Marcus left...", timestamp: "10:36 AM" },
  { id: "s2", channelId: "sales", preview: "Meeting prep ready for TechStart QBR at 2:00 PM", timestamp: "9:16 AM" },
  { id: "s3", channelId: "slackbot", preview: "Proactive insights for today — $410K on track", timestamp: "Today" },
];

const DEMO_ACTIVITY_POSTS: DemoActivityPost[] = [
  {
    id: "ap1",
    author: "Srinivas Tallapragada",
    authorImage: "https://randomuser.me/api/portraits/med/men/33.jpg",
    channelId: "general",
    channelName: "all-salesforce",
    content: "Great blog post from @Irina Malkova on we rolled out informatica help agent in 24 days. ...",
    timestamp: "8:31 PM",
    read: true,
    type: "post",
  },
  {
    id: "ap2",
    author: "Jack Lakkapragada",
    authorImage: "https://randomuser.me/api/portraits/med/men/45.jpg",
    channelId: "general",
    channelName: "ai-club",
    content: "New Course: Duke ML Foundations for Product Managers ...",
    timestamp: "10:20 AM",
    read: false,
    type: "post",
  },
  {
    id: "ap3",
    author: "Sarah Chen",
    authorImage: "https://randomuser.me/api/portraits/med/women/44.jpg",
    channelId: "sales",
    channelName: "sales",
    content: "SmartFit replied to the follow-up email. Next steps: schedule demo.",
    timestamp: "Yesterday",
    read: false,
    type: "post",
  },
  {
    id: "ap4",
    author: "Jordan Hayes",
    authorImage: "https://randomuser.me/api/portraits/med/men/22.jpg",
    channelId: "q3-pipeline",
    channelName: "q3-pipeline",
    content: ">> 258.15 Patch QA to Test and Close: 1 open work item...",
    timestamp: "8:27 PM",
    read: false,
    commentCount: 1,
    type: "post",
  },
  {
    id: "ap5",
    author: "Mike Lenz",
    authorImage: "https://randomuser.me/api/portraits/med/men/46.jpg",
    channelId: "sarah-chen",
    channelName: "sarah-chen",
    content: "I want you to take maestro. And update it with the latest thinking. RE slack bot. ...",
    timestamp: "9:45 AM",
    read: true,
    type: "dm",
  },
];

export const DEMO_USER_NAME = "Rita";

// Fictional preview data for channels and DMs - ensures all cards have meaningful content
const CHANNEL_PREVIEWS: Record<string, { preview: string; timestamp: string }> = {
  "general": { preview: "Company-wide updates and announcements", timestamp: "Today" },
  "sales": { preview: "SmartFit replied to the follow-up — positive tone. Vibeface prepping demo deck.", timestamp: "9:45 AM" },
  "q3-pipeline": { preview: "Plan status: *$430K on track* after Greentech SO...", timestamp: "Yesterday" },
  "deal-acme": { preview: "Sent intro to Priya via Sarah. Daniel Kim — can we pull the...", timestamp: "Today" },
  "deal-runners": { preview: "30-min call with Jordan set for 4 PM. Vibeface prepping...", timestamp: "10:15 AM" },
  "deal-greentech": { preview: "Following up with Priya on SOW. She's been responsive.", timestamp: "Today" },
  "deal-sporty": { preview: "Reaching out to Mike Torres. Dana's team might be in flux.", timestamp: "Today" },
  "deal-techstart": { preview: "Reviewed the brief. Ready for the call.", timestamp: "9:30 AM" },
};

const DM_PREVIEWS: Record<string, { preview: string; timestamp: string }> = {
  "slackbot": { preview: "Proactive insights for today — $410K on track", timestamp: "Today" },
  "sarah-chen": { preview: "Done. Priya should have it. Good luck...", timestamp: "Yesterday" },
  "priya-shah": { preview: "Thanks Priya! Let me know if legal has any...", timestamp: "10:20 AM" },
  "jordan-hayes": { preview: "4 PM works. Send the deck when you have...", timestamp: "Today" },
  "dana-torres": { preview: "Following up. Let me know if there's a...", timestamp: "3 days ago" },
  "marcus-lee": { preview: "Thanks Marcus! Appreciate your...", timestamp: "1 week ago" },
  "lisa-park": { preview: "Sounds good. He's detail-oriented but...", timestamp: "Today" },
  "daniel-kim": { preview: "Sent intro to Priya via Sarah. Daniel Kim — can we pull the...", timestamp: "Today" },
  "mike-torres": { preview: "Reaching out to Mike Torres. Dana's team might be in flux.", timestamp: "Today" },
};

function getLastMessagePreview(messages: DemoMessage[]): string {
  if (!messages?.length) return "";
  const last = messages[messages.length - 1];
  const maxLen = 120; // ~2 lines at typical card width
  if (last.body) return last.body.slice(0, maxLen) + (last.body.length > maxLen ? "..." : "");
  if (last.blocks?.[0]?.text?.text) return last.blocks[0].text.text.slice(0, maxLen) + "...";
  return "";
}

interface DemoDataContextValue {
  workspace: DemoWorkspace;
  channels: DemoChannel[];
  dms: DemoDM[];
  files: DemoFile[];
  savedItems: DemoSavedItem[];
  activityPosts: DemoActivityPost[];
  messages: Record<string, DemoMessage[]>;
  demoData: Record<string, unknown> | null;
  blockKitMessages: Record<string, unknown> | null;
  getChannelPreview: (channelId: string) => { preview: string; timestamp: string };
  readChannelIds: Set<string>;
  markChannelAsRead: (channelId: string) => void;
  isChannelRead: (channelId: string) => boolean;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, DemoMessage[]>>({});
  const [demoData, setDemoData] = useState<Record<string, unknown> | null>(null);
  const [blockKitMessages, setBlockKitMessages] = useState<Record<string, unknown> | null>(null);
  const [readChannelIds, setReadChannelIds] = useState<Set<string>>(() => new Set());

  const markChannelAsRead = (channelId: string) => {
    setReadChannelIds((prev) => {
      if (prev.has(channelId)) return prev;
      const next = new Set(prev);
      next.add(channelId);
      return next;
    });
  };

  const isChannelRead = (channelId: string) => readChannelIds.has(channelId);

  useEffect(() => {
    fetch("/demo-data.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load demo-data.json: ${r.status}`);
        return r.json();
      })
      .then(setDemoData)
      .catch((err) => {
        console.error("Failed to load demo-data.json:", err);
        // Set empty object to prevent infinite loading state
        setDemoData({});
      });
  }, []);

  useEffect(() => {
    fetch("/block-kit-messages.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load block-kit-messages.json: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setBlockKitMessages(data);
        const channelMessages = (data?.channel_messages as Record<string, DemoMessage[]>) || {};
        setMessages(channelMessages);
      })
      .catch((err) => {
        console.error("Failed to load block-kit-messages.json:", err);
        // Set empty object to prevent infinite loading state
        setMessages({});
        setBlockKitMessages({});
      });
  }, []);

  const getChannelPreview = (channelId: string) => {
    const msgs = messages[channelId] || [];
    const last = msgs[msgs.length - 1];
    const realPreview = getLastMessagePreview(msgs);
    
    // If we have real messages with content, use them
    if (msgs.length > 0 && realPreview) {
      return {
        preview: realPreview,
        timestamp: last?.timestamp ?? "",
      };
    }
    
    // Fallback to fictional data - ensure every card has meaningful content
    // Check if it's a channel or DM
    const channelMatch = DEMO_CHANNELS.find(c => c.id === channelId);
    const dmMatch = DEMO_DMS.find(d => d.id === channelId);
    
    if (channelMatch && CHANNEL_PREVIEWS[channelId]) {
      return CHANNEL_PREVIEWS[channelId];
    }
    
    if (dmMatch && DM_PREVIEWS[channelId]) {
      return DM_PREVIEWS[channelId];
    }
    
    // Final fallback - ensure we always return meaningful content
    // Match channel name pattern to provide contextual preview
    if (channelId.startsWith("deal-")) {
      const dealName = channelId.replace("deal-", "");
      return {
        preview: `Active deal discussion for ${dealName}. Reviewing next steps...`,
        timestamp: "Today",
      };
    }
    
    return {
      preview: "Recent activity and updates",
      timestamp: "Today",
    };
  };

  const value: DemoDataContextValue = {
    workspace: DEMO_WORKSPACE,
    channels: DEMO_CHANNELS,
    dms: DEMO_DMS,
    files: DEMO_FILES,
    savedItems: DEMO_SAVED,
    activityPosts: DEMO_ACTIVITY_POSTS,
    messages,
    demoData,
    blockKitMessages,
    getChannelPreview,
    readChannelIds,
    markChannelAsRead,
    isChannelRead,
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}

export function useDemoMessages(channelId: string): DemoMessage[] {
  const { messages } = useDemoData();
  return messages[channelId] || [];
}
