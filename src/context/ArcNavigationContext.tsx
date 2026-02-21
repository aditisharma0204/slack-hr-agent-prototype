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
  restartCounter: number; // Counter that increments on each restart
}

const ArcNavigationContext = createContext<ArcNavigationContextValue>({
  arcState: { arc: 1, screen: 1 },
  setArcState: () => {},
  setArc: () => {},
  restartArc: () => {},
  nextScreen: () => {},
  restartCounter: 0,
});

export const useArcNavigation = () => useContext(ArcNavigationContext);

export function ArcNavigationProvider({ children }: { children: ReactNode }) {
  const [arcState, setArcState] = useState<ArcState>({ arc: 1, screen: 1 });
  const [restartCounter, setRestartCounter] = useState(0);

  const setArc = (arc: number, screen: number = 1) => {
    setArcState({ arc, screen });
  };

  const restartArc = () => {
    setArcState((prev) => ({ arc: prev.arc, screen: 1 }));
    setRestartCounter((prev) => prev + 1); // Increment counter to trigger restart detection
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
        restartCounter,
      }}
    >
      {children}
    </ArcNavigationContext.Provider>
  );
}
