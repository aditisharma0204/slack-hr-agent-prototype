"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const PrototypeModeContext = createContext<{
  isPrototypeMode: boolean;
  setIsPrototypeMode: (value: boolean) => void;
}>({
  isPrototypeMode: false,
  setIsPrototypeMode: () => {},
});

export const usePrototypeMode = () => useContext(PrototypeModeContext);

export function PrototypeModeProvider({ children }: { children: ReactNode }) {
  const [isPrototypeMode, setIsPrototypeMode] = useState(false);

  return (
    <PrototypeModeContext.Provider value={{ isPrototypeMode, setIsPrototypeMode }}>
      {children}
    </PrototypeModeContext.Provider>
  );
}
