"use client";

import { useState } from 'react';
import { MessageInput } from './MessageInput';
import { ChatMessage } from './ChatMessage';
import { Users, Headphones, Bell, Search } from 'lucide-react';

// Rich dummy data matching the exemplar
const INITIAL_MESSAGES = [
  {
    id: 'm1',
    name: 'Pradeep Kalyan Lanke',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '12:18 AM',
    text: 'Its been a while I heard from perplexity. Now they are joining computer use mania [https://www.perplexity.ai/mk/hub/blog/introducing-perplexity-computer](https://www.perplexity.ai/mk/hub/blog/introducing-perplexity-computer)',
    reactions: [
      { emoji: '✅', count: 1 },
      { emoji: '🎯', count: 1 }
    ],
    replies: {
      count: 2,
      avatars: [
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/men/22.jpg'
      ],
      lastTime: 'today at 2:25 AM'
    }
  },
  {
    id: 'm2',
    name: 'SFW Support Request',
    tag: 'WORKFLOW',
    avatar: '/slackbot-logo.svg',
    time: '10:00 AM',
    workflow: {
      source: '#help-salesforce-workspaces',
      data: {
        'Submitted by': <span className="text-blue-600">@Chetan Jayadevaiah</span>,
        'Product': 'Cursor',
        'Category': 'Connectivity',
        'Problem Summary': 'Unable to connect to Cursor , after I installed cursor help tools and new cursor update'
      }
    },
    replies: {
      count: 7,
      avatars: [
        'https://randomuser.me/api/portraits/men/45.jpg',
        'https://randomuser.me/api/portraits/women/33.jpg'
      ],
      lastTime: 'today at 11:07 AM'
    }
  }
];

interface MainChatAreaProps {
  channelName?: string;
  memberCount?: number;
}

export const MainChatArea = ({ channelName = 'community-cursor', memberCount = 8455 }: MainChatAreaProps) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      name: 'Rita Patel', // The current user
      avatar: 'https://randomuser.me/api/portraits/med/women/75.jpg',
      time: 'Just now',
      text: text,
      reactions: [],
      replies: { count: 0, avatars: [], lastTime: "" }
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-l border-gray-200">
      
      {/* Rich Channel Header */}
      <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <div>
          <h2 className="font-bold text-[18px] text-gray-900 flex items-center gap-1">
            <span className="text-gray-400 font-normal">#</span>
            {channelName}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1 text-[13px] font-medium border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 cursor-pointer">
            <Users className="w-4 h-4"/> {memberCount.toLocaleString()}
          </div>
          <Headphones className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
          <Bell className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
          <Search className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col">
        <div className="mt-auto flex flex-col gap-4">
          
          {/* Unread Separator */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">New</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* SSOT Input Box */}
      <MessageInput 
        placeholder={`Message #${channelName}`} 
        onSendMessage={handleSendMessage} 
      />
      
    </div>
  );
};
