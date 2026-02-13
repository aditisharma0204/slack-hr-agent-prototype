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
}

export interface DemoDM {
  id: string;
  name: string;
  isSlackbot?: boolean;
}

const DEMO_WORKSPACE: DemoWorkspace = { id: "demo-1", name: "Acme Corp" };
const DEMO_CHANNELS: DemoChannel[] = [
  { id: "general", name: "general" },
  { id: "sales", name: "sales" },
  { id: "q3-pipeline", name: "q3-pipeline" },
];
const DEMO_DMS: DemoDM[] = [
  { id: "slackbot", name: "Slackbot", isSlackbot: true },
];

interface DemoDataContextValue {
  workspace: DemoWorkspace;
  channels: DemoChannel[];
  dms: DemoDM[];
  messages: Record<string, DemoMessage[]>;
  demoData: Record<string, unknown> | null;
  blockKitMessages: Record<string, unknown> | null;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, DemoMessage[]>>({});
  const [demoData, setDemoData] = useState<Record<string, unknown> | null>(null);
  const [blockKitMessages, setBlockKitMessages] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/demo-data.json")
      .then((r) => r.json())
      .then(setDemoData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/block-kit-messages.json")
      .then((r) => r.json())
      .then((data) => {
        setBlockKitMessages(data);
        const channelMessages = (data?.channel_messages as Record<string, DemoMessage[]>) || {};
        setMessages(channelMessages);
      })
      .catch(console.error);
  }, []);

  const value: DemoDataContextValue = {
    workspace: DEMO_WORKSPACE,
    channels: DEMO_CHANNELS,
    dms: DEMO_DMS,
    messages,
    demoData,
    blockKitMessages,
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
