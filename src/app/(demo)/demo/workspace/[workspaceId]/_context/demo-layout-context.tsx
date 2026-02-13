"use client";

import { createContext, useContext } from "react";

// Slackbot panel visibility
const SlackbotContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
}>({
  isOpen: true,
  toggle: () => {},
});

export const useSlackbot = () => useContext(SlackbotContext);

// Nav context for left icon bar
export type NavView = "home" | "dms" | "activity" | "files" | "later" | "agentforce" | "more";
const NavContext = createContext<{
  activeNav: NavView;
  setActiveNav: (v: NavView) => void;
}>({
  activeNav: "activity",
  setActiveNav: () => {},
});

export const useNav = () => useContext(NavContext);

export function DemoLayoutProviders({
  children,
  isSlackbotOpen,
  setIsSlackbotOpen,
  activeNav,
  setActiveNav,
}: {
  children: React.ReactNode;
  isSlackbotOpen: boolean;
  setIsSlackbotOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  activeNav: NavView;
  setActiveNav: (v: NavView) => void;
}) {
  return (
    <NavContext.Provider value={{ activeNav, setActiveNav }}>
      <SlackbotContext.Provider
        value={{
          isOpen: isSlackbotOpen,
          toggle: () => setIsSlackbotOpen((prev) => !prev),
        }}
      >
        {children}
      </SlackbotContext.Provider>
    </NavContext.Provider>
  );
}
