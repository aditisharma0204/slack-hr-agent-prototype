"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";
import { IconTrend } from "@/components/icons";

interface WinRateCardProps {
  winRate: number; // 52%
  previousWinRate: number; // 44%
  personalEngagement: number; // 68%
  delegatedRate: number; // 41%
  index?: number; // For staggered animation
}

// Module-level Set to track which cards have become static (persists across remounts)
const staticCards = new Set<string>();

// Reset function to clear static state (called when Scene 1 resets)
export function resetWinRateCardMemory() {
  staticCards.clear();
}

function WinRateCard({ winRate, previousWinRate, personalEngagement, delegatedRate, index = 0 }: WinRateCardProps) {
  const cardKey = "winrate-card"; // Stable key for this card
  const [animatedRate, setAnimatedRate] = useState(0);
  const [isStatic, setIsStatic] = useState(staticCards.has(cardKey)); // Initialize from module-level Set
  const hasAnimated = useRef(staticCards.has(cardKey)); // Initialize from Set
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset animation state if card is no longer static (Set was cleared externally)
  useEffect(() => {
    const wasStatic = staticCards.has(cardKey);
    if (!wasStatic && hasAnimated.current) {
      // Set was cleared - reset animation state
      hasAnimated.current = false;
      setIsStatic(false);
      setAnimatedRate(0); // Reset animated value
    }
  }, []); // Run on mount to check if Set was cleared
  
  // Switch to static after all animations complete
  useEffect(() => {
    if (staticCards.has(cardKey)) {
      setIsStatic(true);
      return; // Already static
    }
    
    const timer = setTimeout(() => {
      staticCards.add(cardKey); // Mark as static in module-level Set
      setIsStatic(true); // Update state to trigger re-render
    }, 2000 + (index * 0.15 * 1000));
    return () => clearTimeout(timer);
  }, [index, cardKey]);

  useEffect(() => {
    // If already animated, set final value immediately and exit
    if (hasAnimated.current) {
      setAnimatedRate(winRate);
      return;
    }
    
    // Mark as animated BEFORE starting animation to prevent race conditions
    hasAnimated.current = true;
    
    const duration = 1500;
    const steps = 60;
    const increment = winRate / steps;
    let step = 0;

    animationTimerRef.current = setInterval(() => {
      step++;
      const current = Math.min(increment * step, winRate);
      setAnimatedRate(current);
      if (step >= steps) {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
        }
      }
    }, duration / steps);

    // Cleanup on unmount
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - STRICT: only run once on mount, never again

  const improvement = winRate - previousWinRate;

  // Static version (no animations)
  if (isStatic) {
    return (
      <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-2.5 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <IconTrend className="w-4 h-4 text-gray-600" />
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">WIN RATE</div>
        </div>
        
        <div className="mb-1.5">
          <div className="text-2xl font-bold text-gray-900">
            {winRate}%
          </div>
          <div className="text-xs text-blue-600 mt-0.5 font-medium">
            ↑ {improvement}% from Q3
          </div>
        </div>

        <div className="space-y-1.5 mb-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-gray-700">Personal Engagement</span>
              <span className="text-[10px] font-bold text-purple-600">{personalEngagement}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${personalEngagement}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-gray-700">Delegated to AI</span>
              <span className="text-[10px] font-bold text-purple-300">{delegatedRate}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-300 rounded-full" style={{ width: `${delegatedRate}%` }} />
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Animated version (only on first render)
  return (
    <motion.div
      className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-3 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <IconTrend className="w-4 h-4 text-gray-600" />
        <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">WIN RATE</div>
      </div>
      
      <div className="mb-2">
        <motion.div
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
        >
          {Math.round(animatedRate)}%
        </motion.div>
        <div className="text-xs text-blue-600 mt-0.5 font-medium">
          ↑ {improvement}% from Q3
        </div>
      </div>

      {/* Comparative Horizontal Bar Chart */}
      <div className="space-y-2">
        {/* Personal Engagement Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-700">Personal Engagement</span>
            <span className="text-[10px] font-bold text-purple-600">{personalEngagement}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${personalEngagement}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Delegated to AI Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-700">Delegated to AI</span>
            <span className="text-[10px] font-bold text-purple-300">{delegatedRate}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${delegatedRate}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.7, ease: "easeOut" }}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

const MemoizedWinRateCard = memo(WinRateCard);
export default MemoizedWinRateCard;
export { MemoizedWinRateCard as WinRateCard };
