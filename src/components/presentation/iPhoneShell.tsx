"use client";

import { ReactNode } from "react";

interface iPhoneShellProps {
  children: ReactNode;
}

export function iPhoneShell({ children }: iPhoneShellProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-[375px] h-[812px] rounded-[40px] bg-black p-2 shadow-2xl">
        <div className="w-full h-full rounded-[32px] bg-white overflow-hidden">
          <div className="w-full h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
