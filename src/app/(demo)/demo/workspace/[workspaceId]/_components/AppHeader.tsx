"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSlackbot } from "../_context/demo-layout-context";
import { IconSearch } from "@/components/icons";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { assetPath } from "@/lib/asset-path";
import type { EpicEntry } from "@/stories";

const T = SLACK_TOKENS;

interface AppHeaderProps {
  epics?: EpicEntry[];
  activeEpicId?: string;
  onEpicChange?: (id: string) => void;
}

function EpicDropdown({
  epics,
  activeEpicId,
  onEpicChange,
}: {
  epics: EpicEntry[];
  activeEpicId: string;
  onEpicChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const active = epics.find((e) => e.id === activeEpicId) ?? epics[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer select-none"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="max-w-[160px] truncate">{active.label}</span>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/60">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-[280px] rounded-lg border border-white/10 bg-[#1a1d21] shadow-2xl overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          <div className="px-3 py-2 border-b border-white/10">
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">Product Epics</span>
          </div>
          {epics.map((epic) => {
            const isActive = epic.id === activeEpicId;
            return (
              <button
                key={epic.id}
                type="button"
                onClick={() => {
                  onEpicChange(epic.id);
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#1164a3]/30"
                    : "hover:bg-white/5"
                }`}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-[#36c5f0]" : "bg-white/20"}`} />
                <div className="min-w-0">
                  <div className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-white/80"}`}>
                    {epic.label}
                  </div>
                  <div className="text-xs text-white/40 truncate mt-0.5">
                    {epic.description}
                  </div>
                </div>
                {isActive && (
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#36c5f0" strokeWidth="2.5" className="shrink-0 mt-0.5 ml-auto">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AppHeader({ epics, activeEpicId, onEpicChange }: AppHeaderProps) {
  const { isOpen, toggle } = useSlackbot();
  const showEpicDropdown = epics && epics.length > 0 && activeEpicId && onEpicChange;

  return (
    <header
      className="h-12 shrink-0 flex items-center w-full relative"
      style={{ zIndex: 100, backgroundColor: T.colors.globalBg, marginTop: 0 }}
    >
      {/* Spacer: align with list pillar (72px icon bar) - arrows start after */}
      <div className="w-[72px] shrink-0" aria-hidden />

      {/* Left: Nav arrows (after list pillar) */}
      <div className="flex items-center gap-1 pl-2 pr-4 shrink-0" style={{ marginLeft: '270px' }}>
        <button className="p-1.5 rounded hover:bg-white/10 text-white/80 transition-colors" title="Back">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="p-1.5 rounded hover:bg-white/10 text-white/80 transition-colors" title="Forward">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Center: Search bar + Slackbot icon grouped together */}
      <div className="flex-1 flex items-center justify-center min-w-0 max-w-[776px] mx-4" style={{ marginLeft: '-8px' }}>
        {/* Search bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 min-w-0">
          <IconSearch width={18} height={18} className="text-white/70 shrink-0" stroke="currentColor" />
          <input
            type="text"
            placeholder="Search Salesforce"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder:text-white/60 text-sm"
          />
        </div>
        {/* Slackbot Toggle - grouped with search bar, on the right */}
        <button
          type="button"
          onClick={toggle}
          className={`p-2 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer ${isOpen ? "bg-white/15" : ""}`}
          title={isOpen ? "Close Slackbot" : "Open Slackbot"}
          style={{ marginLeft: '16px' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath("/slackbot-logo.svg")} alt="Slackbot" width={33} height={33} />
        </button>
      </div>

      {/* Right: Epic dropdown + Call + Bell + Help + Give Feedback + User */}
      <div className="flex items-center gap-1 pl-4 pr-4 shrink-0 ml-auto">
        {/* Epic switcher dropdown */}
        {showEpicDropdown && (
          <EpicDropdown
            epics={epics}
            activeEpicId={activeEpicId}
            onEpicChange={onEpicChange}
          />
        )}

        {showEpicDropdown && (
          <div className="w-px h-5 bg-white/15 mx-1" />
        )}

        {/* Call */}
        <button className="p-2 rounded hover:bg-white/10 text-white/90 transition-colors" title="Calls">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>

        {/* Bell */}
        <button className="p-2 rounded hover:bg-white/10 text-white/90 transition-colors relative" title="Notifications">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Help */}
        <button className="p-2 rounded hover:bg-white/10 text-white/90 transition-colors" title="Help">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        {/* Give Feedback */}
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 text-white/90 text-sm transition-colors">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Give Feedback</span>
        </button>

        {/* User */}
        <button className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded hover:bg-white/10 text-white/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
