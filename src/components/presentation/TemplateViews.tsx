"use client";

import { useState } from "react";
import { UniversalChatSurface } from "@/components/shared/UniversalChatSurface";
import { ChatMessage } from "@/components/shared/ChatMessage";
import { ChevronRight, Search, Star, MoreVertical, ChevronDown } from "lucide-react";
import { assetPath } from "@/lib/asset-path";

// ─── Shared Chat Messages ────────────────────────────────────────────────────

type Msg = { name: string; avatar: string; time: string; text: string };

const AVATARS = {
  sarah: "https://randomuser.me/api/portraits/med/women/44.jpg",
  rita: "https://randomuser.me/api/portraits/med/women/75.jpg",
  jordan: "https://randomuser.me/api/portraits/med/men/22.jpg",
  priya: "https://randomuser.me/api/portraits/med/women/68.jpg",
  daniel: "https://randomuser.me/api/portraits/med/men/32.jpg",
  dana: "https://randomuser.me/api/portraits/med/women/28.jpg",
  marcus: "https://randomuser.me/api/portraits/med/men/8.jpg",
  lisa: "https://randomuser.me/api/portraits/med/women/65.jpg",
  mike: "https://randomuser.me/api/portraits/med/men/45.jpg",
  bot: assetPath("/slackbot-logo.svg"),
};

const CHANNEL_MESSAGES: Record<string, Msg[]> = {
  "#general": [
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "9:15 AM", text: "Good morning team! Quick reminder — Q1 pipeline review is at 2pm today. Please have your numbers ready." },
    { name: "Rita Patel", avatar: AVATARS.rita, time: "9:20 AM", text: "Runners Club deal is back on track. The ROI deck worked — CFO is reviewing final terms now." },
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "9:25 AM", text: "Anyone need POC support this week? I have a few slots open if there's anything blocking." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "9:40 AM", text: "Just wrapped the Greentech legal review. All terms cleared — we can move to signature. 🎉" },
    { name: "Daniel Kim", avatar: AVATARS.daniel, time: "10:05 AM", text: "Shared the updated forecast spreadsheet in #q3-pipeline. Numbers look solid." },
  ],
  "#deal-acme": [
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "Yesterday", text: "Priya, can you confirm whether the MSA redlines from Acme legal have been addressed? We need to close this loop before the board meeting." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "Yesterday", text: "Yes — legal cleared all the redlines. I sent the final version to Daniel Kim's team this morning. Waiting on their counter-sign." },
    { name: "Rita Patel", avatar: AVATARS.rita, time: "10:20 AM", text: "Just got off a call with Daniel. He's aligned but wants to loop in procurement for final budget approval. Should have an answer by EOD." },
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "10:45 AM", text: "I can prep the technical architecture overview they requested. Will share it here by 2pm." },
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "11:00 AM", text: "Perfect. Let's aim to get this across the finish line this week. Rita — keep me posted on procurement." },
  ],
  "#deal-greentech": [
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "Yesterday", text: "Greentech SOW is ready for review. Uploaded the final PDF to the channel files." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "Yesterday", text: "Looks good! I flagged a minor clause in section 4.2 — should be an easy fix." },
    { name: "Rita Patel", avatar: AVATARS.rita, time: "9:00 AM", text: "Updated section 4.2 and sent it back. Legal gave the all-clear. We're good to go." },
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "9:30 AM", text: "Great work everyone. Let's get signatures this week. This puts us at 108% quota for Q1. 🚀" },
  ],
  "#sales": [
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "9:00 AM", text: "Q1 pipeline is looking strong. We're at $1.18M against $500K quota. Let's keep pushing." },
    { name: "Marcus Lee", avatar: AVATARS.marcus, time: "9:15 AM", text: "Sporty Nation has been silent for 14 days. I'm drafting a re-engagement email today." },
    { name: "Rita Patel", avatar: AVATARS.rita, time: "9:45 AM", text: "Runners Club closed! $720K locked in. CFO signed this morning." },
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "10:00 AM", text: "Nice work Rita! I'll update the win/loss board." },
  ],
  "#q3-pipeline": [
    { name: "Daniel Kim", avatar: AVATARS.daniel, time: "Yesterday", text: "Updated the forecast spreadsheet with latest numbers. Pipeline is at $1.18M." },
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "Yesterday", text: "Sporty Nation is the biggest risk. 14 days silent, $270K at stake." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "10:30 AM", text: "Acme is moving — procurement loop is the last step. Should close by EOW." },
  ],
  "#deal-acme-q1-strategic": [
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "Monday", text: "Acme Q1 strategic plan: focus on exec sponsorship path via Priya → Daniel Kim." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "Monday", text: "I have a 1:1 with Daniel's EA next week. Will push for a 30-min exec intro." },
    { name: "Rita Patel", avatar: AVATARS.rita, time: "Tuesday", text: "Volume discount request is on the table — 3yr term, 15% off. Need approval from Sarah." },
  ],
  "#deal-runners": [
    { name: "Rita Patel", avatar: AVATARS.rita, time: "Yesterday", text: "CFO approved final terms! Runners Club is officially closed won — $720K." },
    { name: "Dana Torres", avatar: AVATARS.dana, time: "Yesterday", text: "Amazing news! The ROI deck was the tipping point. Well done team." },
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "Today", text: "Implementation kickoff scheduled for next Monday. Sending calendar invites now." },
  ],
  "#deal-sporty": [
    { name: "Marcus Lee", avatar: AVATARS.marcus, time: "Dec 18", text: "Last update from Chris Park — he mentioned internal budget review. Haven't heard back since." },
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "Dec 22", text: "Three follow-ups sent. No response. We need a Plan B — multi-thread above Chris." },
    { name: "Mike Torres", avatar: AVATARS.mike, time: "Today", text: "I found a connection to their VP Digital through LinkedIn. Want me to reach out?" },
  ],
  "#deal-techstart": [
    { name: "Lisa Park", avatar: AVATARS.lisa, time: "Yesterday", text: "TechStart QBR prep is ready. Slides uploaded to channel files." },
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "Today", text: "Reviewed the deck — looks solid. Added a few slides on product roadmap alignment." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "Today", text: "QBR is Friday 2pm. Let's do a dry run Thursday morning." },
  ],
};

const DM_MESSAGES: Record<string, Msg[]> = {
  "sarah-chen": [
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "9:00 AM", text: "Hey — can we sync on the Acme timeline? I want to make sure we're aligned before the board meeting." },
    { name: "You", avatar: AVATARS.rita, time: "9:05 AM", text: "Sure! I just spoke with Daniel. Procurement is the last step. Should have an answer by EOD." },
    { name: "Sarah Chen", avatar: AVATARS.sarah, time: "9:10 AM", text: "Perfect. Also — keep me posted on Sporty Nation. I want to discuss it in our 1:1." },
  ],
  "priya-shah": [
    { name: "Priya Shah", avatar: AVATARS.priya, time: "Yesterday", text: "MSA redlines are done. Sent final version to Daniel's team. Should hear back tomorrow." },
    { name: "You", avatar: AVATARS.rita, time: "Yesterday", text: "Great work! I'll follow up with procurement on our end." },
    { name: "Priya Shah", avatar: AVATARS.priya, time: "10:00 AM", text: "Daniel's EA confirmed the exec intro for next week. Things are moving!" },
  ],
  "jordan-hayes": [
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "10:30 AM", text: "Tech architecture doc for Acme is ready. Want to review before I share in the channel?" },
    { name: "You", avatar: AVATARS.rita, time: "10:35 AM", text: "Yes please, send it over. I'll review in the next hour." },
    { name: "Jordan Hayes", avatar: AVATARS.jordan, time: "10:40 AM", text: "Sent! Also, I have POC slots open this week if any deals need hands-on support." },
  ],
  "dana-torres": [
    { name: "Dana Torres", avatar: AVATARS.dana, time: "Yesterday", text: "Runners Club implementation team is ready. Can we schedule the kickoff for Monday?" },
    { name: "You", avatar: AVATARS.rita, time: "Yesterday", text: "Monday works! I'll set up the calendar invite. Great job closing this one." },
    { name: "Dana Torres", avatar: AVATARS.dana, time: "Today", text: "Thanks! Also sending over the onboarding checklist for your review." },
  ],
  "marcus-lee": [
    { name: "Marcus Lee", avatar: AVATARS.marcus, time: "11:00 AM", text: "Still no response from Chris Park at Sporty Nation. Should I try the breakup email approach?" },
    { name: "You", avatar: AVATARS.rita, time: "11:05 AM", text: "Let's try multi-threading first. Mike found a LinkedIn connection to their VP Digital." },
    { name: "Marcus Lee", avatar: AVATARS.marcus, time: "11:10 AM", text: "Good idea. I'll coordinate with Mike and draft the outreach today." },
  ],
  "lisa-park": [
    { name: "Lisa Park", avatar: AVATARS.lisa, time: "Yesterday", text: "TechStart QBR slides are uploaded. Can you check the executive summary section?" },
    { name: "You", avatar: AVATARS.rita, time: "Yesterday", text: "Looks good! Added a few notes on the competitive landscape slide." },
    { name: "Lisa Park", avatar: AVATARS.lisa, time: "Today", text: "Perfect. Dry run is Thursday 10am — I'll send the invite." },
  ],
  "daniel-kim": [
    { name: "Daniel Kim", avatar: AVATARS.daniel, time: "10:00 AM", text: "Procurement is reviewing the Acme contract. Should have final sign-off by end of week." },
    { name: "You", avatar: AVATARS.rita, time: "10:05 AM", text: "Thanks Daniel. Is there anything they need from our side to speed this up?" },
    { name: "Daniel Kim", avatar: AVATARS.daniel, time: "10:15 AM", text: "Just the volume discount terms in writing. I'll send the template." },
  ],
  "mike-torres": [
    { name: "Mike Torres", avatar: AVATARS.mike, time: "Today", text: "Found a warm intro to Sporty Nation's VP Digital through a mutual connection." },
    { name: "You", avatar: AVATARS.rita, time: "Today", text: "That's huge! Can you set up a casual intro call this week?" },
    { name: "Mike Torres", avatar: AVATARS.mike, time: "Today", text: "On it. I'll reach out today and loop you in once it's confirmed." },
  ],
};

const AGENT_MESSAGES: Record<string, Msg[]> = {
  "af-employee": [
    { name: "Employee Performance Management Agent", avatar: AVATARS.bot, time: "Just now", text: "Hi! I'm the Employee Performance Management Agent. I can help you find information about company policies, benefits, and perform routine tasks. What can I help you with today?" },
  ],
  "af-support": [
    { name: "Agentforce Support Agent", avatar: AVATARS.bot, time: "Just now", text: "Welcome! I'm the Agentforce Support Agent. I can answer questions about Agentforce features, setup, and best practices. How can I assist you?" },
  ],
  "af-data": [
    { name: "Data Agent", avatar: AVATARS.bot, time: "Just now", text: "Hello! I help users discover and answer questions about data artifacts. Ask me about dashboards, reports, or data models." },
  ],
};

export function resolveChat(itemId: string): { title: string; messages: Msg[] } {
  if (CHANNEL_MESSAGES[`#${itemId}`]) {
    return { title: `#${itemId}`, messages: CHANNEL_MESSAGES[`#${itemId}`] };
  }
  if (DM_MESSAGES[itemId]) {
    const name = itemId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return { title: name, messages: DM_MESSAGES[itemId] };
  }
  if (AGENT_MESSAGES[itemId]) {
    return { title: itemId.replace("af-", "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Agent", messages: AGENT_MESSAGES[itemId] };
  }
  return { title: `#${itemId}`, messages: CHANNEL_MESSAGES["#general"]! };
}

// ─── Reusable Chat Content (sidebar + chat + message input) ──────────────────

interface TemplateChatContentProps {
  channelName?: string;
  activeChatId?: string;
}

export function TemplateChatContent({ channelName, activeChatId }: TemplateChatContentProps) {
  const resolved = activeChatId ? resolveChat(activeChatId) : null;
  const title = resolved?.title ?? channelName ?? "#general";
  const messages = resolved?.messages ?? CHANNEL_MESSAGES[channelName ?? "#general"] ?? CHANNEL_MESSAGES["#general"]!;

  return (
    <UniversalChatSurface
      title={title}
      memberCount={12}
      placeholder={`Message ${title}`}
      onSendMessage={(text) => console.log("Send:", text)}
    >
      {messages.map((msg, i) => (
        <ChatMessage
          key={`${title}-${i}`}
          message={{
            id: `msg-${i}`,
            name: msg.name,
            avatar: msg.avatar,
            time: msg.time,
            text: msg.text,
          }}
        />
      ))}
    </UniversalChatSurface>
  );
}

// ─── Sales View (full-width) ────────────────────────────────────────────────

const PIPELINE_DEALS = [
  { name: "Acme Corp", amount: "$89K", stage: "Negotiation", health: "bg-orange-500", close: "Feb 28" },
  { name: "Greentech Solutions", amount: "$60K", stage: "Proposal", health: "bg-emerald-500", close: "Mar 15" },
  { name: "NovaCorp", amount: "$45K", stage: "Legal Review", health: "bg-amber-500", close: "Jan 31" },
  { name: "Runners Inc", amount: "$720K", stage: "Closed Won", health: "bg-emerald-500", close: "Today" },
  { name: "Sporty Nation", amount: "$270K", stage: "Discovery", health: "bg-red-500", close: "Mar 31" },
];

export function TemplateSalesView() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="flex items-center gap-3">
          <h2 className="text-[17px] font-bold text-gray-900">Sales</h2>
          <span className="text-[13px] text-gray-400">Q1 Pipeline</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[900px] mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Pipeline", value: "$1.18M", sub: "5 active deals" },
              { label: "Quota", value: "$500K", sub: "Q1 Target" },
              { label: "Win Rate", value: "52%", sub: "↑ from 48% Q3" },
            ].map((card) => (
              <div key={card.label} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wide">{card.label}</span>
                <div className="text-[28px] font-bold text-gray-900 mt-1">{card.value}</div>
                <span className="text-[12px] text-gray-400">{card.sub}</span>
              </div>
            ))}
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-4">Active Deals</h3>
          <div className="space-y-2">
            {PIPELINE_DEALS.map((deal) => (
              <div key={deal.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${deal.health}`} />
                  <div>
                    <span className="text-[14px] font-bold text-gray-900">{deal.name}</span>
                    <span className="text-[12px] text-gray-500 ml-2">{deal.stage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="text-[14px] font-bold text-gray-900">{deal.amount}</span>
                  <span className="text-[12px] text-gray-400 w-16">{deal.close}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Files View (full-width, matching Slack "All files") ─────────────────────

const TEMPLATE_CARDS = [
  { title: "Employee Onboarding", desc: "Welcome new people.", color: "bg-blue-50", accent: "border-blue-200" },
  { title: "Project tracker", desc: "Manage and monitor tasks as a team", color: "bg-orange-50", accent: "border-orange-200" },
  { title: "Monthly Newsletter", desc: "Broadcast your announcements.", color: "bg-yellow-50", accent: "border-yellow-200" },
  { title: "Feedback tracker", desc: "A streamlined approach to feedback.", color: "bg-purple-50", accent: "border-purple-200" },
];

const FILE_LIST = [
  { name: "Today Feature Overview", author: "Maya Holikatti", date: "Last viewed on February 26th", read: "1 min read", starred: false },
  { name: "Sales Cloud UX Pattern Group V2MOM", author: "Chris Fox", date: "Last viewed on February 26th", read: "3 min read", starred: false },
  { name: "Welcome to #broadcast-the-daily", author: "Slackbot", date: "Last viewed on February 20th", read: "4 min read", starred: false },
  { name: "AI Coding Tools: How to Stretch Your Budget", author: "Nicolas Arkhipenko", date: "Last viewed on February 16th", read: "18 min read", starred: false },
  { name: "Exp. Org Guidelines for Prototyping", author: "Cliff Seal", date: "Last viewed on February 11th", read: "5 min read", starred: true },
  { name: "2nd Brain Program overview", author: "Shir Zalzberg", date: "Last viewed on February 11th", read: "5 min read", starred: false },
  { name: "2nd brain — Goal & Weekly Tracker", author: "Shir Zalzberg", date: "Last viewed on February 11th", read: "1 min read", starred: false },
  { name: "UI Explorations Exec Review", author: "Mike Lenz", date: "Last viewed on February 6th", read: "", starred: false },
  { name: "Frame and Resolution Guidelines", author: "Justin Carter", date: "Last viewed on February 4th", read: "1 min read", starred: false },
];

export function TemplateFilesView() {
  const [activeTab, setActiveTab] = useState("all");
  const [showTemplates, setShowTemplates] = useState(true);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-gray-900">All files</h1>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007a5a] text-white text-[13px] font-bold rounded-lg hover:bg-[#006a4e] transition-colors">
              + New
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:shadow-[0_0_0_1px_#1d9bd1]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Search files" className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          {/* Templates section */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 text-[14px] font-bold text-gray-900 mb-3 hover:text-gray-700"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? "" : "-rotate-90"}`} />
            Templates
          </button>
          {showTemplates && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {TEMPLATE_CARDS.map((t) => (
                <div key={t.title} className={`min-w-[200px] max-w-[200px] ${t.color} border ${t.accent} rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow shrink-0`}>
                  <div className="h-[80px] mb-3 rounded-lg bg-white/60 border border-white/80" />
                  <p className="text-[13px] font-bold text-gray-900">{t.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "All" },
                { id: "created", label: "Created by you" },
                { id: "shared", label: "Shared with you" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-full border transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#1d9bd1] text-white border-[#1d9bd1]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                5 Types <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Recently viewed <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* File list */}
          <div className="divide-y divide-gray-100">
            {FILE_LIST.map((file) => (
              <div key={file.name} className="flex items-center py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg cursor-pointer transition-colors group">
                <div className="w-5 h-5 rounded-full bg-purple-100 shrink-0 mr-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900 truncate">{file.name}</p>
                  <p className="text-[12px] text-gray-500">{file.author} · {file.date}{file.read ? ` · ${file.read}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {file.starred ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <MoreVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Agentforce Content (sidebar + agent grid, matching Slack Agentforce) ────

const AGENT_CARDS = [
  { name: "Agentforce Support Agent", org: "Salesforce EPIC360", desc: "Help users answer all the questions related to Agentforce", color: "bg-blue-600", prompts: ["What is Agentforce and how does it work?", "Can you help me understand the features ..."] },
  { name: "Badgeforce Agent", org: "SFDC Corporate Security", desc: "I'm your AI Badgeforce Agent! I'm here to help with your access control questions.", color: "bg-cyan-600", prompts: [] },
  { name: "Central Performance Productio...", org: "Salesforce EPIC360", desc: "Central Performance Production AEA is managed by Central Performance Production Team.", color: "bg-teal-600", prompts: [] },
  { name: "CKO Agent", org: "Salesforce", desc: "FY27 Company Kickoff has wrapped, but you can still share feedback through the surveys.", color: "bg-indigo-600", prompts: [] },
  { name: "Data Agent", org: "OrgEmp", desc: "Hello! I help users discover and answer questions about data artifacts created and maintained by the Data and Analytics team.", color: "bg-purple-600", prompts: ["What prompts does Data Agent support?", "What are the usage statistics for the ACT ..."] },
  { name: "Data Modeling Agent", org: "Salesforce EPIC360", desc: "Helps you discover entities across Salesforce data models (Core or Data Cloud objects).", color: "bg-violet-600", prompts: [] },
  { name: "Employee Performance Management Agent", org: "OrgEmp", desc: "Employee Performance Management Agent is an AI Agent that helps you find information and perform routine tasks.", color: "bg-sky-500", prompts: [] },
  { name: "EPIC Analytics Agent", org: "Salesforce EPIC360", desc: "Help people see and understand data with conversational analytics.", color: "bg-blue-500", prompts: [] },
  { name: "EPIC OrgFarm Agent", org: "Salesforce EPIC360", desc: "Everything you need about and around #OrgFarm", color: "bg-slate-600", prompts: [] },
];

export function TemplateAgentforceContent() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <h1 className="text-[20px] font-bold text-gray-900">All agents</h1>
        <button className="px-3 py-1.5 text-[13px] border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          Give feedback
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">
              Assemble your <span className="text-purple-600">Agentforce</span> team
            </h2>
            <p className="text-[14px] text-gray-500 max-w-[500px] mx-auto leading-relaxed">
              You're already one impressive human. Together with AI agents, you'll be a force to be
              reckoned with. Browse agents that take the grunt work out of your day, and the guesswork
              out of decisions.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl focus-within:border-purple-400 focus-within:shadow-[0_0_0_1px_#a78bfa]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Search agents" className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>

          {/* Browse header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-bold text-gray-900">Browse AI agents</h3>
            <button className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900">
              All Salesforce Orgs <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Agent grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENT_CARDS.map((agent) => (
              <div key={agent.name} className="border border-gray-200 rounded-xl p-4 hover:shadow-md cursor-pointer transition-all hover:border-gray-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center shrink-0`}>
                    <img src={assetPath("/slackbot-logo.svg")} alt="" className="w-5 h-5 opacity-90" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-gray-900 truncate">{agent.name}</p>
                    <p className="text-[11px] text-gray-500">{agent.org}</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3 line-clamp-2">{agent.desc}</p>
                {agent.prompts.length > 0 && (
                  <div className="space-y-1.5">
                    {agent.prompts.map((prompt) => (
                      <div key={prompt} className="text-[12px] text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5 truncate cursor-pointer hover:bg-purple-100 transition-colors">
                        {prompt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── More View (content pane — sidebar shows channel+DM list) ───────────────

export function TemplateMoreView() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <h2 className="text-[15px] font-bold text-gray-900">More</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-5 space-y-3">
          {[
            { icon: "🔧", title: "Tools", desc: "Create and find workflows and apps" },
            { icon: "📊", title: "Analytics", desc: "View workspace analytics and reports" },
            { icon: "👥", title: "People & User Groups", desc: "Browse team members and groups" },
            { icon: "🔔", title: "Notifications", desc: "Manage notification preferences" },
            { icon: "⚙️", title: "Preferences", desc: "Customize your Slack experience" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-gray-900">{item.title}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
