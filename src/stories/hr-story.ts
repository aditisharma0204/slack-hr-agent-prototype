import type {
  StoryConfig,
  DemoChannel,
  DemoDM,
  DemoFile,
  DemoSavedItem,
  DemoActivityPost,
} from "@/context/DemoDataContext";
import { mockDMs, mockChannels, mockActivity } from "@/lib/mock-data";

const channels: DemoChannel[] = [
  { id: "general", name: "general", unread: true },
  { id: "sales", name: "sales", unread: true },
  { id: "q3-pipeline", name: "q3-pipeline", unread: true },
  { id: "deal-acme", name: "deal-acme", unread: true },
  { id: "deal-acme-q1-strategic", name: "deal-acme-q1-strategic", unread: true },
  { id: "deal-runners", name: "deal-runners" },
  { id: "deal-greentech", name: "deal-greentech" },
  { id: "deal-sporty", name: "deal-sporty" },
  { id: "deal-techstart", name: "deal-techstart" },
];

const dms: DemoDM[] = [
  { id: "slackbot", name: "Slackbot", isSlackbot: true, unread: true },
  { id: "aisha-raman", name: "Aisha Raman", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/21.jpg", unread: true },
  { id: "noah-kim", name: "Noah Kim", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/men/47.jpg" },
  { id: "caleb-stone", name: "Caleb Stone", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/men/46.jpg", unread: true },
  { id: "sarah-chen", name: "Sarah Chen", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg", unread: true },
  { id: "priya-shah", name: "Priya Shah", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/women/32.jpg" },
  { id: "jordan-hayes", name: "Jordan Hayes", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/men/22.jpg", unread: true },
  { id: "dana-torres", name: "Dana Torres", status: "dnd", avatarUrl: "https://randomuser.me/api/portraits/med/women/28.jpg" },
  { id: "marcus-lee", name: "Marcus Lee", status: "call", avatarUrl: "https://randomuser.me/api/portraits/med/men/8.jpg", unread: true },
  { id: "lisa-park", name: "Lisa Park", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/65.jpg" },
  { id: "daniel-kim", name: "Daniel Kim", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/men/33.jpg" },
  { id: "mike-torres", name: "Mike Torres", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/men/45.jpg" },
];

const files: DemoFile[] = [
  { id: "f1", name: "Q3 Pipeline Deck.pdf", channelId: "q3-pipeline", timestamp: "Yesterday" },
  { id: "f2", name: "Greentech SOW Draft.docx", channelId: "deal-greentech", timestamp: "Yesterday" },
  { id: "f3", name: "TechStart QBR Slides.pptx", channelId: "deal-techstart", timestamp: "Today" },
  { id: "f4", name: "Runners Club Value Justification.pdf", channelId: "deal-runners", timestamp: "Today" },
  { id: "f5", name: "Acme Org Chart & Champions.docx", channelId: "deal-acme", timestamp: "Today" },
];

const savedItems: DemoSavedItem[] = [
  { id: "s1", channelId: "general", preview: "Champion departed: Acme Corp — Marcus left...", timestamp: "10:36 AM" },
  { id: "s2", channelId: "sales", preview: "Meeting prep ready for TechStart QBR at 2:00 PM", timestamp: "9:16 AM" },
  { id: "s3", channelId: "slackbot", preview: "Proactive insights for today — $410K on track", timestamp: "Today" },
];

const messageAvatarMap: Record<string, string> = {
  "Rita Patel": "https://randomuser.me/api/portraits/med/women/75.jpg",
  Slackbot: "/slackbot-logo.svg",
  "Sarah Chen": "https://randomuser.me/api/portraits/med/women/44.jpg",
  "Priya Shah": "https://randomuser.me/api/portraits/med/women/32.jpg",
  "Jordan Hayes": "https://randomuser.me/api/portraits/med/men/22.jpg",
  "Dana Torres": "https://randomuser.me/api/portraits/med/women/28.jpg",
  "Marcus Lee": "https://randomuser.me/api/portraits/med/men/8.jpg",
  "Lisa Park": "https://randomuser.me/api/portraits/med/women/65.jpg",
  "Daniel Kim": "https://randomuser.me/api/portraits/med/men/33.jpg",
  "Mike Torres": "https://randomuser.me/api/portraits/med/men/45.jpg",
  "Jen Walsh": "https://randomuser.me/api/portraits/med/women/52.jpg",
  "Srinivas Tallapragada": "https://randomuser.me/api/portraits/med/men/33.jpg",
  "Jack Lakkapragada": "https://randomuser.me/api/portraits/med/men/45.jpg",
  "Mike Lenz": "https://randomuser.me/api/portraits/med/men/46.jpg",
  "Aisha Raman": "https://randomuser.me/api/portraits/med/women/21.jpg",
  "Noah Kim": "https://randomuser.me/api/portraits/med/men/47.jpg",
  "Caleb Stone": "https://randomuser.me/api/portraits/med/men/46.jpg",
};

const channelPreviews: Record<string, { preview: string; timestamp: string }> = {
  general: {
    preview: "Champion departed: Acme Corp — Marcus left last week. New contacts: Priya Shah (champion) and Daniel Kim (VP Procurement). $200K deal at risk.",
    timestamp: "10:36 AM",
  },
  sales: {
    preview: "Q4 wrap-up: Greentech closed at $60K. SmartFit replied to follow-up — positive tone. Vibeface prepping demo deck for Q1.",
    timestamp: "9:45 AM",
  },
  "q3-pipeline": {
    preview: "Plan status: *$430K on track* after Greentech SO closed. Q4 velocity analysis shows 52% win rate (up from 48% Q3).",
    timestamp: "Yesterday",
  },
  "deal-acme": {
    preview: "Q4 engagement: Sent intro to Priya via Sarah after Marcus departure. Daniel Kim (VP Procurement) — can we pull the contract forward to Q1?",
    timestamp: "Today",
  },
  "deal-runners": {
    preview: "Q4 follow-up: 30-min call with Jordan set for 4 PM. Budget objection flagged — Vibeface prepping value justification deck.",
    timestamp: "10:15 AM",
  },
  "deal-greentech": {
    preview: "Q4 closed won: Following up with Priya on renewal SOW. She's been responsive. $60K deal closed in December — celebrating win.",
    timestamp: "Today",
  },
  "deal-sporty": {
    preview: "Q4 at risk: Reaching out to Mike Torres. Dana's team might be in flux after Q4 reorg. Champion silent since mid-December.",
    timestamp: "Today",
  },
  "deal-techstart": {
    preview: "Q4 prep: Reviewed the QBR brief. Ready for the call at 2 PM. Pipeline shows $42K opportunity — needs acceleration.",
    timestamp: "9:30 AM",
  },
};

const dmPreviews: Record<string, { preview: string; timestamp: string }> = {
  slackbot: {
    preview: "Q4 performance summary: $471K attained (94% of $500K quota). Win rate 52% ↑ from Q3. Proactive insights for Q1 — $410K on track.",
    timestamp: "Today",
  },
  "aisha-raman": {
    preview: "Reviewed your Q1 planning deck. Looks strong — added 3 comments in the notes for the Acme risk section.",
    timestamp: "Today",
  },
  "noah-kim": {
    preview: "Can jump on a quick sync this afternoon if you want to pressure-test the value justification narrative.",
    timestamp: "Today",
  },
  "caleb-stone": {
    preview: "Updated the pipeline snapshot with latest numbers. Sporty and Acme are now flagged as top risks for this week.",
    timestamp: "Today",
  },
  "sarah-chen": {
    preview: "Q4 wrap-up: Done. Priya should have the intro email. Good luck with Acme — that's a big one for Q1.",
    timestamp: "Yesterday",
  },
  "priya-shah": {
    preview: "Q4 engagement: Thanks Priya! Let me know if legal has any questions on the SOW. Excited to work together in Q1.",
    timestamp: "10:20 AM",
  },
  "jordan-hayes": {
    preview: "Q4 follow-up: 4 PM works perfectly. Send the deck when you have it. Budget discussion is top priority for our call.",
    timestamp: "Today",
  },
  "dana-torres": {
    preview: "Q4 check-in: Following up on Runners Club deal. Let me know if there's a good time to discuss the budget objection.",
    timestamp: "3 days ago",
  },
  "marcus-lee": {
    preview: "Q4 farewell: Thanks Marcus! Appreciate your help on Acme before you left. Best of luck in your new role.",
    timestamp: "1 week ago",
  },
  "lisa-park": {
    preview: "Q4 prep: Sounds good. He's detail-oriented but responsive. TechStart QBR should go well — we're prepared.",
    timestamp: "Today",
  },
  "daniel-kim": {
    preview: "Q4 intro: Sent intro to Priya via Sarah. Daniel Kim — can we pull the contract forward? Q1 pipeline needs this.",
    timestamp: "Today",
  },
  "mike-torres": {
    preview: "Q4 at-risk: Reaching out to Mike Torres. Dana's team might be in flux after the Q4 reorg. Champion has been silent.",
    timestamp: "Today",
  },
};

export const hrStoryConfig: StoryConfig = {
  id: "hr",
  title: "HR Employee Performance Management",
  userName: "Rita",
  workspaceName: "Vibeface",
  channels,
  dms,
  files,
  savedItems,
  activityPosts: mockActivity,
  channelPreviews,
  dmPreviews,
  messageAvatarMap,
  mockMessages: { ...mockDMs, ...mockChannels },
  agentforceAgents: [
    { id: "af-employee", name: "Employee Performance Management Agent" },
    { id: "af-support", name: "Agentforce Support Agent" },
    { id: "af-data", name: "Data Agent" },
  ],
};
