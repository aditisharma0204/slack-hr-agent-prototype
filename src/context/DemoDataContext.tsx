"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface DemoReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface DemoThreadReply {
  id: string;
  author: string;
  authorImage?: string | null;
  body: string;
  timestamp: string;
}

export interface DemoMessage {
  id: string;
  author: string;
  authorImage?: string | null;
  timestamp: string;
  body?: string | null;
  blocks?: SlackBlock[] | null;
  reactions?: DemoReaction[];
  threadCount?: number;
  threadReplies?: DemoThreadReply[];
  threadLastAuthor?: string;
  threadLastAuthorImage?: string | null;
  threadLastTimestamp?: string;
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
  avatarUrl?: string;
  status?: "online" | "away" | "dnd" | "call";
  unread?: boolean;
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

// ---------------------------------------------------------------------------
// StoryConfig — the pluggable data contract every story must satisfy.
// Each story provides its own channels, DMs, messages, avatars, and previews.
// ---------------------------------------------------------------------------
export interface StoryConfig {
  id: string;
  title: string;
  userName: string;
  workspaceName: string;
  channels: DemoChannel[];
  dms: DemoDM[];
  files: DemoFile[];
  savedItems: DemoSavedItem[];
  activityPosts: DemoActivityPost[];
  channelPreviews: Record<string, { preview: string; timestamp: string }>;
  dmPreviews: Record<string, { preview: string; timestamp: string }>;
  messageAvatarMap: Record<string, string>;
  mockMessages: Record<string, DemoMessage[]>;
  agentforceAgents?: Array<{
    id: string;
    name: string;
  }>;
}

// ---------------------------------------------------------------------------
// Module-level avatar map — set by the active DemoDataProvider so that
// getMessageAvatarUrl works as a plain function import (no hook required).
// ---------------------------------------------------------------------------
let _activeAvatarMap: Record<string, string> = {};

export function getAvatarUrl(name: string, size = 64): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=611f69&color=fff&size=${size}`;
}

export function getMessageAvatarUrl(author: string): string | null {
  return _activeAvatarMap[author] ?? null;
}

function getLastMessagePreview(messages: DemoMessage[]): string {
  if (!messages?.length) return "";
  const last = messages[messages.length - 1];
  const maxLen = 120;
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
  userName: string;
  storyId: string;
  agentforceAgents: Array<{ id: string; name: string }>;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

interface DemoDataProviderProps {
  config: StoryConfig;
  children: React.ReactNode;
}

export function DemoDataProvider({ config, children }: DemoDataProviderProps) {
  // Set module-level avatar map so getMessageAvatarUrl works for components
  // that import it as a plain function (e.g. BlockKitRenderer).
  _activeAvatarMap = config.messageAvatarMap;

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
        try {
          setBlockKitMessages(data);
          const channelMessages = (data?.channel_messages as Record<string, DemoMessage[]>) || {};

          const mergedMessages: Record<string, DemoMessage[]> = {
            ...channelMessages,
            ...config.mockMessages,
          };

          const enrichedMessages: Record<string, DemoMessage[]> = {};
          Object.keys(mergedMessages).forEach((channelId) => {
            enrichedMessages[channelId] = mergedMessages[channelId].map((msg) => {
              try {
                return {
                  ...msg,
                  authorImage: msg.authorImage || getMessageAvatarUrl(msg.author || "") || null,
                  reactions: msg.reactions || undefined,
                  threadCount: msg.threadCount || undefined,
                  threadLastAuthor: msg.threadLastAuthor || undefined,
                  threadLastAuthorImage: msg.threadLastAuthorImage || undefined,
                  threadLastTimestamp: msg.threadLastTimestamp || undefined,
                };
              } catch (err) {
                console.error(`Error enriching message ${msg.id}:`, err);
                return { ...msg, authorImage: null };
              }
            });
          });
          setMessages(enrichedMessages);
        } catch (err) {
          console.error("Error processing messages:", err);
          const channelMessages = (data?.channel_messages as Record<string, DemoMessage[]>) || {};
          setMessages(channelMessages);
        }
      })
      .catch((err) => {
        console.error("Failed to load block-kit-messages.json:", err);
        setMessages({});
        setBlockKitMessages({});
      });
  }, [config.mockMessages]);

  const getChannelPreview = (channelId: string) => {
    const msgs = messages[channelId] || [];
    const last = msgs[msgs.length - 1];
    const realPreview = getLastMessagePreview(msgs);

    if (msgs.length > 0 && realPreview) {
      return {
        preview: realPreview,
        timestamp: last?.timestamp ?? "",
      };
    }

    if (config.channelPreviews[channelId]) {
      return config.channelPreviews[channelId];
    }

    if (config.dmPreviews[channelId]) {
      return config.dmPreviews[channelId];
    }

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
    workspace: { id: "demo-1", name: config.workspaceName },
    channels: config.channels,
    dms: config.dms,
    files: config.files,
    savedItems: config.savedItems,
    activityPosts: config.activityPosts,
    messages,
    demoData,
    blockKitMessages,
    getChannelPreview,
    readChannelIds,
    markChannelAsRead,
    isChannelRead,
    userName: config.userName,
    storyId: config.id,
    agentforceAgents: config.agentforceAgents ?? [
      { id: "af-employee", name: "Employee Agent" },
    ],
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

const EMPTY_MESSAGES: DemoMessage[] = [];

export function useDemoMessages(channelId: string): DemoMessage[] {
  const { messages } = useDemoData();
  return messages[channelId] || EMPTY_MESSAGES;
}
