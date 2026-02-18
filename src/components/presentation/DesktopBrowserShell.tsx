"use client";

import { ReactNode } from "react";

interface DesktopBrowserShellProps {
  children: ReactNode;
}

export function DesktopBrowserShell({ children }: DesktopBrowserShellProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-[1280px] h-[800px] rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Browser chrome */}
        <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center gap-2 px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 bg-white rounded-md px-4 py-1.5 text-sm text-gray-500 mx-4">
            https://salesforce.com
          </div>
        </div>
        {/* Content area */}
        <div className="flex-1 overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );
}
