"use client";

import { motion } from "framer-motion";

interface ScenarioNarrativeProps {
  title: string;
  bundledText: string;
  unbundledText: string;
  onEnterPrototype: () => void;
}

export function ScenarioNarrative({
  title,
  bundledText,
  unbundledText,
  onEnterPrototype,
}: ScenarioNarrativeProps) {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Left side: Seller image placeholder */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-64 h-64 rounded-full bg-gray-800 animate-pulse flex items-center justify-center">
          <span className="text-gray-600 text-sm">Rita's Image</span>
        </div>
      </div>

      {/* Right side: Content */}
      <div className="w-1/2 flex flex-col justify-center p-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-12"
        >
          {title}
        </motion.h1>

        {/* Bundled Job Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 p-6 rounded-lg bg-red-900/30 border border-red-800/50"
        >
          <h2 className="text-2xl font-semibold mb-4 text-red-300">The Bundled Job:</h2>
          <p className="text-lg text-gray-300 leading-relaxed">{bundledText}</p>
        </motion.div>

        {/* Unbundled Job Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 p-6 rounded-lg bg-green-900/30 border border-green-800/50"
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-300">The Unbundled Job:</h2>
          <p className="text-lg text-gray-300 leading-relaxed">{unbundledText}</p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={onEnterPrototype}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg transition-colors shadow-lg"
        >
          Enter Prototype →
        </motion.button>
      </div>
    </div>
  );
}
