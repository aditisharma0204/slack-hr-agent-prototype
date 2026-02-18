"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopBrowserShell } from "../DesktopBrowserShell";

interface Scene7Props {
  onNext: () => void;
}

export function Scene7({ onNext }: Scene7Props) {
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
            title="Scene 7: Web Research"
            bundledText="Rita opens multiple browser tabs, reads through lengthy articles, and manually extracts key information. She switches between browser, notes app, and CRM, losing her train of thought."
            unbundledText="Rita's browser AI assistant reads articles alongside her, highlights relevant insights, and automatically extracts key information. It suggests how to use this research in her outreach, making research actionable."
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
