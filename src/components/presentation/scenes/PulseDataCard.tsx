"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface PulseDataCardProps {
  attainment: number; // $471,000
  quota: number; // $500,000
  commissionMissed: number; // $4,200
}

// Q4 data points for the area chart (simplified monthly progression)
const Q4_DATA_POINTS = [
  { month: "Oct", value: 120000 },
  { month: "Nov", value: 280000 },
  { month: "Dec", value: 471000 },
];

const QUOTA = 500000;
const ATTAINMENT = 471000;
const ATTAINMENT_PCT = Math.round((ATTAINMENT / QUOTA) * 100);

export function PulseDataCard({ attainment, quota, commissionMissed }: PulseDataCardProps) {
  const [countUpValue, setCountUpValue] = useState(0);

  // Animate the number rolling up
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = attainment / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, attainment);
      setCountUpValue(current);
      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [attainment]);

  // Calculate SVG path for area chart
  const width = 320;
  const height = 120;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...Q4_DATA_POINTS.map((d) => d.value), quota);

  // Generate path data
  const points = Q4_DATA_POINTS.map((point, index) => {
    const x = padding + (index / (Q4_DATA_POINTS.length - 1)) * chartWidth;
    const y = height - padding - (point.value / maxValue) * chartHeight;
    return { x, y };
  });

  // Create SVG path string
  const pathData = `M ${points[0].x} ${points[0].y} ${points
    .slice(1)
    .map((p) => `L ${p.x} ${p.y}`)
    .join(" ")} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md shadow-sm">
      {/* Hero Metric */}
      <div className="mb-4">
        <motion.div
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatCurrency(countUpValue)}
        </motion.div>
        <div className="text-sm text-gray-500 mt-1">
          {ATTAINMENT_PCT}% of {formatCurrency(quota)} Quota
        </div>
      </div>

      {/* SVG Area Chart */}
      <div className="mb-4" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <motion.path
            id="pulse-chart-area"
            d={pathData}
            fill="url(#pulse-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Stroke line */}
          <motion.path
            id="pulse-chart-path"
            d={`M ${points[0].x} ${points[0].y} ${points
              .slice(1)
              .map((p) => `L ${p.x} ${p.y}`)
              .join(" ")}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.2 }}
            />
          ))}
        </svg>
      </div>

      {/* Insight Box */}
      <motion.div
        className="bg-amber-50 border border-amber-200 rounded-lg p-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.5 }}
      >
        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-lg">⚠️</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-amber-900">
              You missed your accelerator by {formatCurrency(quota - attainment)} last quarter.
            </div>
            <div className="text-xs text-amber-700 mt-1">
              That was {formatCurrency(commissionMissed)} in commission left on the table.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
