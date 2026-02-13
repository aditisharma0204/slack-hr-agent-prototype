"use client";

import { DemoDataProvider } from "@/context/DemoDataContext";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <DemoDataProvider>{children}</DemoDataProvider>
    </div>
  );
}
