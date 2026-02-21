"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SceneData, SCENES } from "@/lib/presentation-data";
import { DesktopSlackShell } from "./DesktopSlackShell";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { QuotaTracker, resetQuotaTrackerMemory } from "./QuotaTracker";
import { resetAnimatedCounterMemory } from "./AnimatedCounter";
import { usePrototypeMode } from "@/context/PrototypeModeContext";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { useArcNavigation } from "@/context/ArcNavigationContext";

interface SceneLayoutProps {
  scene: SceneData;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

// Map scene IDs to arc numbers (scenes 1-10 map to arcs 1-10)
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
  11: 10, // Multiple scenes can map to same arc
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

export function SceneLayout({ scene, onBack, onPrev, onNext }: SceneLayoutProps) {
  const [showProto, setShowProto] = useState(false);
  const [protoMountReady, setProtoMountReady] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const { setIsPrototypeMode } = usePrototypeMode();

  // Defer prototype content until after browser has laid out the fixed prototype zone — fixes wrong layout on first "Enter scenario" click
  useLayoutEffect(() => {
    if (showProto) {
      // Double RAF ensures the fixed prototype zone container has been positioned and sized by the browser before mounting DesktopSlackShell
      let rafId2: number;
      const rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setProtoMountReady(true);
        });
      });
      // Fallback: ensure content mounts even if RAF is delayed
      const timeoutId = setTimeout(() => {
        setProtoMountReady(true);
      }, 200);
      return () => {
        cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        clearTimeout(timeoutId);
      };
    } else {
      setProtoMountReady(false);
    }
  }, [showProto]);
  const router = useRouter();
  const pathname = usePathname();
  const { currentScene, setCurrentScene } = usePresentationScene();
  const arcNavigation = useArcNavigation();

  // Get current arc from scene
  const currentArc = SCENE_TO_ARC[scene.id] || 1;

  const handleSceneChange = (scene: number) => {
    setCurrentScene(scene);
    // Navigate to root page if not already there, so TheStage can render the scene
    if (pathname !== "/") {
      router.replace("/");
    }
  };

  const handleArcChange = (arc: number, screen?: number) => {
    // Fade out
    setContentOpacity(0);
    setTimeout(() => {
      // Change to the first scene of the target arc
      const targetScene = ARC_TO_SCENE[arc] || arc;
      setCurrentScene(targetScene);
      arcNavigation.setArc(arc, screen || 1);
      // Fade in
      setTimeout(() => {
        setContentOpacity(1);
      }, 50);
    }, 150);
  };

  const handleRestartArc = () => {
    // Trigger fade animation first
    setContentOpacity(0.6);
    setTimeout(() => {
      arcNavigation.restartArc();
      setContentOpacity(1);
    }, 200);
  };

  const handleNextScreen = () => {
    arcNavigation.nextScreen();
  };

  useEffect(() => {
    // Reset prototype visibility when scene changes
    setShowProto(false);
    setIsPrototypeMode(false);
  }, [scene.id, setIsPrototypeMode]);

  useEffect(() => {
    // Update prototype mode context when showProto changes
    setIsPrototypeMode(showProto);
    // Reset opacity when entering prototype mode to ensure content is visible
    if (showProto) {
      setContentOpacity(1);
    }
  }, [showProto, setIsPrototypeMode]);
  
  // Reset memory vaults when starting scenarios (Scene 1) - run once on mount
  useEffect(() => {
    if (scene.id === 1) {
      resetQuotaTrackerMemory();
      resetAnimatedCounterMemory();
    }
  }, []); // Empty deps - only run once when component mounts

  // Prototype component mapping
  const PROTOTYPE_MAP: Record<number, React.ComponentType<any>> = {
    1: Scene1,
    2: DesktopSlackShell,
    3: Scene2,
    4: Scene2,
    6: DesktopSlackShell,
  } as const;

  // Determine which shell to render based on scene ID
  const renderProtoZone = () => {
    const ProtoComponent = PROTOTYPE_MAP[scene.id];
    
      if (ProtoComponent) {
        // Scene 1: Custom Scene1 component with Agentforce dashboard
        if (scene.id === 1) {
          return <Scene1 onNext={() => {}} skipNarrative={true} />;
        }
        // Scenes 2, 6: Slack with specific props
        if ([2, 6].includes(scene.id)) {
          return <DesktopSlackShell defaultNav="dms" defaultChannelId="slackbot" hideHeader={false} />;
        }
      // Scenes 3, 4: Apple Watch
      if ([3, 4].includes(scene.id)) {
        return <Scene2 onNext={() => {}} />;
      }
    }

    // Other scenes: iframe or placeholder
    if (scene.protoUrl) {
      return <iframe src={scene.protoUrl} className="w-full h-full border-none" allowFullScreen />;
    }

    return (
      <div className="text-black text-center p-8">
        <p className="text-lg">Prototype for Scene {scene.id} coming soon.</p>
      </div>
    );
  };

  return (
    <div className="sp fixed z-[200] overflow-hidden" style={{ background: "var(--bg)", animation: "pageIn 0.4s ease both", top: "var(--header-height, 40px)", left: 0, right: 0, width: "100vw", minWidth: "100%", height: "calc(100vh - var(--header-height, 40px))", pointerEvents: showProto ? 'none' : 'auto' }}>
      {/* Split layout - overlapping editorial feel */}
      {!showProto && (
        <div className="relative w-full h-full bg-[#E5EEFB] flex overflow-hidden gap-0 min-w-0" style={{ width: '100%', minWidth: '100%', zIndex: 1 }}>
          {/* Left image - fill container, no black bars */}
          <div className="w-[65%] h-full relative shrink-0 [mask-image:linear-gradient(to_right,white_80%,transparent_100%)]" style={{ minWidth: '65%' }}>
            <img
              key={scene.image}
              src={scene.image ? scene.image.replace(/ /g, '%20') : '/New%20Scene_01.png'}
              alt={`Scene ${scene.id}`}
              className="w-full h-full object-cover object-center opacity-0"
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center',
                animation: 'imageFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
              onError={(e) => {
                console.error('Image failed to load:', scene.image);
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.style.background = "#E5EEFB";
              }}
            />
          </div>

          {/* Right content - overlapping panel */}
          <div className="flex-1 h-full bg-transparent relative z-10 -ml-32 flex items-center justify-center min-w-0" style={{ minWidth: 0, flexGrow: 1 }}>
            {/* Fixed-width, centered inner container */}
            <div key={scene.id} className="w-full max-w-[940px] px-16 flex flex-col min-w-0" style={{ width: '100%' }}>
              {/* 1. Animated Header Block */}
              <div className="h-[180px] shrink-0 flex flex-col justify-end pb-0">
                <div key={`header-${scene.id}`} className="animate-reveal opacity-0" style={{ animationDelay: '100ms' }}>
                  <div className="s-scene-tag font-mono text-[9px] tracking-[0.15em] uppercase mb-2" style={{ color: "#181818" }}>{scene.sceneTag || ""}</div>
                  <h1 className="s-title text-[clamp(32px,3.5vw,50px)] leading-[1.05] tracking-[-0.02em]" style={{ color: "#181818", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                    "{scene.jtbd}"
                  </h1>
                  {scene.subtitle && (
                    <p className="s-subtitle text-lg max-w-xl" style={{ color: "#181818" }}>
                      {scene.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Quota Tracker */}
              {scene.pipeline && (
                <div className="mt-2 mb-8">
                  <QuotaTracker pipeline={scene.pipeline} isFirstScene={scene.id === 1} />
                </div>
              )}

              {/* 3. Animated Body Block */}
              <div>
                {/* Symmetrical Story Grid (Anchor 2) */}
                {scene.bundled && scene.unbundled && (
                  <div key={`story-${scene.id}`} className="animate-reveal opacity-0 grid grid-cols-2 gap-x-16 h-[160px] shrink-0 items-start" style={{ animationDelay: '300ms' }}>
                    {/* LEFT COLUMN: OLD WORLD */}
                    <div className="flex flex-col w-full">
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: "#ef4444", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ef4444" }}></span>Old World
                        </h4>
                        <p className="text-[15px] leading-relaxed" style={{ color: "#181818" }}>
                          {scene.bundled.text}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: WITH INTELLIGENCE */}
                    <div className="flex flex-col w-full">
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: "#0059FF", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#0059FF" }}></span>With Intelligence
                        </h4>
                        <p className="text-[15px] leading-relaxed" style={{ color: "#181818" }}>
                          {scene.unbundled.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Symmetrical Metrics Grid (Anchor 3) */}
                {scene.metrics && scene.metrics.length > 0 && (
                  <div key={`metrics-${scene.id}`} className="animate-subtle opacity-0 grid grid-cols-2 gap-x-16 h-[200px] shrink-0 mt-8 border-t pt-8" style={{ animationDelay: '200ms', borderColor: 'rgba(0, 89, 255, 0.2)' }}>
                    {/* LEFT COLUMN: Metrics */}
                    <div className="flex flex-col gap-6">
                      {scene.metrics.filter(m => m.cls === 'fric-v').map((m, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-5xl whitespace-nowrap leading-none" style={{ color: "#ef4444", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>{m.val}</span>
                          <span className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "#181818" }}>{m.lbl}</span>
                        </div>
                      ))}
                    </div>

                    {/* RIGHT COLUMN: Metrics */}
                    <div className="flex flex-col gap-6">
                      {scene.metrics.filter(m => m.cls !== 'fric-v').map((m, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-5xl whitespace-nowrap leading-none" style={{ color: "#0059FF", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>{m.val}</span>
                          <span className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "#181818" }}>{m.lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Persistent Footer (Anchor 4) */}
                <div key={`footer-${scene.id}`} className="animate-reveal opacity-0 h-[80px] shrink-0 flex items-center justify-between border-t mt-4" style={{ animationDelay: '500ms', borderColor: 'rgba(0, 89, 255, 0.2)' }}>
                {/* Left: Enter Prototype Button */}
                <div className="flex-shrink-0">
                  {scene.protoUrl || [1, 2, 3, 4, 6].includes(scene.id) ? (
                    <button className="btn-proto inline-flex items-center gap-[9px] rounded-xl px-5 py-[13px] font-sans text-[12.5px] font-semibold cursor-pointer tracking-[0.01em] transition-all duration-[0.18s] ease whitespace-nowrap" style={{ background: "#0059FF", color: "#FFFFFF", borderRadius: "8px" }} onClick={() => setShowProto(true)} onMouseEnter={(e) => { e.currentTarget.style.background = "#0066FF"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 89, 255, 0.4)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#0059FF"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                      Enter Prototype <span className="btn-arr text-[15px] transition-transform duration-[0.18s]" style={{ transform: "translateX(0)" }}>→</span>
                    </button>
                  ) : (
                    <button className="btn-proto off inline-flex items-center gap-[9px] rounded-xl px-5 py-[13px] font-sans text-[12.5px] font-semibold cursor-default tracking-[0.01em] whitespace-nowrap" style={{ background: "#E5EEFB", color: "#181818", border: "1px solid rgba(0, 89, 255, 0.3)", borderRadius: "8px" }} disabled>
                      Prototype Coming <span className="btn-arr text-[15px]">→</span>
                    </button>
                  )}
                </div>

                {/* Center: Navigation Controls */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Previous Button */}
                  {onPrev ? (
                    <button
                      onClick={onPrev}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200"
                      style={{ borderColor: 'rgba(0, 89, 255, 0.3)', backgroundColor: 'rgba(0, 89, 255, 0.1)', color: '#0059FF' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 89, 255, 0.2)';
                        e.currentTarget.style.borderColor = '#0059FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 89, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(0, 89, 255, 0.3)';
                      }}
                      aria-label="Previous scene"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                    </button>
                  ) : (
                    <div className="w-10 h-10" /> // Spacer when no previous
                  )}

                  {/* Scene Counter */}
                  <div className="cta-meta font-mono text-[8.5px] tracking-[0.1em] uppercase whitespace-nowrap" style={{ color: "#0059FF" }}>
                    Scene {scene.id} / {SCENES.filter(s => s.enabled && !s.isHero).length}
                  </div>

                  {/* Next Button */}
                  {onNext ? (
                    <button
                      onClick={onNext}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200"
                      style={{ borderColor: 'rgba(0, 89, 255, 0.3)', backgroundColor: 'rgba(0, 89, 255, 0.1)', color: '#0059FF' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 89, 255, 0.2)';
                        e.currentTarget.style.borderColor = '#0059FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 89, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(0, 89, 255, 0.3)';
                      }}
                      aria-label="Next scene"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ) : (
                    <div className="w-10 h-10" /> // Spacer when no next
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proto zone - positioned independently below global header, same as "sp" div, so layout is stable from first frame */}
      {showProto && (
        <div
          data-prototype-content
          className="prototype-screen fixed flex flex-col overflow-hidden transition-opacity duration-300"
          style={{
            opacity: contentOpacity,
            zIndex: 9999,
            top: 'var(--header-height, 40px)',
            left: 0,
            right: 0,
            height: 'calc(100vh - var(--header-height, 40px))',
            width: '100%',
            backgroundColor: 'var(--bg, #060608)',
            pointerEvents: 'auto',
          }}
        >
          <div className="w-full h-full flex flex-col min-h-0" style={{ height: '100%', opacity: protoMountReady ? 1 : 0.5 }}>
            {protoMountReady ? renderProtoZone() : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg, #060608)' }}>
                <p className="text-white text-lg">Loading prototype...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
