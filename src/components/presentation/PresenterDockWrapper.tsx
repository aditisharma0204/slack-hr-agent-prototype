"use client";

import { useRouter, usePathname } from "next/navigation";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { usePrototypeMode } from "@/context/PrototypeModeContext";
import { PresenterDock } from "./PresenterDock";

export function PresenterDockWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentScene, setCurrentScene } = usePresentationScene();
  const { isPrototypeMode } = usePrototypeMode();
  
  const handleSceneChange = (scene: number) => {
    setCurrentScene(scene);
    // Navigate to root page if not already there, so TheStage can render the scene
    // Use replace to avoid adding to history when switching scenes
    if (pathname !== "/") {
      router.replace("/");
    }
  };
  
  // Hide global PresenterDock when in prototype mode (it's rendered structurally inside SceneLayout)
  if (isPrototypeMode) {
    return null;
  }
  
  return <PresenterDock currentScene={currentScene} onSceneChange={handleSceneChange} />;
}
