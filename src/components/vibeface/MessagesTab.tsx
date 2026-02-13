"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESET_QUERIES = [
  "Tell me about Global Industries",
  "What would it take to close the gap?",
  "What's my risk today?",
  "Prep me for my TechStart meeting",
  "What follow-ups are overdue?",
];

const RESPONSES: Record<string, string> = {
  "Tell me about Global Industries":
    "**Global Industries — Enterprise Platform** ($180K, Negotiation)\n\nChampion Marcus Lee has been silent for 12 days. No exec sponsor identified. Risk: deal may be cooling. I recommend reaching out to Marcus this week to re-engage.",
  "What would it take to close the gap?":
    "Your gap is about $820K. To close it in 45 days you'd need roughly $1.2M more in qualified pipeline and ~8 meetings/week. Focus on: (1) re-engaging Global Industries, (2) accelerating TechStart QBR, (3) adding 2–3 new discovery meetings.",
  "What's my risk today?":
    "**Deal at risk:** Global Industries ($180K) — champion silent 12 days, no exec sponsor. **Meeting prep:** TechStart QBR at 2:00 PM — brief ready. **Overdue:** 3 follow-ups; oldest 9 days.",
  "Prep me for my TechStart meeting":
    "**TechStart QBR — 2:00 PM today**\n\n• Sarah Chen (champion) is active; last touch 3 days ago.\n• Deal: $95K, Proposal stage, Commit forecast.\n• Talking points: QBR recap, expansion options, timeline to close.\n• I've drafted a brief — want me to surface it?",
  "What follow-ups are overdue?":
    "You have **3 overdue follow-ups**; oldest 9 days. I can draft a batch so you stay on top. Meridian Corp (James Rivera) and Greentech (Sarah Chen) are good candidates — both have had 7–8 days since last touch.",
};

function getBotResponse(query: string): string {
  const normalized = query.trim();
  for (const [key, value] of Object.entries(RESPONSES)) {
    if (normalized.toLowerCase().includes(key.toLowerCase().slice(0, 20))) return value;
  }
  return "I can help with: deal summaries, gap analysis, meeting prep, and follow-up drafts. Try one of the suggested questions or ask about a specific opportunity.";
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function MessagesTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(trimmed);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-2 min-h-0">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Ask me anything about your pipeline, meetings, or follow-ups.</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto py-2 px-3 whitespace-normal"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-lg p-3 text-sm",
              m.role === "user"
                ? "bg-primary/10 ml-4"
                : "bg-muted/50 mr-4"
            )}
          >
            <div className="font-medium text-xs text-muted-foreground mb-1">
              {m.role === "user" ? "You" : "Vibeface"}
            </div>
            <div className="whitespace-pre-wrap [&_strong]:font-semibold">
              {m.content.split("**").map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="rounded-lg p-3 bg-muted/50 mr-4 text-sm text-muted-foreground">
            Vibeface is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Reply..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
