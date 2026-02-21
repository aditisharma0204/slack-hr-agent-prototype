"use client";

import { useState, useEffect, useRef } from "react";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { usePrototypeMode } from "@/context/PrototypeModeContext";
import { useArcNavigation } from "@/context/ArcNavigationContext";
import { SCENES } from "@/lib/presentation-data";
import { useRouter } from "next/navigation";
import { IconHome } from "@/components/icons";

// Arc names mapping (1-10) - Tooltip text
const ARC_TOOLTIPS: Record<number, string> = {
  1: "Start the quarter on your terms",
  2: "A deal dies. The machine hunts overnight.",
  3: "The deal was cooling. She called from the street.",
  4: "Work naturally. Intelligence follows.",
  5: "The deal closed while she was at lunch.",
  6: "The system told her to stop. She listened.",
  7: "Three decisions. Nine minutes. Her call.",
  8: "Five surfaces. Zero CRM navigations.",
  9: "Revenue up. Software time down.",
  10: "She was $47K short. She made the calls herself.",
};

// Arc names mapping (1-10) - Full names
const ARC_NAMES: Record<number, string> = {
  1: "The Quarterly Commit",
  2: "The Loss & The Night Shift",
  3: "The Sentiment Save",
  4: "Work naturally. Intelligence follows.",
  5: "The Silent Close",
  6: "The Capacity Brake",
  7: "Three decisions. Nine minutes. Her call.",
  8: "Five surfaces. Zero CRM navigations.",
  9: "Revenue up. Software time down.",
  10: "She was $47K short. She made the calls herself.",
};

// Map scene IDs to arc numbers (scenes 1-13 map to arcs 1-10)
const SCENE_TO_ARC: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 10,
  12: 10,
  13: 10,
};

// Map arc numbers to first scene ID in that arc
const ARC_TO_SCENE: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
};

type HeaderContext = "home" | "scenario" | "prototype";

export function GlobalNavigationHeader() {
  const { currentScene, setCurrentScene } = usePresentationScene();
  const { isPrototypeMode } = usePrototypeMode();
  const arcNavigation = useArcNavigation();
  const router = useRouter();
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<number>(0);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine context: home, scenario intro, or prototype viewing mode
  const context: HeaderContext = 
    currentScene === 0 ? "home" :
    isPrototypeMode ? "prototype" :
    "scenario";

  // Get current arc from scene
  const currentArc = currentScene > 0 ? (SCENE_TO_ARC[currentScene] || 1) : 1;
  const currentScreen = arcNavigation.arcState.screen || 1;
  const currentArcName = ARC_NAMES[currentArc] || `Arc ${currentArc}`;
  
  // Get date/time from scene tag
  const currentSceneData = SCENES.find((s) => s.id === currentScene);
  const sceneTagParts = currentSceneData?.sceneTag?.split(" · ") || [];
  const currentDate = sceneTagParts.length >= 2 
    ? `${sceneTagParts[1]} · ${sceneTagParts[2] || ""}`.trim()
    : "January 2 · 9:00 AM";

  // Manage prototype-mode class on body - CSS-only visibility control
  useEffect(() => {
    if (context === "prototype") {
      document.body.classList.add("prototype-mode");
    } else {
      document.body.classList.remove("prototype-mode");
    }
    return () => {
      document.body.classList.remove("prototype-mode");
    };
  }, [context]);

  // Handle navigation to home
  const handleHome = () => {
    setCurrentScene(0);
    router.push("/");
  };

  // Handle arc change
  const handleArcChange = (arc: number, screen: number = 1) => {
    const targetScene = ARC_TO_SCENE[arc] || arc;
    setCurrentScene(targetScene);
    arcNavigation.setArc(arc, screen);
    router.push("/");
  };

  // Handle restart arc
  const handleRestartArc = () => {
    arcNavigation.restartArc();
    // Trigger fade animation on content
    const contentArea = document.querySelector('[data-prototype-content]') as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "0.7";
      setTimeout(() => {
        contentArea.style.opacity = "1";
      }, 200);
    }
  };

  // Handle next arc
  const handleNextArc = () => {
    if (currentArc >= 10) {
      handleArcChange(1, 1); // Wrap to Arc 1
    } else {
      handleArcChange(currentArc + 1, 1);
    }
    // Fade transition
    const contentArea = document.querySelector('[data-prototype-content]') as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "0";
      setTimeout(() => {
        contentArea.style.opacity = "1";
      }, 200);
    }
  };

  // Keyboard shortcuts (only in prototype mode)
  useEffect(() => {
    if (context !== "prototype") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRestartArc();
        return;
      }

      if ((e.key === "ArrowRight" || e.key === " ") && !e.shiftKey) {
        e.preventDefault();
        arcNavigation.nextScreen();
        return;
      }

      if (e.key === "ArrowRight" && e.shiftKey) {
        e.preventDefault();
        handleNextArc();
        return;
      }

      if (e.key === "ArrowLeft" && e.shiftKey) {
        e.preventDefault();
        const prevArc = currentArc <= 1 ? 10 : currentArc - 1;
        handleArcChange(prevArc, 1);
        return;
      }

      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const targetArc = parseInt(e.key);
        handleArcChange(targetArc, 1);
        return;
      }
      if (e.key === "0") {
        e.preventDefault();
        handleArcChange(10, 1);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context, currentArc, arcNavigation]);

  return (
    <header className="global-header fixed top-0 left-0 w-full bg-[#040A14]/80 backdrop-blur-xl border-b border-white/10 z-[10000] flex items-center justify-between px-8" style={{ height: '40px' }}>
      {/* Left Side: Branding/Scene Info */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <img src="/slackbot-logo.svg" alt="SlackbotPro" className="w-6 h-6 flex-shrink-0" />
        <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium whitespace-nowrap">
          SlackbotPro <span className="mx-2 text-white/20">|</span> {context === "home" ? "SCENE 0" : `ARC ${currentArc} · ${currentDate}`}
        </span>
      </div>

      {/* Center: Arc Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 flex-shrink-0">
        {/* Home Icon */}
        <button
          type="button"
          onClick={handleHome}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const navContainer = e.currentTarget.closest('nav') as HTMLElement;
            if (navContainer) {
              const navRect = navContainer.getBoundingClientRect();
              setTooltipPosition(rect.left + rect.width / 2 - navRect.left);
            }
          }}
          className={`w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 ${
            currentScene === 0 ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
          }`}
        >
          <IconHome width={16} height={16} stroke="currentColor" strokeWidth={2} />
        </button>

        {/* Arc Numbers */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((arcNum) => {
          const isActive = arcNum === currentArc;
          return (
            <div key={arcNum} className="relative">
              <button
                type="button"
                onClick={() => handleArcChange(arcNum, 1)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const navContainer = e.currentTarget.closest("nav") as HTMLElement;
                  if (navContainer) {
                    const navRect = navContainer.getBoundingClientRect();
                    setTooltipPosition(rect.left + rect.width / 2 - navRect.left);
                  }
                  tooltipTimeoutRef.current = setTimeout(() => {
                    setHoveredArc(arcNum);
                  }, 400);
                }}
                onMouseLeave={() => {
                  if (tooltipTimeoutRef.current) {
                    clearTimeout(tooltipTimeoutRef.current);
                  }
                  setHoveredArc(null);
                }}
                className={`w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
                }`}
              >
                {arcNum}
              </button>
              {/* Tooltip */}
              {hoveredArc === arcNum && (
                <div 
                  className="arc-tooltip"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {ARC_TOOLTIPS[arcNum]}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Right Zone - Context Dependent */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto" style={{ gap: "12px" }}>
        {context === "prototype" ? (
          <>
            {/* ↺ Restart Arc */}
            <button
              type="button"
              onClick={handleRestartArc}
              className="flex items-center gap-2 transition-all"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "13px",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "white";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.background = "transparent";
              }}
              title="Restart Arc (R)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span>Restart Arc</span>
            </button>
            {/* Next Arc → */}
            <button
              type="button"
              onClick={handleNextArc}
              className="flex items-center gap-2 transition-all"
              style={{
                background: "white",
                color: "#1A0A2E",
                borderRadius: "6px",
                padding: "4px 14px",
                fontSize: "13px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
              title={currentArc >= 10 ? "Back to Start" : "Next Arc (Shift+→)"}
            >
              <span>{currentArc >= 10 ? "Back to Start" : "Next Arc"}</span>
              <span>→</span>
            </button>
          </>
        ) : (
          /* HOME label for home and scenario intro screens */
          <button 
            onClick={handleHome} 
            className="text-[10px] tracking-widest text-gray-400 hover:text-white uppercase font-bold transition-colors select-none outline-none flex-shrink-0 whitespace-nowrap"
          >
            Home
          </button>
        )}
      </div>
    </header>
  );
}
