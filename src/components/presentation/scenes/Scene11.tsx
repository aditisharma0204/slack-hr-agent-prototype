"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { iPhoneShell as PhoneShell } from "../iPhoneShell";

interface Scene11Props {
  onNext: () => void;
}

export function Scene11({ onNext }: Scene11Props) {
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
            title="Scene 11: Quick Response"
            bundledText="Rita receives an urgent email while away from her desk. She tries to respond on her phone but struggles with typing, formatting, and accessing the information she needs to craft a good response."
            unbundledText="Rita receives a message and her AI assistant suggests a response based on context. She can quickly review, edit, and send—or ask for alternatives. She responds professionally in seconds, not minutes."
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
