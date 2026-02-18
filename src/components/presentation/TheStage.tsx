"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DemoDataProvider } from "@/context/DemoDataContext";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { Scene0 } from "./scenes/Scene0";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";
import { Scene9 } from "./scenes/Scene9";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { Scene12 } from "./scenes/Scene12";
import { Scene13 } from "./scenes/Scene13";

const SCENARIOS = {
  0: Scene0,
  1: Scene1,
  2: Scene2,
  3: Scene3,
  4: Scene4,
  5: Scene5,
  6: Scene6,
  7: Scene7,
  8: Scene8,
  9: Scene9,
  10: Scene10,
  11: Scene11,
  12: Scene12,
  13: Scene13,
};

export function TheStage() {
  const { currentScene, setCurrentScene } = usePresentationScene();
  const CurrentSceneComponent = SCENARIOS[currentScene as keyof typeof SCENARIOS];

  const handleNext = () => {
    if (currentScene < 13) {
      setCurrentScene(currentScene + 1);
    }
  };

  return (
    <DemoDataProvider>
      <div className="relative w-full h-screen overflow-hidden" style={{ isolation: 'isolate' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
            style={{ zIndex: 1 }}
          >
            <CurrentSceneComponent onNext={handleNext} />
          </motion.div>
        </AnimatePresence>
        {/* PresenterDock is now in global layout, removed from here */}
      </div>
    </DemoDataProvider>
  );
}
