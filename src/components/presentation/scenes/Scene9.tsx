"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { DesktopBrowserShell } from "../DesktopBrowserShell";

interface Scene9Props {
  onNext: () => void;
}

export function Scene9({ onNext }: Scene9Props) {
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
            title="Scene 9: Browser Analysis"
            bundledText="Rita analyzes competitor websites and market data by copying information into spreadsheets. She manually compares features, pricing, and positioning, spending hours on analysis."
            unbundledText="Rita's browser AI analyzes competitor data in real-time, compares features and positioning, and generates strategic insights. She gets actionable intelligence without manual data entry."
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
