"use client";

import { ReactNode } from "react";

interface iPadShellProps {
  children: ReactNode;
}

export function iPadShell({ children }: iPadShellProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-[1024px] h-[768px] rounded-[20px] bg-black p-3 shadow-2xl">
        <div className="w-full h-full rounded-[12px] bg-white overflow-hidden">
          <div className="w-full h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
