"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";
import { IconZap } from "@/components/icons";

interface DealVelocityCardProps {
  avgCycle: number; // 48 days
  fastestClose: number; // 21 days
  fastestDeal: string; // "Greentech"
  q4Deals: Array<{ name: string; days: number }>;
  index?: number; // For staggered animation
}

// Module-level Set to track which cards have become static (persists across remounts)
const staticCards = new Set<string>();

// Reset function to clear static state (called when Scene 1 resets)
export function resetDealVelocityCardMemory() {
  staticCards.clear();
}

function DealVelocityCard({
  avgCycle,
  fastestClose,
  fastestDeal,
  q4Deals = [],
  index = 0,
}: DealVelocityCardProps) {
  const cardKey = "velocity-card"; // Stable key for this card
  const [isStatic, setIsStatic] = useState(staticCards.has(cardKey)); // Initialize from module-level Set
  const hasAnimated = useRef(staticCards.has(cardKey)); // Initialize from Set
  
  // Reset animation state if card is no longer static (Set was cleared externally)
  useEffect(() => {
    const wasStatic = staticCards.has(cardKey);
    if (!wasStatic && hasAnimated.current) {
      // Set was cleared - reset animation state
      hasAnimated.current = false;
      setIsStatic(false);
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

  // Velocity breakdown: Break down 48 days into sales phases
  const discoveryDays = 18;
  const securityDays = 22;
  const legalDays = 8;

  const discoveryPct = (discoveryDays / avgCycle) * 100;
  const securityPct = (securityDays / avgCycle) * 100;
  const legalPct = (legalDays / avgCycle) * 100;

  // Static version (no animations)
  if (isStatic) {
    return (
      <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-2.5 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <IconZap className="w-4 h-4 text-gray-600" />
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Avg Deal Cycle</div>
        </div>

        <div className="mb-2">
          <div className="text-2xl font-bold text-gray-900">
            {avgCycle} days
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Q4 average</div>
        </div>

        <div className="mb-2">
          <div className="w-full rounded-md overflow-hidden flex" style={{ height: '16px' }}>
            <div 
              className="bg-blue-500 flex items-center justify-center"
              style={{ width: `${discoveryPct}%` }}
            >
              <span className="text-[9px] font-semibold text-white px-1">{discoveryDays}d</span>
            </div>
            <div 
              className="bg-amber-500 flex items-center justify-center"
              style={{ width: `${securityPct}%` }}
            >
              <span className="text-[9px] font-semibold text-white px-1">{securityDays}d</span>
            </div>
            <div 
              className="bg-purple-500 flex items-center justify-center"
              style={{ width: `${legalPct}%` }}
            >
              <span className="text-[9px] font-semibold text-white px-1">{legalDays}d</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-sm shrink-0"></div>
            <div>
              <div className="text-[9px] font-semibold text-gray-900">Discovery</div>
              <div className="text-[8px] text-gray-500">{discoveryDays}d</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-amber-500 rounded-sm shrink-0"></div>
            <div>
              <div className="text-[9px] font-semibold text-gray-900">Security</div>
              <div className="text-[8px] text-gray-500">{securityDays}d</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-purple-500 rounded-sm shrink-0"></div>
            <div>
              <div className="text-[9px] font-semibold text-gray-900">Legal</div>
              <div className="text-[8px] text-gray-500">{legalDays}d</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Animated version (only on first render)
  return (
    <motion.div
      className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-2.5 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <IconZap className="w-4 h-4 text-gray-600" />
        <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Avg Deal Cycle</div>
      </div>

      <div className="mb-2">
        <motion.div
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
        >
          {avgCycle} days
        </motion.div>
        <div className="text-xs text-gray-500 mt-0.5">Q4 average</div>
      </div>

      <div className="mb-2">
        <div className="w-full rounded-md overflow-hidden flex" style={{ height: '16px' }}>
          {/* Discovery Phase */}
          {discoveryPct > 0 && (
            <motion.div
              className="bg-blue-500 flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${discoveryPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: "easeOut" }}
            >
              <motion.span
                className="text-[9px] font-semibold text-white px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.15 + 1.3 }}
              >
                {discoveryDays}d
              </motion.span>
            </motion.div>
          )}
          
          {/* Security Phase */}
          {securityPct > 0 && (
            <motion.div
              className="bg-amber-500 flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${securityPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.6, ease: "easeOut" }}
            >
              <motion.span
                className="text-[9px] font-semibold text-white px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.15 + 1.4 }}
              >
                {securityDays}d
              </motion.span>
            </motion.div>
          )}
          
          {/* Legal Phase */}
          {legalPct > 0 && (
            <motion.div
              className="bg-purple-500 flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${legalPct}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.7, ease: "easeOut" }}
            >
              <motion.span
                className="text-[9px] font-semibold text-white px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.15 + 1.5 }}
              >
                {legalDays}d
              </motion.span>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-3 gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.15 + 0.8 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-500 rounded-sm shrink-0"></div>
          <div>
            <div className="text-[9px] font-semibold text-gray-900">Discovery</div>
            <div className="text-[8px] text-gray-500">{discoveryDays}d</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-500 rounded-sm shrink-0"></div>
          <div>
            <div className="text-[9px] font-semibold text-gray-900">Security</div>
            <div className="text-[8px] text-gray-500">{securityDays}d</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-purple-500 rounded-sm shrink-0"></div>
          <div>
            <div className="text-[9px] font-semibold text-gray-900">Legal</div>
            <div className="text-[8px] text-gray-500">{legalDays}d</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const MemoizedDealVelocityCard = memo(DealVelocityCard);
export default MemoizedDealVelocityCard;
export { MemoizedDealVelocityCard as DealVelocityCard };
