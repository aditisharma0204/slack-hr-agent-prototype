import type { StoryConfig } from "@/context/DemoDataContext";

export const cornerstoneStoryConfig: StoryConfig = {
  id: "cornerstone",
  title: "Cornerstone OnDemand",
  userName: "Rita",
  workspaceName: "Vibeface",
  channels: [
    { id: "general", name: "general" },
    { id: "learning-dev", name: "learning-dev" },
    { id: "career-growth", name: "career-growth" },
  ],
  dms: [
    { id: "slackbot", name: "Slackbot", isSlackbot: true },
    { id: "ananya-desai", name: "Ananya Desai", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/55.jpg" },
    { id: "raj-krishnamurthy", name: "Raj Krishnamurthy", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/men/52.jpg" },
    { id: "lena-okafor", name: "Lena Okafor", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/36.jpg" },
  ],
  files: [],
  savedItems: [],
  activityPosts: [],
  channelPreviews: {
    general: { preview: "Welcome to the workspace! Check out #career-growth for development resources.", timestamp: "Today" },
    "learning-dev": { preview: "New Cornerstone courses available: Product Strategy, Data-Driven Decisions.", timestamp: "Today" },
    "career-growth": { preview: "Internal mobility spotlight: 3 new roles posted in Product and Engineering.", timestamp: "Today" },
  },
  dmPreviews: {
    slackbot: { preview: "Your Cornerstone learning plan is ready for review.", timestamp: "Today" },
    "ananya-desai": { preview: "Happy to chat about the PM role! Let me know when works.", timestamp: "Today" },
    "raj-krishnamurthy": { preview: "Reviewed your architecture doc — strong work on the API design section.", timestamp: "Yesterday" },
    "lena-okafor": { preview: "Looking forward to our coaching session next Tuesday!", timestamp: "Today" },
  },
  messageAvatarMap: {
    Slackbot: "/slackbot-logo.svg",
    "Rita Patel": "https://randomuser.me/api/portraits/med/women/75.jpg",
    "Ananya Desai": "https://randomuser.me/api/portraits/med/women/55.jpg",
    "Raj Krishnamurthy": "https://randomuser.me/api/portraits/med/men/52.jpg",
    "Lena Okafor": "https://randomuser.me/api/portraits/med/women/36.jpg",
  },
  mockMessages: {},
  agentforceAgents: [
    { id: "af-employee-cs", name: "Employee Agent" },
  ],
};
