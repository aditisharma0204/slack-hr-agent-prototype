"use client";

import { useEffect, useRef, Children } from 'react';
import { Users, Headphones, Bell, Search } from 'lucide-react';
import { MessageInput } from './MessageInput';

interface UniversalChatSurfaceProps {
  title: string | React.ReactNode;
  icon?: React.ReactNode;
  memberCount?: number;
  placeholder?: string;
  onSendMessage: (text: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  children: React.ReactNode; // Accepts ChatMessages or Generative Sequences
}

export const UniversalChatSurface = ({ 
  title, 
  icon, 
  memberCount, 
  placeholder, 
  onSendMessage, 
  inputValue,
  onInputChange,
  children 
}: UniversalChatSurfaceProps) => {
  const endRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousChildrenCountRef = useRef<number>(Children.count(children));
  const childrenCount = Children.count(children);

  // Global auto-scroll: only when number of rendered chat items changes.
  // Using element reference equality causes false positives and visible jumpiness.
  useEffect(() => {
    const previousChildrenCount = previousChildrenCountRef.current;
    const childrenChanged = childrenCount !== previousChildrenCount;
    previousChildrenCountRef.current = childrenCount;

    if (childrenChanged) {
      // Clear any pending scroll
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce scroll to avoid excessive scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [childrenCount]);

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-l border-gray-200 min-w-0">
      
      {/* Universal Header */}
      <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="flex-shrink-0 text-gray-400">{icon}</span>}
          <h2 className="font-bold text-[18px] text-gray-900 truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-4 text-gray-500 flex-shrink-0 ml-4">
          {memberCount !== undefined && (
            <div className="flex items-center gap-1 text-[13px] font-medium border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 cursor-pointer">
              <Users className="w-4 h-4"/> {memberCount.toLocaleString()}
            </div>
          )}
          <Headphones className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
          <Bell className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
          <Search className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
        </div>
      </div>

      {/* Universal Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col custom-scrollbar">
        <div className="mt-auto flex flex-col gap-4">
          {children}
          <div ref={endRef} /> {/* Invisible anchor for auto-scroll */}
        </div>
      </div>

      {/* Universal Input Box */}
      <MessageInput 
        placeholder={placeholder || `Message ${typeof title === 'string' ? title : ''}`} 
        onSendMessage={onSendMessage}
        value={inputValue}
        onChange={onInputChange}
      />
      
    </div>
  );
};
