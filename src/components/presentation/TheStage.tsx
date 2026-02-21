"use client";

import { useState, useEffect } from "react";
import { DemoDataProvider } from "@/context/DemoDataContext";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { SCENES } from "@/lib/presentation-data";
import { Hero } from "./Hero";
import { Unbundling } from "./Unbundling";
import { SceneLayout } from "./SceneLayout";

type ViewState = "hero" | "unbundling" | number;

export function TheStage() {
  const { currentScene, setCurrentScene } = usePresentationScene();
  const [currentView, setCurrentView] = useState<ViewState>("hero");

  // Sync currentView with currentScene from context
  useEffect(() => {
    if (currentScene === 0) {
      setCurrentView("hero");
    } else if (currentScene > 0 && currentScene <= 13) {
      setCurrentView(currentScene);
    }
  }, [currentScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === "hero") return;
      if (currentView === "unbundling") {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          // Unbundling handles its own advance
        }
        if (e.key === "Escape") {
          setCurrentView("hero");
          setCurrentScene(0);
        }
        return;
      }
      // Scene navigation
      if (typeof currentView === "number") {
        const enabledScenes = SCENES.filter((s) => s.enabled && !s.isHero);
        const currentIdx = enabledScenes.findIndex((s) => s.id === currentView);
        if (e.key === "ArrowRight" && currentIdx < enabledScenes.length - 1) {
          const nextScene = enabledScenes[currentIdx + 1];
          setCurrentView(nextScene.id);
          setCurrentScene(nextScene.id);
        }
        if (e.key === "ArrowLeft") {
          if (currentIdx > 0) {
            const prevScene = enabledScenes[currentIdx - 1];
            setCurrentView(prevScene.id);
            setCurrentScene(prevScene.id);
          } else {
            setCurrentView("hero");
            setCurrentScene(0);
          }
        }
        if (e.key === "Escape") {
          setCurrentView("hero");
          setCurrentScene(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentView, setCurrentScene]);

  const handleUnbundlingClick = () => {
    setCurrentView("unbundling");
  };

  const handleScenesClick = () => {
    const firstScene = SCENES.find((s) => s.enabled && !s.isHero);
    if (firstScene) {
      setCurrentView(firstScene.id);
      setCurrentScene(firstScene.id);
    }
  };

  const handleBack = () => {
    setCurrentView("hero");
    setCurrentScene(0);
  };

  const handleScenePrev = () => {
    if (typeof currentView === "number") {
      const enabledScenes = SCENES.filter((s) => s.enabled && !s.isHero);
      const currentIdx = enabledScenes.findIndex((s) => s.id === currentView);
      if (currentIdx > 0) {
        const prevScene = enabledScenes[currentIdx - 1];
        setCurrentView(prevScene.id);
        setCurrentScene(prevScene.id);
      }
    }
  };

  const handleSceneNext = () => {
    if (typeof currentView === "number") {
      const enabledScenes = SCENES.filter((s) => s.enabled && !s.isHero);
      const currentIdx = enabledScenes.findIndex((s) => s.id === currentView);
      if (currentIdx < enabledScenes.length - 1) {
        const nextScene = enabledScenes[currentIdx + 1];
        setCurrentView(nextScene.id);
        setCurrentScene(nextScene.id);
      }
    }
  };

  const enabledScenes = SCENES.filter((s) => s.enabled && !s.isHero);
  const currentSceneData =
    typeof currentView === "number"
      ? SCENES.find((s) => s.id === currentView)
      : null;
  const currentIdx =
    typeof currentView === "number"
      ? enabledScenes.findIndex((s) => s.id === currentView)
      : -1;

  return (
    <DemoDataProvider>
      <div
        className="relative w-full min-h-screen overflow-hidden"
        style={{
          isolation: "isolate",
          backgroundColor: "var(--bg, #060608)",
          color: "var(--text, #ECEBF5)",
          minHeight: "100vh",
          height: "100vh",
        }}
      >
        {/* Content area - naturally flows below fixed header */}
        <div className="relative w-full min-h-full" style={{ height: "100vh", overflow: "hidden" }}>
          {currentView === "hero" && (
            <Hero onUnbundlingClick={handleUnbundlingClick} onScenesClick={handleScenesClick} />
          )}
          {currentView === "unbundling" && (
            <Unbundling onScenesClick={handleScenesClick} onBack={handleBack} />
          )}
          {typeof currentView === "number" && currentSceneData && (
            <SceneLayout
              scene={currentSceneData}
              onBack={handleBack}
              onPrev={currentIdx > 0 ? handleScenePrev : undefined}
              onNext={currentIdx < enabledScenes.length - 1 ? handleSceneNext : undefined}
            />
          )}
        </div>
      </div>
    </DemoDataProvider>
  );
}
