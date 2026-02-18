"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopBrowserShell } from "../DesktopBrowserShell";

interface Scene3Props {
  onNext: () => void;
}

export function Scene3({ onNext }: Scene3Props) {
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
            title="Scene 3: Browser Research"
            bundledText="Rita manually searches LinkedIn, company websites, and news articles to research prospects. She copies information between tabs and takes notes in a separate document, losing context constantly."
            unbundledText="Rita asks her AI assistant in the browser to research a company. It synthesizes information from multiple sources, highlights key insights, and prepares a brief summary she can use immediately in her outreach."
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
        <DesktopBrowserShell>
          <div className="h-full w-full flex flex-col items-center justify-center p-8">
          </div>
        </DesktopBrowserShell>
      </motion.div>
    </AnimatePresence>
  );
}
