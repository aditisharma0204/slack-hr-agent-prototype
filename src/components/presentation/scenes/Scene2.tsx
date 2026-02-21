"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppleWatchShell } from "../AppleWatchShell";

interface Scene2Props {
  onNext: () => void;
}

export function Scene2({ onNext }: Scene2Props) {
  const [step, setStep] = useState<'face' | 'short' | 'long' | 'details'>('face');
  const [showNotification, setShowNotification] = useState(false);

  // Keyboard navigation for watch states
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        // Advance through states: face (no notification) -> face (with notification) -> short -> long -> details
        if (!showNotification && step === 'face') {
          setShowNotification(true);
        } else if (showNotification && step === 'face') {
          setStep('short');
        } else if (step === 'short') {
          setStep('long');
        } else if (step === 'long') {
          setStep('details');
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // Go backward through states
        if (step === 'details') {
          setStep('long');
        } else if (step === 'long') {
          setStep('short');
        } else if (step === 'short') {
          setStep('face');
        } else if (showNotification && step === 'face') {
          setShowNotification(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotification, step]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="watch-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full relative select-none"
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: 'default'
        }}
        tabIndex={-1}
        onMouseDown={(e) => {
          // Prevent focus and text selection on click
          e.preventDefault();
          const target = e.target as HTMLElement;
          // Only allow focus on actual buttons
          if (!target.closest('button')) {
            target.blur();
          }
        }}
        onClick={(e) => {
          // Prevent focus on click
          const target = e.target as HTMLElement;
          if (!target.closest('button')) {
            e.preventDefault();
          }
        }}
      >
        <AppleWatchShell>
          <div className="p-4 flex flex-col h-full w-full box-border overflow-hidden bg-black select-none" tabIndex={-1}>
            <AnimatePresence mode="wait">
              {/* View 1: Analog Face */}
              {step === 'face' && (
                <motion.div
                  key="face"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex items-center justify-center relative bg-black select-none"
                  tabIndex={-1}
                >
                  {/* Analog watch face - Using exact Figma design at 3.5x scale + 42% - 15% smaller */}
                  <div 
                    className="absolute w-[376px] h-[376px] z-10 select-none cursor-pointer"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowNotification(true);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onFocus={(e) => {
                      e.target.blur();
                    }}
                  >
                    <img 
                      src="/Watchface.png"
                      alt="Watch face"
                      className="w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>

                  {/* Notification - animates up from bottom, same dimensions and coordinates as watch face (376px × 376px) */}
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div
                        initial={{ x: '-50%', y: 'calc(-50% + 200px)', opacity: 0 }}
                        animate={{ x: '-50%', y: '-50%', opacity: 1 }}
                        exit={{ x: '-50%', y: 'calc(-50% + 200px)', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute w-[376px] h-[415px] rounded-2xl shadow-2xl z-20"
                        style={{
                          background: 'rgba(28, 28, 30, 0.08)',
                          backdropFilter: 'blur(30px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                          left: '50%',
                          top: '50%',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Confetti animation - paper shreds that fall once */}
                        <div className="absolute inset-0 overflow-visible pointer-events-none">
                          {Array.from({ length: 40 }, (_, i) => {
                            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
                            const delay = Math.random() * 0.8;
                            const duration = 2.5 + Math.random() * 1.5;
                            const x = Math.random() * 100;
                            const rotation = Math.random() * 1080; // More rotation for tumbling effect
                            const width = 2 + Math.random() * 3; // Thin strips
                            const height = 8 + Math.random() * 12; // Longer strips
                            const horizontalDrift = (Math.random() - 0.5) * 60;
                            return (
                              <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                  backgroundColor: colors[i % colors.length],
                                  left: `${x}%`,
                                  width: `${width}px`,
                                  height: `${height}px`,
                                  borderRadius: '1px',
                                }}
                                initial={{
                                  y: -100,
                                  opacity: 1,
                                  rotate: 0,
                                  x: 0,
                                }}
                                animate={{
                                  y: 'calc(100vh + 200px)',
                                  opacity: [1, 1, 0.8, 0],
                                  rotate: rotation,
                                  x: horizontalDrift,
                                }}
                                transition={{
                                  duration: duration,
                                  delay: delay,
                                  ease: [0.25, 0.46, 0.45, 0.94], // Ease-out for natural falling
                                }}
                              />
                            );
                          })}
                        </div>

                        <div className="p-6 flex flex-col h-full justify-center relative z-10">
                          {/* Slackbot icon - 1.5x scale with dynamic animation */}
                          <motion.div 
                            className="flex justify-center mb-4"
                            initial={{ scale: 0, rotate: -180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ 
                              type: 'spring', 
                              damping: 12, 
                              stiffness: 200,
                              delay: 0.2 
                            }}
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{
                                duration: 0.6,
                                delay: 0.5,
                                ease: 'easeInOut'
                              }}
                            >
                              <Image
                                src="/slackbot-logo.svg"
                                alt="Slackbot"
                                width={96}
                                height={96}
                                className="w-24 h-24"
                              />
                            </motion.div>
                          </motion.div>

                          {/* Title - 1.5x typography with dynamic animation */}
                          <motion.h3 
                            className="text-white text-[2.25rem] font-bold text-center mb-3 leading-tight"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ 
                              type: 'spring',
                              damping: 15,
                              stiffness: 300,
                              delay: 0.4 
                            }}
                          >
                            <motion.span
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: 'spring',
                                damping: 10,
                                delay: 0.6
                              }}
                            >
                              Deal Closed
                            </motion.span>
                          </motion.h3>

                          {/* Body text - 1.5x typography with staggered animation */}
                          <motion.div 
                            className="text-white text-[1.3125rem] text-center space-y-1.5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.p 
                              className="text-white/90"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.7, type: 'spring', damping: 20 }}
                            >
                              Greentech Deal Closed!
                            </motion.p>
                            <motion.p 
                              className="text-white/70"
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.8, type: 'spring', damping: 20 }}
                            >
                              Quota achieved $498K
                            </motion.p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* View 2: Short Look */}
              {step === 'short' && (
                <motion.div
                  key="short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="absolute w-[440px] h-[440px] flex flex-col items-center justify-center text-white"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 via-blue-400 to-green-400" />
                    
                    {/* Text */}
                    <div className="text-sm font-bold text-white mt-3 text-center">
                      Deal Closed
                    </div>
                    <div className="text-[10px] text-gray-300 mt-1 text-center">
                      Greentech Deal Closed!
                    </div>
                    <div className="text-[10px] text-gray-300 mt-0.5 text-center">
                      Quota achieved $498K
                    </div>
                  </div>
                </motion.div>
              )}

              {/* View 3: Long Look */}
              {step === 'long' && (
                <motion.div
                  key="long"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="absolute w-[440px] h-[440px] flex flex-col text-white"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="w-4 h-4 rounded bg-gradient-to-tr from-pink-500 via-blue-400 to-green-400" />
                    <div className="text-right">
                      <div className="text-white text-[11px]">10:09</div>
                      <div className="text-gray-400 text-[9px] mt-0.5">now</div>
                    </div>
                  </div>

                  {/* Content box */}
                  <div className="bg-[#2C2C2E] rounded-xl p-2.5 mt-1.5">
                    <div className="font-bold text-white text-xs">Deal Closed</div>
                    <div className="text-gray-300 text-[10px] mt-1 leading-snug">
                      Greentech Deal Closed! Quota achieved $498K
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-2 space-y-1.5">
                    <button
                      onClick={() => setStep('details')}
                      className="bg-[#3C3C3E] hover:bg-[#4C4C4E] text-white text-[10px] font-semibold py-2 w-full rounded-full transition-colors focus:outline-none select-none"
                      type="button"
                    >
                      Details
                    </button>
                    <button
                      onClick={onNext}
                      className="bg-[#3C3C3E] hover:bg-[#4C4C4E] text-white text-[10px] font-semibold py-2 w-full rounded-full transition-colors focus:outline-none select-none"
                      type="button"
                    >
                      Dismiss
                    </button>
                  </div>
                  </div>
                </motion.div>
              )}

              {/* View 4: Slackbot Actions / Details */}
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="absolute w-[440px] h-[440px] flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/30 via-black to-black text-white"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                  {/* Header */}
                  <div className="text-xs font-bold text-white mb-2">
                    Slackbot actions
                  </div>

                  {/* Timeline list */}
                  <div className="flex-1 space-y-2">
                    {/* Item 1 */}
                    <div className="flex items-start gap-1.5">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white">Legal</span>
                          <span className="text-[8px] text-gray-400">1:30 PM</span>
                        </div>
                        <div className="text-[9px] text-gray-300 mt-0.5">Approved MSA terms.</div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-1.5">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white">DocuSign</span>
                          <span className="text-[8px] text-gray-400">2:05 PM</span>
                        </div>
                        <div className="text-[9px] text-gray-300 mt-0.5">Client signature routed.</div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-1.5">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white">RevOps Agent</span>
                          <span className="text-[8px] text-gray-400">2:14 PM</span>
                        </div>
                        <div className="text-[9px] text-gray-300 mt-0.5">CRM forecast updated.</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Button */}
                  <div className="mt-auto pt-3">
                    <button
                      onClick={onNext}
                      className="bg-[#2C2C2E] text-white text-[10px] font-semibold py-2 w-full rounded-full transition-colors hover:bg-[#3C3C3E] focus:outline-none select-none"
                      type="button"
                    >
                      Dismiss
                    </button>
                  </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AppleWatchShell>

        {/* Left Arrow (Back) - moved 500px towards center */}
        {/* Show when we can go back: notification is shown OR we're past the initial face state */}
        {(showNotification || step !== 'face') && (
          <button
            onClick={() => {
              if (step === 'face' && showNotification) {
                setShowNotification(false);
              } else if (step === 'short') {
                setStep('face');
                setShowNotification(true);
              } else if (step === 'long') {
                setStep('short');
              } else if (step === 'details') {
                setStep('long');
              }
            }}
            className="absolute top-1/2 left-[540px] -translate-y-1/2 w-14 h-14 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-black transition-colors z-[100] border border-black/5 pointer-events-auto focus:outline-none select-none"
            type="button"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
        )}

        {/* Right Arrow (Forward) - moved 500px towards center */}
        {/* Show when we can go forward: not at details step */}
        {step !== 'details' && (
          <button
            onClick={() => {
              if (!showNotification && step === 'face') {
                setShowNotification(true);
              } else if (showNotification && step === 'face') {
                setStep('short');
              } else if (step === 'short') {
                setStep('long');
              } else if (step === 'long') {
                setStep('details');
              }
            }}
            className="absolute top-1/2 right-[540px] -translate-y-1/2 w-14 h-14 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-black transition-colors z-[100] border border-black/5 pointer-events-auto focus:outline-none select-none"
            type="button"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
