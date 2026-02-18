"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopSlackShell } from "../DesktopSlackShell";

interface Scene4Props {
  onNext: () => void;
}

export function Scene4({ onNext }: Scene4Props) {
  const [showPrototype, setShowPrototype] = useState(false);

  if (!showPrototype) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScenarioNarrative
            title="Scene 4: Deal Update"
            bundledText="Rita receives an email about a deal status change. She opens CRM, finds the record, updates fields manually, then sends a separate email to her manager. Information lives in silos."
            unbundledText="Rita sees a deal update notification in Slack. She reviews AI-generated insights about what changed and why it matters. With one click, she updates the deal and notifies stakeholders—all within the conversation thread."
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
        <DesktopSlackShell>
          <div className="h-full w-full flex flex-col items-center justify-center p-8">
          </div>
        </DesktopSlackShell>
      </motion.div>
    </AnimatePresence>
  );
}
