"use client";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Code,
  Plus,
  Type,
  Smile,
  AtSign,
  Paperclip,
  Send,
  ChevronDown,
} from "lucide-react";

interface DemoMessageInputProps {
  channelId: string;
  placeholder?: string;
}

export function DemoMessageInput({ channelId, placeholder }: DemoMessageInputProps) {
  const ph = placeholder ?? `Message #${channelId}`;

  return (
    <div className="p-4 border-t" style={{ borderColor: "#e8e8e8" }}>
      <div className="flex flex-wrap gap-1 mb-2">
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Bold">
          <Bold size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Italic">
          <Italic size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Underline">
          <Underline size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Strikethrough">
          <Strikethrough size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Link">
          <Link size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Bullet list">
          <List size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Numbered list">
          <ListOrdered size={14} />
        </button>
        <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-[#f8f8f8]" title="Code block">
          <Code size={14} />
        </button>
      </div>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border min-h-[44px]"
        style={{ borderColor: "#e8e8e8", backgroundColor: "#f8f8f8" }}
      >
        <input
          type="text"
          placeholder={ph}
          readOnly
          className="flex-1 min-w-0 bg-transparent text-[15px] placeholder:text-[#616061] focus:outline-none"
        />
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-white/80" title="Add">
            <Plus size={16} />
          </button>
          <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-white/80" title="Format">
            <Type size={16} />
          </button>
          <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-white/80" title="Emoji">
            <Smile size={16} />
          </button>
          <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-white/80" title="Mention">
            <AtSign size={16} />
          </button>
          <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-white/80" title="Attachment">
            <Paperclip size={16} />
          </button>
          <button type="button" className="p-1.5 rounded text-[#1264a3] hover:bg-white/80" title="Send">
            <Send size={16} />
          </button>
          <button type="button" className="p-1.5 rounded text-[#616061] hover:bg-white/80" title="More">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
