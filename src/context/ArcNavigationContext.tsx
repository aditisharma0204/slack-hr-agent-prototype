"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ArcState {
  arc: number; // 1-10
  screen: number; // Screen within arc (starts at 1)
}

interface ArcNavigationContextValue {
  arcState: ArcState;
  setArcState: (state: ArcState) => void;
  setArc: (arc: number, screen?: number) => void;
  restartArc: () => void;
  nextScreen: () => void;
}

const ArcNavigationContext = createContext<ArcNavigationContextValue>({
  arcState: { arc: 1, screen: 1 },
  setArcState: () => {},
  setArc: () => {},
  restartArc: () => {},
  nextScreen: () => {},
});

export const useArcNavigation = () => useContext(ArcNavigationContext);

export function ArcNavigationProvider({ children }: { children: ReactNode }) {
  const [arcState, setArcState] = useState<ArcState>({ arc: 1, screen: 1 });

  const setArc = (arc: number, screen: number = 1) => {
    setArcState({ arc, screen });
  };

  const restartArc = () => {
    setArcState((prev) => ({ arc: prev.arc, screen: 1 }));
  };

  const nextScreen = () => {
    setArcState((prev) => ({ arc: prev.arc, screen: prev.screen + 1 }));
  };

  return (
    <ArcNavigationContext.Provider
      value={{
        arcState,
        setArcState,
        setArc,
        restartArc,
        nextScreen,
      }}
    >
      {children}
    </ArcNavigationContext.Provider>
  );
}
