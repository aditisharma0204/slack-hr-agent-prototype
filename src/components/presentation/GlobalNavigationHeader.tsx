"use client";

import React from "react";

/**
 * Simplified global header for the Slack App Shell boilerplate.
 * In the master project this contained scene/arc navigation controls.
 * For the template, it's a clean, minimal branding bar.
 */
export function GlobalNavigationHeader() {
  return (
    <header
      className="global-header fixed top-0 left-0 w-full bg-[#040A14]/80 backdrop-blur-xl z-[10000] flex items-center justify-between px-8"
      style={{ height: "40px" }}
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slackbot-logo.svg"
          alt="SlackbotPro"
          className="w-6 h-6 flex-shrink-0"
        />
        <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium whitespace-nowrap">
          Slack App Shell
        </span>
      </div>

      {/* Right: Placeholder for future controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase font-bold">
          Template
        </span>
      </div>
    </header>
  );
}
