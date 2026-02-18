"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopSlackShell } from "../DesktopSlackShell";

interface Scene6Props {
  onNext: () => void;
}

export function Scene6({ onNext }: Scene6Props) {
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
            title="Scene 6: Pipeline Review"
            bundledText="Rita spends hours building spreadsheets and PowerPoint decks for pipeline reviews. She manually pulls data from CRM, calculates metrics, and formats reports. The process is repetitive and error-prone."
            unbundledText="Rita asks her AI assistant to prepare a pipeline review. It automatically generates insights, identifies risks and opportunities, and creates a narrative-ready summary. She reviews and refines, not builds from scratch."
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
