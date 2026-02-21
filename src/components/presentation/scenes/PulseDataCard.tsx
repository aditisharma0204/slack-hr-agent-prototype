"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useId, useRef, memo } from "react";
import { IconDollar } from "@/components/icons";

interface PulseDataCardProps {
  attainment: number; // $471,000
  quota: number; // $500,000
  commissionMissed: number; // $4,200
  index?: number; // For staggered animation
}

// Module-level Set to track which cards have become static (persists across remounts)
const staticCards = new Set<string>();

// Reset function to clear static state (called when Scene 1 resets)
export function resetPulseDataCardMemory() {
  staticCards.clear();
}

// Q4 data points for cumulative actual revenue
const Q4_ACTUAL_POINTS = [
  { month: "Oct", value: 120000 },
  { month: "Nov", value: 280000 },
  { month: "Dec", value: 471000 },
];

// Q4 target points (cumulative quota pacing)
const Q4_TARGET_POINTS = [
  { month: "Oct", value: 166667 }, // $500K / 3 months
  { month: "Nov", value: 333333 }, // $500K / 3 * 2
  { month: "Dec", value: 500000 }, // $500K full quota
];

function PulseDataCard({ attainment, quota, commissionMissed, index = 0 }: PulseDataCardProps) {
  const cardKey = "pulse-card"; // Stable key for this card
  const [countUpValue, setCountUpValue] = useState(0);
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
      setCountUpValue(0); // Reset count value
    }
  }, []); // Run on mount to check if Set was cleared
  const uniqueId = useId();
  const gradientId = `pulse-gradient-${uniqueId}`;
  const areaId = `pulse-chart-area-${uniqueId}`;
  const pathId = `pulse-chart-path-${uniqueId}`;
  
  // Switch to static after all animations complete (longest delay is ~1.7s)
  useEffect(() => {
    if (staticCards.has(cardKey)) {
      setIsStatic(true);
      return; // Already static, don't set timer again
    }
    
    const timer = setTimeout(() => {
      staticCards.add(cardKey); // Mark as static in module-level Set
      setIsStatic(true); // Update state to trigger re-render
    }, 2000 + (index * 0.15 * 1000)); // Total animation time + delay
    return () => clearTimeout(timer);
  }, [index, cardKey]);

  // Animate the number rolling up - only once, strict mount-only execution
  useEffect(() => {
    // If already animated, set final value immediately and exit
    if (hasAnimated.current) {
      setCountUpValue(attainment);
      return;
    }
    
    // Mark as animated BEFORE starting animation to prevent race conditions
    hasAnimated.current = true;
    
    const duration = 1500;
    const steps = 60;
    const increment = attainment / steps;
    let step = 0;

    animationTimerRef.current = setInterval(() => {
      step++;
      const current = Math.min(increment * step, attainment);
      setCountUpValue(current);
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

  // Calculate SVG path for compact card chart
  const width = 280; // Standard card width
  const height = 55; // Reduced height
  const padding = { top: 10, right: 10, bottom: 15, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate target points (straight line pacing)
  const targetPoints = [
    { x: padding.left, y: padding.top + chartHeight * 0.25 }, // Oct: 25% from top
    { x: padding.left + chartWidth * 0.5, y: padding.top + chartHeight * 0.15 }, // Nov: 15% from top
    { x: padding.left + chartWidth, y: padding.top + chartHeight * 0.1 }, // Dec: 10% from top (target)
  ];

  // Generate actual points (exaggerated flat November, below target)
  const actualPoints = [
    { x: padding.left, y: padding.top + chartHeight * 0.4 }, // Oct: 40% from top (below target)
    { x: padding.left + chartWidth * 0.5, y: padding.top + chartHeight * 0.6 }, // Nov: 60% from top (flat, well below target)
    { x: padding.left + chartWidth, y: padding.top + chartHeight * 0.75 }, // Dec: 75% from top (below target)
  ];

  // Create smooth Bezier curve path for actual line
  const createBezierPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      const dx = (next.x - current.x) / 3;
      const dy1 = i === 0 ? 0 : (points[i].y - points[i - 1].y) / 3;
      const dy2 = i === points.length - 2 ? 0 : (points[i + 2]?.y - points[i + 1].y) / 3 || 0;
      
      const cp1x = current.x + dx;
      const cp1y = current.y + dy1;
      const cp2x = next.x - dx;
      const cp2y = next.y - dy2;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };

  const actualPath = createBezierPath(actualPoints);
  const targetPath = createBezierPath(targetPoints);
  const lastActualPoint = actualPoints[actualPoints.length - 1];
  const areaPath = `${actualPath} L ${lastActualPoint.x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const ATTAINMENT_PCT = Math.round((attainment / quota) * 100);
  const lastTargetPoint = targetPoints[targetPoints.length - 1];
  
  // Calculate percentage positions for HTML dots (mapped from SVG viewBox coordinates)
  const targetDotLeftPct = (lastTargetPoint.x / width) * 100;
  const targetDotTopPct = (lastTargetPoint.y / height) * 100;
  const actualDotLeftPct = (lastActualPoint.x / width) * 100;
  const actualDotTopPct = (lastActualPoint.y / height) * 100;

  // Static version (no animations)
  if (isStatic) {
    return (
      <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-2.5 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <IconDollar className="w-4 h-4 text-gray-600" />
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Q4 ATTAINMENT</div>
        </div>
        
        <div className="mb-1.5">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(attainment)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {ATTAINMENT_PCT}% of {formatCurrency(quota)} Quota
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-1.5 text-[9px]">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-purple-600"></div>
            <span className="text-gray-600 font-medium">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-gray-400"></div>
            <span className="text-gray-600 font-medium">Target</span>
          </div>
        </div>

        {/* Edge-to-Edge Purple Chart */}
        <div className="relative -mx-3 mb-1.5" style={{ width: 'calc(100% + 1.5rem)', height }}>
          <svg width="100%" height={height} className="overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Actual Area Fill */}
            <path id={areaId} d={areaPath} fill={`url(#${gradientId})`} />
            
            {/* Target Line (Dotted) */}
            <path 
              d={targetPath} 
              fill="none" 
              stroke="#9ca3af" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
            
            {/* Actual Line (Solid Purple) */}
            <path 
              id={pathId} 
              d={actualPath} 
              fill="none" 
              stroke="#9333ea" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          
          {/* HTML Dots Layer (Immune to stretching) */}
          {/* End Data Dot (Actual) */}
          <div 
            className="absolute w-2 h-2 rounded-full bg-purple-600 -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${actualDotLeftPct}%`, 
              top: `${actualDotTopPct}%` 
            }}
          ></div>
          
          {/* Missed Target Dot */}
          <div 
            className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${targetDotLeftPct}%`, 
              top: `${targetDotTopPct}%` 
            }}
          ></div>
        </div>

        {/* X-Axis Labels (Aligned with padding) */}
        <div className="flex justify-between px-0 text-[9px] text-gray-500">
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
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
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <IconDollar className="w-4 h-4 text-gray-600" />
        <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Q4 ATTAINMENT</div>
      </div>
      
      {/* Hero Metric */}
      <div className="mb-2">
          <motion.div
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
          >
            {formatCurrency(countUpValue)}
          </motion.div>
          <div className="text-xs text-gray-500 mt-0.5">
            {ATTAINMENT_PCT}% of {formatCurrency(quota)} Quota
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-1.5 text-[9px]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-purple-600"></div>
          <span className="text-gray-600 font-medium">Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 border-t-2 border-dashed border-gray-400"></div>
          <span className="text-gray-600 font-medium">Target</span>
        </div>
      </div>

      {/* Edge-to-Edge Purple Chart */}
      <div className="relative -mx-3 mb-1.5" style={{ width: 'calc(100% + 1.5rem)', height }}>
        <svg width="100%" height={height} className="overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Actual Area Fill */}
          <motion.path
            id={areaId}
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
          />
          
          {/* Target Line (Dotted) */}
          <motion.path 
            d={targetPath} 
            fill="none" 
            stroke="#9ca3af" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: index * 0.15 + 0.4 }}
          />
          
          {/* Actual Line (Solid Purple) */}
          <motion.path 
            id={pathId} 
            d={actualPath} 
            fill="none" 
            stroke="#9333ea" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: index * 0.15 + 0.5, ease: "easeInOut" }}
          />
        </svg>
        
        {/* HTML Dots Layer (Immune to stretching) */}
        {/* End Data Dot (Actual) */}
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-purple-600 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${actualDotLeftPct}%`, 
            top: `${actualDotTopPct}%` 
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: 1,
          }}
          transition={{ 
            scale: { duration: 0.5, delay: index * 0.15 + 1.6 },
            opacity: { duration: 0.3, delay: index * 0.15 + 1.6 }
          }}
        ></motion.div>
        
        {/* Missed Target Dot */}
        <motion.div 
          className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${targetDotLeftPct}%`, 
            top: `${targetDotTopPct}%` 
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 1.4 }}
        ></motion.div>
      </div>

      {/* X-Axis Labels (Aligned with padding) */}
      <div className="flex justify-between px-0 text-[9px] text-gray-500">
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </motion.div>
  );
}

// Memoize to prevent re-renders unless props actually change
const MemoizedPulseDataCard = memo(PulseDataCard);
export default MemoizedPulseDataCard;
export { MemoizedPulseDataCard as PulseDataCard };
