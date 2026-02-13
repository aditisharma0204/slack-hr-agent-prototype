"use client";

import React from "react";

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: Array<{ type: string; text: string }>;
  elements?: Array<{
    type: string;
    text: { type: string; text: string; emoji?: boolean };
    action_id?: string;
    style?: string;
    value?: string;
  }>;
  accessory?: {
    type: string;
    text: { type: string; text: string };
    action_id?: string;
    style?: string;
  };
}

function renderMrkdwn(text: string) {
  return text
    .split(/(\*[^*]+\*|`[^`]+`|_([^_]+)_)/g)
    .map((part, i) => {
      if (part?.startsWith("*") && part?.endsWith("*")) {
        return <strong key={i}>{part.slice(1, -1)}</strong>;
      }
      if (part?.startsWith("`") && part?.endsWith("`")) {
        return <code key={i} className="bg-gray-100 px-1 rounded text-sm">{part.slice(1, -1)}</code>;
      }
      return part;
    });
}

function renderTextObject(obj: { type: string; text: string }) {
  if (obj.type === "mrkdwn") {
    return <span className="text-[15px] leading-[1.46668] text-[#1d1c1d]">{renderMrkdwn(obj.text)}</span>;
  }
  return <span className="text-[15px] leading-[1.46668] text-[#1d1c1d]">{obj.text}</span>;
}

function Block({ block, onAction }: { block: SlackBlock; onAction?: (actionId: string) => void }) {
  switch (block.type) {
    case "header": {
      const text = block.text?.text ?? "";
      return (
        <div className="text-[15px] font-bold text-[#1d1c1d] mb-2 mt-3 first:mt-0">
          {text}
        </div>
      );
    }
    case "section": {
      const content: React.ReactNode[] = [];
      if (block.fields) {
        content.push(
          <div key="fields" className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
            {block.fields.map((f, i) => (
              <div key={i} className="text-[15px] leading-[1.46668] text-[#1d1c1d]">
                {f.type === "mrkdwn" ? renderMrkdwn(f.text) : f.text}
              </div>
            ))}
          </div>
        );
      }
      if (block.text) {
        content.push(
          <div key="text" className="text-[15px] leading-[1.46668] text-[#1d1c1d] mb-2">
            {block.text.type === "mrkdwn" ? renderMrkdwn(block.text.text) : block.text.text}
          </div>
        );
      }
      return <div className="mb-2">{content}</div>;
    }
    case "divider":
      return <hr className="my-3 border-t border-[#e8e8e8]" />;
    case "actions": {
      if (!block.elements) return null;
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {block.elements.map((el, i) => {
            if (el.type !== "button") return null;
            const label = el.text?.text ?? "";
            const isPrimary = el.style === "primary";
            return (
              <button
                key={i}
                type="button"
                onClick={() => el.action_id && onAction?.(el.action_id)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  isPrimary
                    ? "bg-[#2eb886] text-white hover:bg-[#269873]"
                    : "bg-white border border-[#e8e8e8] text-[#1d1c1d] hover:bg-[#f8f8f8]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      );
    }
    case "context": {
      if (!block.elements) return null;
      return (
        <div className="flex flex-wrap gap-2 mt-2 text-[13px] text-[#616061]">
          {block.elements.map((el, i) => (
            <span key={i}>{el.text?.text ?? ""}</span>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

interface BlockKitRendererProps {
  blocks: SlackBlock[];
  onAction?: (actionId: string) => void;
  className?: string;
}

export function BlockKitRenderer({ blocks, onAction, className = "" }: BlockKitRendererProps) {
  if (!blocks?.length) return null;
  return (
    <div className={`block-kit-renderer ${className}`}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} onAction={onAction} />
      ))}
    </div>
  );
}
