"use client";

interface Scene0Props {
  onNext: () => void;
}

export function Scene0({ onNext }: Scene0Props) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900 text-white">
    </div>
  );
}
