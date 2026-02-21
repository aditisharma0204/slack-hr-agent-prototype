"use client";

import React from "react";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { IconLayoutGrid, IconInfo, IconBell, IconClock } from "@/components/icons";

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

const T = SLACK_TOKENS;

function renderTextObject(obj: { type: string; text: string }) {
  if (obj.type === "mrkdwn") {
    return (
      <span
        className="text-[15px]"
        style={{ color: T.colors.text, lineHeight: T.typography.bodyLineHeight }}
      >
        {renderMrkdwn(obj.text)}
      </span>
    );
  }
  return (
    <span
      className="text-[15px]"
      style={{ color: T.colors.text, lineHeight: T.typography.bodyLineHeight }}
    >
      {obj.text}
    </span>
  );
}

function Block({ block, onAction }: { block: SlackBlock; onAction?: (actionId: string) => void }) {
  switch (block.type) {
    case "header": {
      const text = block.text?.text ?? "";
      return (
        <div
          className="text-[15px] font-bold mb-2 mt-3 first:mt-0"
          style={{ color: T.colors.text }}
        >
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
              <div
                key={i}
                className="text-[15px]"
                style={{ color: T.colors.text, lineHeight: T.typography.bodyLineHeight }}
              >
                {f.type === "mrkdwn" ? renderMrkdwn(f.text) : f.text}
              </div>
            ))}
          </div>
        );
      }
      if (block.text) {
        const text = block.text.type === "mrkdwn" ? renderMrkdwn(block.text.text) : block.text.text;
        // Check if this is the warning message (contains ⚠️)
        const isWarning = typeof block.text.text === 'string' && block.text.text.includes('⚠️');
        content.push(
          <div
            key="text"
            className={`text-[15px] mb-2 ${isWarning ? 'bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg' : ''}`}
            style={{ 
              color: isWarning ? '#92400e' : T.colors.text, 
              lineHeight: T.typography.bodyLineHeight 
            }}
          >
            {text}
          </div>
        );
      }
      return <div className="mb-2">{content}</div>;
    }
    case "divider":
      return <hr className="my-3 border-t" style={{ borderColor: T.colors.border }} />;
    case "actions": {
      if (!block.elements) return null;
      
      // Icon mapping for buttons
      const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
        plan_q1: IconLayoutGrid,
        reflect_q4: IconInfo,
        review_risk: IconBell,
        today_plate: IconClock,
      };
      
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {block.elements.map((el, i) => {
            if (el.type !== "button") return null;
            const label = el.text?.text ?? "";
            // Remove emoji from label if present
            const cleanLabel = label.replace(/^[\u{1F300}-\u{1F9FF}]+\s*/u, '').trim();
            const IconComponent = el.action_id ? iconMap[el.action_id] : null;
            
            return (
              <button
                key={i}
                type="button"
                onClick={() => el.action_id && onAction?.(el.action_id)}
                className="px-4 py-2 text-sm font-medium bg-white border hover:bg-[#f8f8f8] flex items-center gap-2"
                style={{
                  borderRadius: `${T.radius.button}px`,
                  borderColor: T.colors.border,
                  color: T.colors.text,
                }}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {cleanLabel}
              </button>
            );
          })}
        </div>
      );
    }
    case "context": {
      if (!block.elements) return null;
      return (
        <div
          className="flex flex-wrap gap-2 mt-2 text-[13px]"
          style={{ color: T.colors.textSecondary }}
        >
          {block.elements.map((el, i) => (
            <span key={i}>{el.type === "mrkdwn" ? renderMrkdwn(el.text) : el.text?.text ?? ""}</span>
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
