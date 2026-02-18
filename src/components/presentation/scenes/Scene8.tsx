"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopSlackShell } from "../DesktopSlackShell";

interface Scene8Props {
  onNext: () => void;
}

export function Scene8({ onNext }: Scene8Props) {
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
            title="Scene 8: Team Collaboration"
            bundledText="Rita sends emails and Slack messages to coordinate with her team. Information gets lost in threads, context is scattered, and she spends time searching for previous conversations."
            unbundledText="Rita collaborates in Slack where AI maintains context across conversations. It surfaces relevant past discussions, suggests who to involve, and keeps everyone aligned without constant back-and-forth."
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
