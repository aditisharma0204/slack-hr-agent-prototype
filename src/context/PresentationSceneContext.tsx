"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PresentationSceneContextValue {
  currentScene: number;
  setCurrentScene: (scene: number) => void;
}

const PresentationSceneContext = createContext<PresentationSceneContextValue>({
  currentScene: 0,
  setCurrentScene: () => {},
});

export const usePresentationScene = () => useContext(PresentationSceneContext);

export function PresentationSceneProvider({ children }: { children: ReactNode }) {
  const [currentScene, setCurrentScene] = useState(0);

  return (
    <PresentationSceneContext.Provider value={{ currentScene, setCurrentScene }}>
      {children}
    </PresentationSceneContext.Provider>
  );
}
