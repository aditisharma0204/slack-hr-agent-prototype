"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { iPhoneShell as PhoneShell } from "../iPhoneShell";

interface Scene5Props {
  onNext: () => void;
}

export function Scene5({ onNext }: Scene5Props) {
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
            title="Scene 5: Mobile Check-in"
            bundledText="Rita is in a meeting and needs to check a deal status. She opens the mobile CRM app, navigates through multiple screens, and struggles with the clunky interface on a small screen."
            unbundledText="Rita pulls out her phone and asks a quick question in Slack. The AI assistant surfaces exactly what she needs—deal status, next steps, and context—in a clean, mobile-optimized interface."
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
