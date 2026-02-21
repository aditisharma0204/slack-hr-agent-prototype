"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";
import { IconBriefcase } from "@/components/icons";

interface PipelineHealthCardProps {
  totalPipeline: number; // $1.2M
  onTrack: number; // $410K
  needsYou: number; // $90K
  blocked: number; // $0
  dealCount: number; // 14
  index?: number; // For staggered animation
}

// Module-level Set to track which cards have become static (persists across remounts)
const staticCards = new Set<string>();

// Reset function to clear static state (called when Scene 1 resets)
export function resetPipelineHealthCardMemory() {
  staticCards.clear();
}

function PipelineHealthCard({
  totalPipeline,
  onTrack,
  needsYou,
  blocked,
  dealCount,
  index = 0,
}: PipelineHealthCardProps) {
  const cardKey = "pipeline-card"; // Stable key for this card
  const [animatedTotal, setAnimatedTotal] = useState(0);
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
      setAnimatedTotal(0); // Reset animated value
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
      setAnimatedTotal(totalPipeline);
      return;
    }
    
    // Mark as animated BEFORE starting animation to prevent race conditions
    hasAnimated.current = true;
    
    const duration = 1500;
    const steps = 60;
    const increment = totalPipeline / steps;
    let step = 0;

    animationTimerRef.current = setInterval(() => {
      step++;
      const current = Math.min(increment * step, totalPipeline);
      setAnimatedTotal(current);
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const onTrackPct = (onTrack / totalPipeline) * 100;
  const needsYouPct = (needsYou / totalPipeline) * 100;
  const blockedPct = (blocked / totalPipeline) * 100;
  const remainingPct = 100 - onTrackPct - needsYouPct - blockedPct;

  // Static version (no animations)
  if (isStatic) {
    return (
      <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-2.5 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <IconBriefcase className="w-4 h-4 text-gray-600" />
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">PIPELINE HEALTH</div>
        </div>

        <div className="mb-1.5">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalPipeline)}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">{dealCount} active deals</div>
        </div>

        <div className="mb-2">
          <div className="h-2 w-full rounded-full flex overflow-hidden gap-0.5">
            {onTrackPct > 0 && <div className="bg-emerald-500" style={{ width: `${onTrackPct}%` }} />}
            {needsYouPct > 0 && <div className="bg-amber-400" style={{ width: `${needsYouPct}%` }} />}
            {blockedPct > 0 && <div className="bg-gray-200" style={{ width: `${blockedPct}%` }} />}
            {remainingPct > 0 && <div className="bg-gray-100" style={{ width: `${remainingPct}%` }} />}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-gray-500 leading-tight">On Track</div>
              <div className="text-[10px] font-semibold text-emerald-600 leading-tight">{formatCurrency(onTrack)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-gray-500 leading-tight">Needs You</div>
              <div className="text-[10px] font-semibold text-amber-600 leading-tight">{formatCurrency(needsYou)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-gray-500 leading-tight">Blocked</div>
              <div className="text-[10px] font-semibold text-gray-400 leading-tight">{formatCurrency(blocked)}</div>
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
        <IconBriefcase className="w-4 h-4 text-gray-600" />
        <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">PIPELINE HEALTH</div>
      </div>

      <div className="mb-2">
        <motion.div
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
        >
          {formatCurrency(animatedTotal)}
        </motion.div>
        <div className="text-xs text-gray-600 mt-0.5">{dealCount} active deals</div>
      </div>

      {/* Pill-shaped Segmented Progress Bar */}
      <div className="mb-3">
        <div className="h-2 w-full rounded-full flex overflow-hidden gap-0.5">
          {/* On Track Segment */}
          {onTrackPct > 0 && (
            <motion.div
              className="bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${onTrackPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: "easeOut" }}
            />
          )}
          
          {/* Needs You Segment */}
          {needsYouPct > 0 && (
            <motion.div
              className="bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${needsYouPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.6, ease: "easeOut" }}
            />
          )}
          
          {/* Blocked Segment */}
          {blockedPct > 0 && (
            <motion.div
              className="bg-gray-200"
              initial={{ width: 0 }}
              animate={{ width: `${blockedPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.7, ease: "easeOut" }}
            />
          )}
          
          {/* Remaining/Idle Segment */}
          {remainingPct > 0 && (
            <motion.div
              className="bg-gray-100"
              initial={{ width: 0 }}
              animate={{ width: `${remainingPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.8, ease: "easeOut" }}
            />
          )}
        </div>
      </div>

      {/* Legend with Colored Indicator Dots */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] text-gray-500 leading-tight">On Track</div>
            <div className="text-[10px] font-semibold text-emerald-600 leading-tight">{formatCurrency(onTrack)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] text-gray-500 leading-tight">Needs You</div>
            <div className="text-[10px] font-semibold text-amber-600 leading-tight">{formatCurrency(needsYou)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] text-gray-500 leading-tight">Blocked</div>
            <div className="text-[10px] font-semibold text-gray-400 leading-tight">{formatCurrency(blocked)}</div>
            </div>
          </div>
        </div>

      </motion.div>
    );
  }

const MemoizedPipelineHealthCard = memo(PipelineHealthCard);
export default MemoizedPipelineHealthCard;
export { MemoizedPipelineHealthCard as PipelineHealthCard };
