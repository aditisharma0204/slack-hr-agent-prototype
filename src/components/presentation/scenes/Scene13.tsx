"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { iPhoneShell as PhoneShell } from "../iPhoneShell";

interface Scene13Props {
  onNext: () => void;
}

export function Scene13({ onNext }: Scene13Props) {
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
            title="Scene 13: Final Check"
            bundledText="At the end of the day, Rita manually reviews her to-do list, checks emails, and tries to remember what she accomplished. She worries about what she might have missed."
            unbundledText="Rita ends her day with a personalized summary. AI shows her what she accomplished, what's pending, and what needs attention tomorrow. She closes her laptop confident and prepared."
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
        <PhoneShell>
          <div className="h-full w-full flex flex-col items-center justify-center p-4">
          </div>
        </PhoneShell>
      </motion.div>
    </AnimatePresence>
  );
}
