"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { iPadShell } from "../iPadShell";

interface Scene12Props {
  onNext: () => void;
}

export function Scene12({ onNext }: Scene12Props) {
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
            title="Scene 12: Tablet Presentation"
            bundledText="Rita prepares for a client meeting by printing slides, organizing handouts, and hoping her laptop battery lasts. During the meeting, she fumbles between different apps and documents to answer questions."
            unbundledText="Rita uses her iPad with AI-powered presentation tools. She can instantly pull up any deal information, generate visualizations on the fly, and answer questions with real-time data—all in one seamless interface."
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
        <iPadShell>
          <div className="h-full w-full flex flex-col items-center justify-center p-8">
          </div>
        </iPadShell>
      </motion.div>
    </AnimatePresence>
  );
}
