"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { BlockKitRenderer, type SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import { DemoMessageInput } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageInput";

interface Scene1SlackFeedProps {
  activeScenario: "conservative" | "quota" | "stretch";
  isApproved: boolean;
}

export function Scene1SlackFeed({ activeScenario, isApproved }: Scene1SlackFeedProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scenario data
  const scenarioData = {
    conservative: { commit: "Conservative" },
    quota: { commit: "Quota" },
    stretch: { commit: "Stretch" },
  };

  const currentScenario = scenarioData[activeScenario];

  // Initial proactive message blocks
  const initialMessageBlocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Good morning Rita. A new quarter starts today. I pulled your $500K quota from Capacity Planning and analyzed your historical velocity and active Deal Agents. I've modeled three paths for Q3 based on your closing style. Adjust the slider on the right to set your ambition.",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "↳ *Inherited Pipeline:*\n$1.2M" },
        { type: "mrkdwn", text: "↳ *Historical Win Rate:*\n24%" },
        { type: "mrkdwn", text: "↳ *Deal Agent Coverage:*\nActive on 14 accounts" },
      ],
    },
  ];

  // Post-approval message blocks
  const approvalMessageBlocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Plan approved. I've synced your ${currentScenario.commit.toLowerCase()} commit to Salesforce and alerted your manager. I am spinning up background tasks to build the required pipeline gap. Let's crush Q3.`,
      },
    },
  ];

  // Auto-scroll when approval message appears
  useEffect(() => {
    if (isApproved) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isApproved]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        {/* Initial proactive message */}
        <div className="mb-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <BlockKitRenderer blocks={initialMessageBlocks} />
              </div>
            </div>
          </div>
        </div>

        {/* Post-approval message (appears when approved) */}
        {isApproved && (
          <div className="mb-4 animate-fade-in">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <BlockKitRenderer blocks={approvalMessageBlocks} />
              </div>
            </div>
          </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="shrink-0 border-t bg-white" style={{ borderColor: "#e8e8e8" }}>
        <DemoMessageInput channelId="slackbot" placeholder="Reply..." />
      </div>
    </div>
  );
}
