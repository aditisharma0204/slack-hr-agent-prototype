"use client";

import { useState, FormEvent, useRef } from "react";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

interface MessageInputProps {
  placeholder?: string;
  onSubmit?: (message: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export function MessageInput({ 
  placeholder = "Message #general", 
  onSubmit,
  value: controlledValue,
  onChange: controlledOnChange
}: MessageInputProps) {
  const [internalInput, setInternalInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use controlled value if provided, otherwise use internal state
  const input = controlledValue !== undefined ? controlledValue : internalInput;
  const setInput = controlledOnChange || setInternalInput;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit?.(input);
      if (controlledValue === undefined) {
        // Only clear if using internal state
        setInput("");
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    // Dispatch hide-dock event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("hide-dock"));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    // Dispatch show-dock event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("show-dock"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 w-full pointer-events-auto" style={{ paddingBottom: "2px" }} onClick={(e) => e.stopPropagation()}>
      <div
        className="bg-white border border-solid rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] overflow-hidden w-full pointer-events-auto"
        style={{ borderColor: "rgba(94,93,96,0.45)", pointerEvents: "auto" }}
        onClick={(e) => {
          e.stopPropagation();
          // Focus the textarea when clicking anywhere in the input box
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
      >
        {/* Top Formatting Toolbar - Hidden on narrow screens */}
        <div className="hidden sm:flex items-center gap-0.5 px-3 py-2 border-b" style={{ borderColor: "rgba(94,93,96,0.13)" }}>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Bold">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 2h5c1.66 0 3 1.34 3 3s-1.34 3-3 3H4V2zm0 6h6c1.66 0 3 1.34 3 3s-1.34 3-3 3H4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Italic">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M6 2h6M4 14h6M9 2l-3 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Underline">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 2v5c0 2.21 1.79 4 4 4s4-1.79 4-4V2M2 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Strikethrough">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M5 12c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2M5 4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Link">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 9.5l3-3m-2 5l1.5 1.5c1.1 1.1 2.9 1.1 4 0 1.1-1.1 1.1-2.9 0-4L11.5 7.5M4.5 8.5L3 10c-1.1 1.1-1.1 2.9 0 4 1.1 1.1 2.9 1.1 4 0l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Bullet list">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <circle cx="3" cy="4" r="0.8" fill="currentColor" />
              <circle cx="3" cy="8" r="0.8" fill="currentColor" />
              <circle cx="3" cy="12" r="0.8" fill="currentColor" />
              <path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Numbered list">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M6 4h8M6 8h8M6 12h8M2 3h1v3M3 6H2M2.5 9h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1M2.5 10h1c.3 0 .5.2.5.5s-.2.5-.5.5H2v1h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Indent">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 3h12M6 7h8M6 11h8M2 15h12M2 7l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: "#ccc" }} title="Code block">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M10 4l2 4-2 4M6 4L4 8l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Input Field */}
        <div className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              const newValue = e.target.value;
              setInput(newValue);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={(e) => {
              e.stopPropagation();
              // Ensure focus triggers onFocus event
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.focus();
              }
            }}
            placeholder={placeholder}
            rows={1}
            tabIndex={0}
            autoFocus={false}
            className="w-full bg-transparent border-none outline-none text-[15px] resize-none overflow-hidden pointer-events-auto focus:outline-none"
            style={{
              fontFamily: T.typography.fontFamily,
              lineHeight: "22px",
              color: T.colors.text,
              minHeight: "22px",
              maxHeight: "200px",
              pointerEvents: "auto",
              cursor: "text",
              WebkitUserSelect: "text",
              userSelect: "text",
            }}
            onInput={(e) => {
              // Auto-resize textarea
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              // Submit on Enter (but allow Shift+Enter for new line)
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  onSubmit?.(input);
                  if (controlledValue === undefined) {
                    setInput("");
                  }
                  // Reset textarea height
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                }
              }
            }}
          />
        </div>

        {/* Bottom Action Bar — right actions shrink-0 so send button is never clipped in narrow panels */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 min-w-0">
          {/* Left actions — can shrink in narrow panels */}
          <div className="flex items-center gap-1 min-w-0 shrink">
            <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: "#616061" }} title="Add">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 5v10M5 10h10" />
              </svg>
            </button>
            <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: "#616061" }} title="Format">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 15h5M6.5 6v9m7-9v9m-1.5 0h3M11 6h5" />
              </svg>
            </button>
            <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: "#616061" }} title="Emoji">
              <svg className="size-5" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 12c.5 1 1.5 2 3 2s2.5-1 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="8" r="1" fill="currentColor" />
                <circle cx="13" cy="8" r="1" fill="currentColor" />
              </svg>
            </button>
            <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: "#616061" }} title="Mention">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7h4" />
              </svg>
            </button>
          </div>

          {/* Right actions — never shrink so send + more are always visible */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button type="submit" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: "#616061" }} title="Send">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2L9 11M18 2l-7 16-2-7-7-2 16-7z" />
              </svg>
            </button>
            <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: "#616061" }} title="More">
              <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8l4 4 4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
