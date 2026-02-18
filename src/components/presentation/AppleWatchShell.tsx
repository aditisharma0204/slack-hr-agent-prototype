"use client";

import { ReactNode } from "react";

interface AppleWatchShellProps {
  children: ReactNode;
}

export function AppleWatchShell({ children }: AppleWatchShellProps) {
  return (
    <div 
      className="bg-white w-full h-full flex items-center justify-center select-none"
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
        if (!target.closest('button')) {
          target.blur();
        }
      }}
      onFocus={(e) => {
        e.currentTarget.blur();
      }}
    >
      <div 
        className="relative select-none" 
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        tabIndex={-1}
      >
        {/* Watch frame image - massively scaled up */}
        <img
          src="/Aple watch.jpg"
          alt="Apple Watch"
          className="w-[1155px] pointer-events-none select-none"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          draggable={false}
        />
        {/* Screen viewport overlay - precisely mapped to watch bezel */}
        <div 
          className="absolute top-[23.68%] left-[34.19%] w-[30.255%] h-[51.846%] rounded-[86px] bg-black overflow-hidden select-none"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
