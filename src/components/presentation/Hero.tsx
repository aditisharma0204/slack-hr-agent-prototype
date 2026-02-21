"use client";

import { useState, useMemo, useEffect } from "react";
import { UB_NOISE } from "@/lib/presentation-data";
import confetti from 'canvas-confetti';

interface HeroProps {
  onUnbundlingClick: () => void;
  onScenesClick: () => void;
}

export function Hero({ onUnbundlingClick, onScenesClick }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [clearedGroups, setClearedGroups] = useState<string[]>([]);

  // Grouped noise tasks (for insight mapping)
  const NOISE_GROUPS = [
    {
      id: 'data',
      title: 'Data Entry',
      insight: 'Data entry is a machine\'s job. Your job is to sell.',
    },
    {
      id: 'context',
      title: 'Context Hunting',
      insight: 'The CRM should bring context to you, not hide it.',
    },
    {
      id: 'admin',
      title: 'Logistics & Admin',
      insight: 'AI handles the logistics. You handle the relationship.',
    },
    {
      id: 'chasing',
      title: 'The "Checking In" Tax',
      insight: 'Automate the follow-up. Personalize the connection.',
    }
  ];

  // Expanded mundane tasks - overwhelming chaos
  const mundaneTasks = [
    "Navigate dashboards for anxiety", "Draft 'wanted to follow up' email", 
    "Generate activity report", "Search Salesforce for history", 
    "Assemble meeting brief from 4 tools", "Update 14 CRM fields", 
    "Schedule → reschedule → confirm", "Update pipeline for Monday review", 
    "Chase signature emails", "Reconcile forecast across 3 sheets", 
    "Log every email manually", "Send templated email, personalize 3s", 
    "Enter call notes (15 min)", "Find pricing in Slack", 
    "Manually link deal to account", "Search lead: LinkedIn → Docs",
    "Find MEDDIC gaps", "Sync lead status to Marketo", 
    "Copy-paste email to notes", "Tag manager in Chatter", 
    "Find billing contact", "Export pipeline to CSV", 
    "Check if prospect opened email", "Find NDA in Drive", 
    "Update 'Next Step' date", "Log voicemail", "Fix formatting in proposal"
  ];

  // Generate CHAOS_TASKS with better arrangement algorithm to reduce overlap
  const CHAOS_TASKS = useMemo(() => {
    const groups = ['data', 'context', 'admin', 'chasing'];
    const tasks: Array<{
      id: string;
      groupId: string;
      text: string;
      rotation: number;
      leftPercent: number;
      topPercent: number;
    }> = [];
    
    // Truly random distribution with safe bounds to prevent chopping
    const usedPositions: Array<{ x: number; y: number }> = [];
    const minDistance = 7; // Minimum distance to prevent overlap
    const padding = 15; // Safe padding from edges to prevent chopping (15% on all sides)
    
    mundaneTasks.forEach((text, index) => {
      const groupId = groups[index % groups.length];
      
      // Truly random position within safe bounds
      let leftPercent = padding + Math.random() * (100 - (padding * 2));
      let topPercent = padding + Math.random() * (100 - (padding * 2));
      
      // Resolve overlaps with random repositioning
      let attempts = 0;
      while (attempts < 50) {
        const tooClose = usedPositions.some(pos => {
          const dx = leftPercent - pos.x;
          const dy = topPercent - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });
        
        if (!tooClose) break;
        
        // Try a completely new random position
        leftPercent = padding + Math.random() * (100 - (padding * 2));
        topPercent = padding + Math.random() * (100 - (padding * 2));
        attempts++;
      }
      
      usedPositions.push({ x: leftPercent, y: topPercent });
      
      // Random rotation for organic feel (-10 to 10 degrees)
      const rotation = Math.random() * 20 - 10;
      
      tasks.push({
        id: String(index + 1),
        groupId,
        text,
        rotation,
        leftPercent,
        topPercent
      });
    });
    
    return tasks;
  }, []); // Empty dependency array ensures this only calculates once

  const handleTaskClick = (groupId: string) => {
    if (clearedGroups.includes(groupId)) return;
    setClearedGroups([...clearedGroups, groupId]);
  };

  // Trigger confetti when all groups are cleared
  useEffect(() => {
    if (clearedGroups.length === 4) {
      // Trigger confetti celebration (moved 400px to the right)
      const rect = document.body.getBoundingClientRect();
      const x = (400 + rect.width / 2) / rect.width;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: x, y: 0.6 },
        zIndex: 50
      });
      
      // Ensure confetti canvas is on top
      const canvas = document.querySelector('canvas');
      if (canvas) {
        (canvas as HTMLElement).style.zIndex = '50';
        (canvas as HTMLElement).style.pointerEvents = 'none';
        (canvas as HTMLElement).style.position = 'fixed';
      }
    }
  }, [clearedGroups.length]);

  // Corner positions for sequential insights (closer to center, center-aligned)
  const corners = [
    'top-1/2 left-1/2 -translate-x-[200px] -translate-y-[150px]',  // Top-left quadrant, closer to center
    'top-1/2 left-1/2 translate-x-[200px] -translate-y-[150px]', // Top-right quadrant, closer to center
    'top-1/2 left-1/2 translate-x-[200px] translate-y-[150px]', // Bottom-right quadrant, closer to center
    'top-1/2 left-1/2 -translate-x-[200px] translate-y-[150px]'  // Bottom-left quadrant, closer to center
  ];

  return (
    <div 
      className="relative w-full h-full bg-[#0047FF] overflow-hidden flex text-white"
    >
      {/* Hero Image (Left) - Using image mask like SceneLayout */}
      <div
        className="absolute left-0 top-0 w-[65%] h-full z-[5] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, white 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, white 80%, transparent 100%)'
        }}
      >
        <img
          src="/Rita_Intro.png"
          alt="Rita"
          className="w-full h-full object-cover object-left"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Master Scroll Column (Right) */}
      <div
        onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
        className="ml-[35%] w-[65%] overflow-y-auto snap-y snap-mandatory scroll-smooth relative z-10 pb-32 bg-transparent h-full"
      >
        {/* Section 1: Brand */}
        <div className="min-h-screen flex flex-col justify-center snap-start">
          <div className="w-full max-w-[640px] px-20 mx-auto flex flex-col items-start text-left">
            {/* Eyebrow / Brand Row */}
            <div className="flex items-center gap-8 mb-6">
              <div className="flex items-center gap-3 flex-shrink-0">
                <img src="/slackbot-logo.svg" alt="Slackbot" className="w-8 h-8" />
                <span className="text-xl font-bold tracking-wide text-white whitespace-nowrap">SlackbotPro</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-200 font-light tracking-wide whitespace-nowrap">Sales Cloud UX | Feb 2026</span>
              </div>
            </div>
            {/* Main Hero Title */}
            <h1 className="text-6xl md:text-8xl text-white leading-tight mb-3" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
              Future of Selling
            </h1>
            <p className="text-xl font-light mb-8" style={{ color: '#B3D9FF' }}>
              Evolving the CRM into an invisible, omnipresent layer that moves at the speed of a seller's life.
            </p>
            {/* Design Credit */}
            <span className="text-[11px] text-gray-200 font-light tracking-wide whitespace-nowrap">Design explorations by Prantik Banerjee</span>
          </div>
        </div>

        {/* Section 2: The CRM Paradox */}
        <div className="min-h-screen flex flex-col justify-center snap-start">
          <div className="w-full max-w-[640px] px-20 mx-auto flex flex-col items-start text-left">
            <span className="tracking-widest text-xs uppercase mb-4 block" style={{ color: '#66B3FF' }}>
              The CRM Paradox
            </span>
            <h2 className="text-4xl md:text-5xl leading-tight text-white mb-6" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
              For decades, we've treated sales like a numbers game.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#B3D9FF' }}>
              The CRM was built to track revenue, not generate it. It became a destination you have to visit, rather than an assistant that works alongside you. The tool designed to help sellers sell became the biggest barrier to selling.
            </p>
          </div>
        </div>

        {/* Section 3: Our Approach */}
        <div className="min-h-screen flex flex-col justify-center snap-start">
          <div className="w-full max-w-[640px] px-20 mx-auto flex flex-col items-start text-left">
            <span className="tracking-widest text-xs uppercase mb-4 block" style={{ color: '#66B3FF' }}>
              Our Approach
            </span>
            <h2 className="text-4xl md:text-5xl leading-tight text-white mb-6" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
              But as we enter the Agentic Era...
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#B3D9FF' }}>
              Intelligence should be everywhere you are—yet completely invisible. The CRM stops being a destination and becomes a reflex. Everywhere. Invoked. Ambient. Protective.
            </p>
          </div>
        </div>

        {/* Section 4: The Persona - Unboxed */}
        <section id="persona-section" className="min-h-screen flex flex-col justify-center snap-start">
          <div className="w-full max-w-[640px] px-20 mx-auto flex flex-col items-start text-left">
            <div className="text-[11px] font-medium tracking-[0.18em] uppercase mb-6" style={{ color: "#66B3FF" }}>
              The Persona
            </div>
            <h1 className="text-6xl text-white mb-2" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
              Rita Sterling.
            </h1>
            <h2 className="text-xl font-light mb-8" style={{ color: '#B3D9FF' }}>
              Senior Account Executive, Enterprise
            </h2>
            
            {/* Unboxed Text */}
            <div className="text-[17px] leading-relaxed space-y-6" style={{ color: '#B3D9FF' }}>
              <p>
                Rita is a top performer, but she was exhausted. For years, she lived in the Bundled World. She spent 60% of her day logging activities, hunting for context across six different apps, and navigating dashboards just to prove she was doing her job. The CRM wasn't a tool; it was a tax on her time.
              </p>
              <p>
                Today is Day 1 of Q1. We are going to follow Rita's steel thread to a $631K quarter close—using a CRM she never actually has to open.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: The Chaotic Scrap Pile */}
        <section className="min-h-[90vh] flex flex-col justify-center snap-center relative">
          <div className="relative z-10 flex flex-col items-start w-full h-full px-20 ml-[100px]">
            <div className={`w-full max-w-xl mx-auto flex flex-col items-start text-left transition-all duration-700 ease-out ${
              clearedGroups.length > 0 ? 'opacity-0 pointer-events-none translate-y-[-10px]' : 'opacity-100 translate-y-0'
            }`}>
              <h2 className="text-xl font-bold tracking-widest uppercase mb-6" style={{ color: '#FFFFFF' }}>
                The Bundled Life
              </h2>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#E5F4FF' }}>
                Rita spent 60% of her time on operational chores. It was a sea of meaningless activities—so much work around the work, just to prove she was doing her job.
              </p>
            </div>
            
            {/* The Pill Container */}
            <div
              className={`relative w-full max-w-xl h-[500px] mt-12 mx-auto transition-opacity duration-1000 overflow-visible z-10 ${
                clearedGroups.length === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
                  {CHAOS_TASKS.map((task) => {
                    const isCleared = clearedGroups.includes(task.groupId);
                    
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task.groupId)}
                        className={`absolute whitespace-nowrap rounded-full px-6 py-3 border text-xs shadow-lg cursor-pointer backdrop-blur-md transition-all duration-300 ${
                          isCleared
                            ? "line-through opacity-30 grayscale pointer-events-none bg-[#111]/50 border-white/5"
                            : "bg-white/10 border-white/20 hover:bg-red-500/90 hover:border-red-400 hover:shadow-[0_0_24px_rgba(239,68,68,0.8)] hover:scale-110 hover:z-50 active:scale-105 active:bg-red-600"
                        }`}
                        style={{
                          left: `${task.leftPercent}%`,
                          top: `${task.topPercent}%`,
                          transform: `translate(-50%, -50%) rotate(${task.rotation}deg)`,
                          transformOrigin: 'center center',
                          maxWidth: '200px',
                          height: '32px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isCleared ? '#999' : '#B3D9FF',
                        }}
                        title={task.text}
                      >
                        {task.text}
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Sequential Corner Insights */}
          {clearedGroups.map((groupId, index) => {
            const group = NOISE_GROUPS.find(g => g.id === groupId);
            if (!group) return null;
            
            return (
              <div
                key={`insight-${groupId}`}
                className={`absolute ${corners[index]} animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700 text-center z-0 pointer-events-none`}
              >
                <h4 className="text-lg leading-tight max-w-[200px] mx-auto" style={{ color: '#B3D9FF', fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                  {group.insight}
                </h4>
              </div>
            );
          })}

          {/* Final Unbundled Reveal */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 delay-500 ml-[200px] mt-[100px] ${
              clearedGroups.length === 4
                ? 'opacity-100 scale-100 z-50'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <h2 className="text-5xl" style={{ color: '#FFFFFF', fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>The Unbundled Life</h2>
            <p className="mt-4" style={{ color: '#E5F4FF' }}>What remains is the real work.</p>
          </div>
        </section>

        {/* Section 6: The Unbundled Reality & Final CTA */}
        <section className="min-h-[80vh] flex flex-col justify-center snap-start">
          <div className="w-full max-w-xl px-20 mx-auto flex flex-col items-start text-left">
            {/* Header */}
            <h3 className="tracking-widest text-sm uppercase mb-6 text-left" style={{ color: '#66B3FF' }}>
              The Unbundled Reality
            </h3>

            {/* Narrative Bridge */}
            <p className="text-[17px] md:text-lg mb-12 leading-relaxed text-left" style={{ color: '#B3D9FF' }}>
              Let's dive into Rita's world. Rita is a senior Account Executive... Tomorrow marks the beginning of the most critical period of her year: the year-end quarter. The pipeline is heavy, the expectations are higher, and the pressure is on. But this quarter will be different.
            </p>

            {/* Qualitative Value Cards */}
            <div className="grid grid-cols-2 gap-6 w-full mb-12 text-left">
              {[
                { title: "Frictionless Flow", desc: "Eradicating the daily operational tax." },
                { title: "Strategic Dominance", desc: "Elevating the seller to a Value Orchestrator." },
                { title: "Omnipresent Support", desc: "Intelligence that follows across every device." },
                { title: "Human Connection", desc: "Reclaiming time to build profound buyer trust." },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div className="text-xl text-white mb-2" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                    {card.title}
                  </div>
                  <div className="text-sm text-gray-200 leading-relaxed">
                    {card.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="text-left">
              <button
                onClick={onScenesClick}
                className="px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:-translate-y-1"
                style={{ 
                  background: '#FFFFFF',
                  backgroundColor: '#FFFFFF',
                  color: '#181818',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Step into the Scenarios →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
