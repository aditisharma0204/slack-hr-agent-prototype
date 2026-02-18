"use client";

import { useState } from "react";

interface PresenterDockProps {
  currentScene: number;
  onSceneChange: (scene: number) => void;
}

export function PresenterDock({ currentScene, onSceneChange }: PresenterDockProps) {
  return (
    <div
      className="fixed bottom-0 left-0 w-full h-32 z-[9999] group flex justify-center items-end pb-6 pointer-events-auto"
      style={{ pointerEvents: 'auto', zIndex: 9999 }}
    >
      {/* Static hit-box - no animation, remains stationary */}
      
      {/* Moving dock - animates on group hover */}
      <div
        className="translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 ease-out flex gap-2 p-2 rounded-full bg-[#3c3c3c] backdrop-blur-md border border-white/10 shadow-2xl items-center pointer-events-auto"
        style={{ pointerEvents: 'auto' }}
      >
        {Array.from({ length: 14 }, (_, i) => (
          <button
            key={i}
            onClick={() => onSceneChange(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors text-sm font-medium ${
              currentScene === i ? "text-white bg-white/30 scale-110" : ""
            }`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
