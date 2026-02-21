"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopSlackShell } from "../DesktopSlackShell";
import { Arc1Layout } from "./Arc1Layout";
import { useDemoData } from "@/context/DemoDataContext";

interface Scene1Props {
  onNext: () => void;
  skipNarrative?: boolean; // When called from SceneLayout prototype zone, skip narrative
}

type ScenarioType = "conservative" | "quota" | "stretch";

export function Scene1({ onNext, skipNarrative = false }: Scene1Props) {
  const [showPrototype, setShowPrototype] = useState(skipNarrative);
  const channelId = "slackbot";
  const { markChannelAsRead } = useDemoData();

  useEffect(() => {
    if (showPrototype) {
      markChannelAsRead(channelId);
      // Only redirect if NOT in presentation mode (i.e., not on root "/" route)
      // When skipNarrative=true, we're rendering in SceneLayout's prototype zone, so don't redirect
      if (!skipNarrative && typeof window !== "undefined") {
        const workspaceId = "demo-1";
        const newPath = `/demo/workspace/${workspaceId}/channel/${channelId}`;
        if (window.location.pathname !== newPath) {
          window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, "", newPath);
        }
      }
    }
  }, [showPrototype, channelId, markChannelAsRead, skipNarrative]);

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
        <Arc1Layout />
      </motion.div>
    </AnimatePresence>
  );
}
