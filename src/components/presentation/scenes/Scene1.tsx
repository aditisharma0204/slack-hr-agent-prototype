"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopSlackShell } from "../DesktopSlackShell";
import { DemoChannelHeader } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoChannelHeader";
import { DemoMessageList } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageList";
import { DemoMessageInput } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageInput";
import { useDemoMessages, useDemoData } from "@/context/DemoDataContext";

interface Scene1Props {
  onNext: () => void;
}

export function Scene1({ onNext }: Scene1Props) {
  const [showPrototype, setShowPrototype] = useState(false);
  const channelId = "slackbot";
  const messages = useDemoMessages(channelId);
  const { dms, markChannelAsRead } = useDemoData();

  useEffect(() => {
    if (showPrototype) {
      markChannelAsRead(channelId);
      // Ensure URL is set so sidebar can detect active channel
      const workspaceId = "demo-1";
      const newPath = `/demo/workspace/${workspaceId}/channel/${channelId}`;
      if (typeof window !== "undefined" && window.location.pathname !== newPath) {
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, "", newPath);
      }
    }
  }, [showPrototype, channelId, markChannelAsRead]);

  if (!showPrototype) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScenarioNarrative
            title="Scene 1: Morning Brief"
            bundledText="Rita starts her day by manually checking multiple dashboards, spreadsheets, and email threads to piece together her pipeline status. She spends 30 minutes gathering context before she can make her first decision."
            unbundledText="Rita opens Slack and immediately sees her personalized morning brief. AI has already synthesized her pipeline, flagged deals needing attention, and prepared talking points. She's ready to act in seconds."
            onEnterPrototype={() => setShowPrototype(true)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full"
      >
        <DesktopSlackShell defaultNav="dms" defaultChannelId="slackbot">
          <div className="flex flex-col h-full bg-white">
            <DemoChannelHeader channelId={channelId} />
            <DemoMessageList messages={messages} />
            <DemoMessageInput channelId={channelId} placeholder="Reply..." />
          </div>
        </DesktopSlackShell>
      </motion.div>
    </AnimatePresence>
  );
}
