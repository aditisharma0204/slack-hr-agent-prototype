"use client";

import React from 'react';
import Link from 'next/link';
import { generateInitialsAvatar, createAvatarErrorHandler } from '@/lib/avatar-utils';
import { BlockKitRenderer } from '@/components/block-kit/BlockKitRenderer';
import type { SlackBlock } from '@/components/block-kit/BlockKitRenderer';

interface ChatMessageProps {
  message: {
    id: string;
    name: string;
    avatar: string;
    time: string;
    tag?: string;
    text?: string;
    workflow?: {
      source: string;
      data: Record<string, React.ReactNode>;
    };
    blocks?: SlackBlock[];
    isBot?: boolean;
    attachment?: {
      filename: string;
      type: 'pdf' | 'doc' | 'sheet' | 'slide';
      size: string;
    };
    threadCount?: number;
    reactions?: Array<{ emoji: string; count: number }>;
    replies?: {
      count: number;
      avatars: string[];
      lastTime: string;
    };
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [avatarError, setAvatarError] = React.useState(false);
  const [avatarSrc, setAvatarSrc] = React.useState(message.avatar);

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (!avatarError) {
      setAvatarError(true);
      setAvatarSrc(generateInitialsAvatar(message.name, 36));
    }
  };

  return (
    <div className="flex gap-3 hover:bg-[#f8f8f8] p-2 -mx-2 rounded transition-colors group">
      <img 
        src={avatarSrc} 
        className={`w-9 h-9 object-cover flex-shrink-0 mt-0.5 ${message.isBot ? 'rounded' : 'rounded-md'}`} 
        alt={message.name}
        onError={handleAvatarError}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-bold text-[15px] text-gray-900">{message.name}</span>
          {message.tag && <span className="bg-gray-200 text-gray-700 text-[10px] px-1 rounded font-bold">{message.tag}</span>}
          <span className="text-[12px] text-gray-500 hover:underline cursor-pointer">{message.time}</span>
        </div>
        
        {/* Standard Text */}
        {message.text && !message.blocks && (
          <div className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap">
            {message.text.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
              const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
              if (linkMatch) {
                return (
                  <Link key={i} href={linkMatch[2]} className="text-blue-600 hover:underline">
                    {linkMatch[1]}
                  </Link>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        )}

        {/* Structured Block Content */}
        {message.blocks && (
          <div className="mt-1">
            <BlockKitRenderer blocks={message.blocks} />
          </div>
        )}
        
        {/* Workflow Block */}
        {message.workflow && (
          <div className="mt-2 text-[14px] text-gray-800 border-l-4 border-gray-300 pl-3">
            <div className="italic mb-1">
              Redirected from{' '}
              <Link href={message.workflow.source} className="text-blue-600 cursor-pointer hover:underline">
                {message.workflow.source}
              </Link>
            </div>
            {Object.entries(message.workflow.data).map(([key, val]) => (
              <div key={key} className="mb-0.5">
                <span className="font-bold">{key}:</span> {val}
              </div>
            ))}
          </div>
        )}

        {/* Shared document attachment */}
        {message.attachment && (
          <div className="mt-2 flex items-center gap-3 p-3 border border-gray-200 rounded-xl max-w-sm hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
              {message.attachment.type.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-blue-600 truncate">{message.attachment.filename}</div>
              <div className="text-[11px] text-gray-500">{message.attachment.size} • Click to view</div>
            </div>
          </div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((r, i) => (
              <button 
                key={i} 
                type="button" 
                className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
              >
                <span className="text-[13px]">{r.emoji}</span>
                <span className="text-[11px] font-bold text-blue-700">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread Replies */}
        {message.replies && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-1">
              {message.replies.avatars.map((av, i) => {
                const [replyAvatarError, setReplyAvatarError] = React.useState(false);
                const handleReplyAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  if (!replyAvatarError) {
                    setReplyAvatarError(true);
                    const target = e.target as HTMLImageElement;
                    target.src = generateInitialsAvatar(`User ${i + 1}`, 24);
                  }
                };
                return (
                  <img 
                    key={i} 
                    src={av} 
                    className="w-6 h-6 rounded border-2 border-white relative z-10" 
                    alt="" 
                    onError={handleReplyAvatarError}
                  />
                );
              })}
            </div>
            <span className="text-[13px] text-blue-600 font-bold hover:underline cursor-pointer">
              {message.replies.count} replies
            </span>
            <span className="text-[12px] text-gray-500">Last reply {message.replies.lastTime}</span>
          </div>
        )}
        {!message.replies && message.threadCount && (
          <div className="mt-1 flex items-center gap-2 cursor-pointer">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded bg-gray-300 border border-white"></div>
              <div className="w-5 h-5 rounded bg-blue-300 border border-white"></div>
            </div>
            <span className="text-[13px] font-bold text-blue-600 hover:underline">
              {message.threadCount} replies
            </span>
            <span className="text-[12px] text-gray-400">Last reply today</span>
          </div>
        )}
      </div>
    </div>
  );
};
