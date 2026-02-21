"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScenarioNarrative } from "../ScenarioNarrative";
import { iPhoneShell as PhoneShell } from "../iPhoneShell";

interface Scene10Props {
  onNext: () => void;
}

export function Scene10({ onNext }: Scene10Props) {
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
            title="Scene 10: Mobile Alert"
            bundledText="Rita receives a generic push notification that a deal changed. She opens the app, navigates through screens, and struggles to understand what happened and what she needs to do."
            unbundledText="Rita gets an intelligent notification on her phone that explains exactly what changed, why it matters, and what action she should take. She can respond immediately without opening multiple apps."
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
