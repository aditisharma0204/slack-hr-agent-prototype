import type { DemoMessage, DemoActivityPost } from "@/context/DemoDataContext";

// Mock DMs - realistic multi-message chat histories based on prototype-lore.md
export const mockDMs: Record<string, DemoMessage[]> = {
  "sarah-chen": [
    {
      id: "sc_1",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "Yesterday",
      body: "rita — runners club deal reopened. cfo wants roi deck before they'll commit. can you get jordan on this? 👀",
    },
    {
      id: "sc_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Yesterday",
      body: "on it. jordan's building it now. should have it by eod",
    },
    {
      id: "sc_3",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "Yesterday",
      body: "good. this is panic mode. $720k commit at risk 😬",
    },
    {
      id: "sc_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "jordan sent the deck. shared with cfo. waiting on feedback",
    },
    {
      id: "sc_5",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "Today",
      body: "keep me posted. pipeline hygiene is critical for q1",
    },
  ],
  "priya-shah": [
    {
      id: "ps_1",
      author: "Priya Shah",
      authorImage: null,
      timestamp: "Today",
      body: "greentech sow is back. legal flagged 3 redlines in section 4",
    },
    {
      id: "ps_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "what are the redlines? can we negotiate?",
    },
    {
      id: "ps_3",
      author: "Priya Shah",
      authorImage: null,
      timestamp: "Today",
      body: "liability caps and data residency. standard stuff. i'll send you the marked-up version",
    },
    {
      id: "ps_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "thanks priya. $430k deal — need this closed",
    },
    {
      id: "ps_5",
      author: "Priya Shah",
      authorImage: null,
      timestamp: "10:20 AM",
      body: "msa is ready. just need their legal to sign off. should be done by friday",
    },
  ],
  "jordan-hayes": [
    {
      id: "jh_1",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "Yesterday",
      body: "runners club roi deck is done. sent to you and sarah",
    },
    {
      id: "jh_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Yesterday",
      body: "perfect timing. cfo is reviewing it now",
    },
    {
      id: "jh_3",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "Yesterday",
      body: "built it with their actual usage data. shows 3.2x roi over 3 years",
    },
    {
      id: "jh_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "cfo loved it. budget objection resolved 🚀",
    },
    {
      id: "jh_5",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "Today",
      body: "nice. that was a close one. $720k back on track",
    },
  ],
  "dana-torres": [
    {
      id: "dt_1",
      author: "Dana Torres",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "sporty nation deal is moving forward. i'll get you the exec sponsor intro",
    },
    {
      id: "dt_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "1 week ago",
      body: "hey dana — checking in on sporty nation. haven't heard back",
    },
    {
      id: "dt_3",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "3 days ago",
      body: "dana — still waiting on exec sponsor intro. $270k deal is at risk",
    },
    {
      id: "dt_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "14 days silent. champion gone dark. should i escalate?",
    },
  ],
  "marcus-lee": [
    {
      id: "ml_1",
      author: "Marcus Lee",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "rita — heads up. i'm leaving acme at the end of the month. priya shah is taking over my role. she's sharp and already knows the deal context.",
    },
    {
      id: "ml_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "oh wow, congrats on the new role! really appreciate everything you did to champion this deal. can you do a warm intro to priya before you leave?",
    },
    {
      id: "ml_3",
      author: "Marcus Lee",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "absolutely. i'll cc you both on an email today. priya already has the full context — she sat in on the last 2 calls.",
    },
    {
      id: "ml_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "got the intro, thank you! one last ask — is there anything i should know about the internal politics before talking to priya?",
    },
    {
      id: "ml_5",
      author: "Marcus Lee",
      authorImage: null,
      timestamp: "1 week ago",
      body: "daniel kim (VP procurement) has final sign-off. he's detail-oriented but fair. get priya to loop him in early. good luck rita, you'll close this one.",
    },
  ],
  "lisa-park": [
    {
      id: "lp_1",
      author: "Lisa Park",
      authorImage: null,
      timestamp: "Yesterday",
      body: "rita — quick heads up on the techstart qbr tomorrow. alex chen (cto) will be joining. he wasn't on the original attendee list.",
    },
    {
      id: "lp_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Yesterday",
      body: "thanks for the heads up! is there anything specific alex is going to want to see? i'll update the deck tonight.",
    },
    {
      id: "lp_3",
      author: "Lisa Park",
      authorImage: null,
      timestamp: "Yesterday",
      body: "he's big on security and compliance. make sure you have the soc 2 cert and data residency slides ready. he's detail-oriented but responsive once he trusts you.",
    },
    {
      id: "lp_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "perfect, adding those slides now. do you know if techstart is evaluating any competitors? i want to be ready.",
    },
    {
      id: "lp_5",
      author: "Lisa Park",
      authorImage: null,
      timestamp: "Today",
      body: "i heard workato is in the mix. lean into the native slack integration — that's our differentiator. qbr should go well, we're prepared.",
    },
  ],
  "daniel-kim": [
    {
      id: "dk_1",
      author: "Daniel Kim",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "hi rita, i'm daniel — vp of procurement at acme. priya looped me in after marcus's transition. happy to continue the conversation.",
    },
    {
      id: "dk_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "hi daniel, great to meet you! i've heard great things. the deal is in a strong spot — we just need to finalize the contract terms.",
    },
    {
      id: "dk_3",
      author: "Daniel Kim",
      authorImage: null,
      timestamp: "1 week ago",
      body: "i've reviewed the msa. a couple of questions on the liability caps in section 4.2 and the data processing addendum. can we schedule 30 mins?",
    },
    {
      id: "dk_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "1 week ago",
      body: "absolutely, i'll get priya shah (our se) and legal on the call too so we can address everything in one go. does thursday 2pm work?",
    },
    {
      id: "dk_5",
      author: "Daniel Kim",
      authorImage: null,
      timestamp: "Today",
      body: "thursday works. one more thing — is there any flexibility on the q1 close date? i need 2 weeks for internal procurement sign-off. feb 14 instead of jan 31.",
    },
  ],
  "mike-torres": [
    {
      id: "mt_1",
      author: "Mike Torres",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "rita — poc was really impressive. the automation features cut our manual data entry by 60% in testing. team loved it.",
    },
    {
      id: "mt_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "so glad to hear it! your ops team was great to work with. what's the path to contract from here on your end?",
    },
    {
      id: "mt_3",
      author: "Mike Torres",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "i'm fully bought in. i need to get cfo approval. she's going to want to see an roi justification — any chance you can put together the business case?",
    },
    {
      id: "mt_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "already on it — our solutions engineer jordan is building a custom roi model using your actual poc usage data. should show 3x+ return in year 1.",
    },
    {
      id: "mt_5",
      author: "Mike Torres",
      authorImage: null,
      timestamp: "Today",
      body: "cfo approved it. that roi deck was exactly what she needed to see. let's move to contract. $720k — let's get this done.",
    },
  ],
};

// Mock Channels - realistic chatter for sales channels
export const mockChannels: Record<string, DemoMessage[]> = {
  "sales": [
    {
      id: "sales_1",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "9:15 AM",
      body: "q1 day 1. let's hit the ground running. pipeline review at 2pm",
    },
    {
      id: "sales_2",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "9:20 AM",
      body: "runners club back on track. roi deck worked",
    },
    {
      id: "sales_3",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "9:21 AM",
      body: "nice work rita. that's a big win",
    },
    {
      id: "sales_4",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "9:25 AM",
      body: "anyone need poc support this week? i'm booked but can shuffle",
    },
  ],
  "q3-pipeline": [
    {
      id: "q3_1",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Yesterday",
      body: "q4 wrap-up: $471k attained. $29k short of accelerator",
    },
    {
      id: "q3_2",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "Yesterday",
      body: "solid quarter. q1 commit is $500k. let's exceed it",
    },
    {
      id: "q3_3",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Yesterday",
      body: "runners club ($720k) and greentech ($430k) should get us there",
    },
    {
      id: "q3_4",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "Today",
      body: "sporty nation ($270k) is high risk. champion silent for 14 days",
    },
  ],
  "deal-runners": [
    {
      id: "runners_1",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "initial discovery call went well. champion is mike torres, vp ops. they're evaluating 3 vendors. timeline is q1 close.",
      reactions: [
        { emoji: "👀", count: 2, users: ["Sarah Chen", "Jordan Hayes"] },
      ],
    },
    {
      id: "runners_2",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "3 weeks ago",
      body: "poc scheduled for next week. they want to test integration with their existing erp system",
      reactions: [
        { emoji: "👍", count: 1, users: ["Rita Patel"] },
      ],
      threadCount: 2,
      threadLastAuthor: "Rita Patel",
      threadLastAuthorImage: null,
      threadLastTimestamp: "3 weeks ago",
    },
    {
      id: "runners_3",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "how's the poc going? any blockers?",
      reactions: [
        { emoji: "💪", count: 1, users: ["Rita Patel"] },
      ],
    },
    {
      id: "runners_4",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "2 weeks ago",
      body: "poc completed successfully. mike's team loved the automation features. moving to contract discussions",
      reactions: [
        { emoji: "🎉", count: 3, users: ["Sarah Chen", "Jordan Hayes", "Priya Shah"] },
        { emoji: "🚀", count: 2, users: ["Sarah Chen", "Jordan Hayes"] },
      ],
      threadCount: 4,
      threadLastAuthor: "Jordan Hayes",
      threadLastAuthorImage: null,
      threadLastTimestamp: "2 weeks ago",
    },
    {
      id: "runners_5",
      author: "Priya Shah",
      authorImage: null,
      timestamp: "1 week ago",
      body: "contract draft sent. standard msa terms. waiting on their legal review",
      reactions: [
        { emoji: "✅", count: 1, users: ["Rita Patel"] },
      ],
    },
    {
      id: "runners_6",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "1 week ago",
      body: "update: cfo stepped in. wants to see roi justification before signing. budget freeze across the board",
      reactions: [
        { emoji: "😬", count: 2, users: ["Sarah Chen", "Jordan Hayes"] },
        { emoji: "⚠️", count: 1, users: ["Sarah Chen"] },
      ],
      threadCount: 5,
      threadLastAuthor: "Sarah Chen",
      threadLastAuthorImage: null,
      threadLastTimestamp: "1 week ago",
    },
    {
      id: "runners_7",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "5 days ago",
      body: "roi deck in progress. pulling their actual usage data from the poc. should show strong numbers",
      reactions: [
        { emoji: "💯", count: 1, users: ["Rita Patel"] },
      ],
    },
    {
      id: "runners_8",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "3 days ago",
      body: "mike's been great. he's advocating internally but cfo is holding firm. need that deck asap",
      reactions: [
        { emoji: "🔥", count: 1, users: ["Jordan Hayes"] },
      ],
      threadCount: 3,
      threadLastAuthor: "Jordan Hayes",
      threadLastAuthorImage: null,
      threadLastTimestamp: "2 days ago",
    },
    {
      id: "runners_9",
      author: "Jordan Hayes",
      authorImage: null,
      timestamp: "Yesterday",
      body: "roi deck sent. shows 3.2x roi over 3 years based on their usage. includes cost savings from automation and efficiency gains",
      reactions: [
        { emoji: "🎯", count: 2, users: ["Rita Patel", "Sarah Chen"] },
        { emoji: "📊", count: 1, users: ["Rita Patel"] },
      ],
      threadCount: 2,
      threadLastAuthor: "Rita Patel",
      threadLastAuthorImage: null,
      threadLastTimestamp: "Yesterday",
    },
    {
      id: "runners_10",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Yesterday",
      body: "cfo reviewing now. mike says he's impressed with the numbers. fingers crossed 🤞",
      reactions: [
        { emoji: "🤞", count: 2, users: ["Sarah Chen", "Jordan Hayes"] },
      ],
    },
    {
      id: "runners_11",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "cfo approved! budget objection resolved. deal back on track 🚀",
      reactions: [
        { emoji: "🎉", count: 4, users: ["Sarah Chen", "Jordan Hayes", "Priya Shah", "Rita Patel"] },
        { emoji: "🚀", count: 3, users: ["Sarah Chen", "Jordan Hayes", "Rita Patel"] },
        { emoji: "💰", count: 2, users: ["Sarah Chen", "Rita Patel"] },
      ],
      threadCount: 6,
      threadLastAuthor: "Sarah Chen",
      threadLastAuthorImage: null,
      threadLastTimestamp: "Today",
    },
    {
      id: "runners_12",
      author: "Sarah Chen",
      authorImage: null,
      timestamp: "Today",
      body: "excellent work team. $720k commit secured. this is exactly the kind of persistence we need for q1",
      reactions: [
        { emoji: "👏", count: 3, users: ["Rita Patel", "Jordan Hayes", "Priya Shah"] },
        { emoji: "💪", count: 2, users: ["Rita Patel", "Jordan Hayes"] },
      ],
      threadCount: 4,
      threadLastAuthor: "Priya Shah",
      threadLastAuthorImage: null,
      threadLastTimestamp: "Today",
    },
    {
      id: "runners_13",
      author: "Priya Shah",
      authorImage: null,
      timestamp: "Today",
      body: "contract is ready to sign. legal cleared all terms. waiting on their final signature",
      reactions: [
        { emoji: "✅", count: 2, users: ["Rita Patel", "Sarah Chen"] },
      ],
    },
    {
      id: "runners_14",
      author: "Rita Patel",
      authorImage: null,
      timestamp: "Today",
      body: "mike confirmed they'll sign by eod friday. q1 commit locked in 🎯",
      reactions: [
        { emoji: "🎯", count: 3, users: ["Sarah Chen", "Jordan Hayes", "Priya Shah"] },
        { emoji: "🔥", count: 2, users: ["Sarah Chen", "Jordan Hayes"] },
      ],
      threadCount: 2,
      threadLastAuthor: "Sarah Chen",
      threadLastAuthorImage: null,
      threadLastTimestamp: "Today",
    },
  ],
  "deal-acme-q1-strategic": [
    {
      id: "acme_launch",
      author: "Slackbot",
      authorImage: null,
      timestamp: "Just now",
      body: null,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Timeline of AI Work"
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: { type: "mrkdwn", text: "<https://salesforce.com|Salesforce> · Synced 12:34 PM" }
            },
            {
              type: "mrkdwn",
              text: { type: "mrkdwn", text: "<https://gong.io|Gong> · Transcripts analyzed 12:35 PM" }
            },
            {
              type: "mrkdwn",
              text: { type: "mrkdwn", text: "<https://gmail.com|Gmail> · Draft generated 12:36 PM" }
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Plan for Human Action"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Executive Summary*\n\n*Deal Context:* $270K Strategic Gap\n*Sarah Chen (Buyer) Sentiment:* Ghosting\n\nMomentum is high with the Technical Lead, but the Economic Buyer (Sarah Chen) is currently a \"Black Hole\" in Gmail and Gong."
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*@Mention Playbook*\n\n<@Rita Patel> (AE): Respond to Sarah's scalability concern. Draft waiting in Gmail based on Tuesday's Gong transcript.\n\n<@Priya Shah> (SE): Send the integration whitepaper requested by Daniel in Highspot.\n\n<@Jordan Hayes> (VP): Reach out to Mike Torres for an executive alignment check-in."
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Review Gmail Draft"
              },
              action_id: "review_gmail_draft",
              style: "default"
            }
          ]
        }
      ]
    },
  ],
};

// Mock Activity - notifications, mentions, reactions, thread replies
export const mockActivity: DemoActivityPost[] = [
  {
    id: "act_1",
    author: "Sarah Chen",
    authorImage: "https://randomuser.me/api/portraits/med/women/44.jpg",
    channelId: "sales",
    channelName: "sales",
    content: "mentioned you in #sales: rita — runners club deal reopened. cfo wants roi deck",
    timestamp: "9:20 AM",
    read: false,
    type: "post",
  },
  {
    id: "act_2",
    author: "Jordan Hayes",
    authorImage: "https://randomuser.me/api/portraits/med/men/22.jpg",
    channelId: "deal-runners",
    channelName: "deal-runners",
    content: "reacted to your message in #deal-runners with 🚀",
    timestamp: "9:25 AM",
    read: false,
    type: "post",
  },
  {
    id: "act_3",
    author: "Priya Shah",
    authorImage: "https://randomuser.me/api/portraits/med/women/32.jpg",
    channelId: "deal-greentech",
    channelName: "deal-greentech",
    content: "replied to thread: greentech sow is back. legal flagged 3 redlines",
    timestamp: "10:15 AM",
    read: false,
    type: "post",
  },
  {
    id: "act_4",
    author: "Sarah Chen",
    authorImage: "https://randomuser.me/api/portraits/med/women/44.jpg",
    channelId: "q3-pipeline",
    channelName: "q3-pipeline",
    content: "mentioned you in #q3-pipeline: sporty nation ($270k) is high risk",
    timestamp: "10:30 AM",
    read: false,
    type: "post",
  },
  {
    id: "act_5",
    author: "Jordan Hayes",
    authorImage: "https://randomuser.me/api/portraits/med/men/22.jpg",
    channelId: "deal-runners",
    channelName: "deal-runners",
    content: "shared file: Runners Club ROI Deck.pdf",
    timestamp: "11:00 AM",
    read: false,
    type: "post",
  },
  {
    id: "act_6",
    author: "Priya Shah",
    authorImage: "https://randomuser.me/api/portraits/med/women/32.jpg",
    channelId: "deal-greentech",
    channelName: "deal-greentech",
    content: "updated: greentech msa ready. legal sign-off pending",
    timestamp: "11:30 AM",
    read: false,
    type: "post",
  },
  {
    id: "act_7",
    author: "Sarah Chen",
    authorImage: "https://randomuser.me/api/portraits/med/women/44.jpg",
    channelId: "sales",
    channelName: "sales",
    content: "reacted to your message in #sales with 👀",
    timestamp: "12:00 PM",
    read: false,
    type: "post",
  },
  {
    id: "act_8",
    author: "Jordan Hayes",
    authorImage: "https://randomuser.me/api/portraits/med/men/22.jpg",
    channelId: "deal-runners",
    channelName: "deal-runners",
    content: "replied to thread: cfo approved. deal back on track 🚀",
    timestamp: "12:15 PM",
    read: false,
    type: "post",
  },
  {
    id: "act_9",
    author: "Priya Shah",
    authorImage: "https://randomuser.me/api/portraits/med/women/32.jpg",
    channelId: "deal-greentech",
    channelName: "deal-greentech",
    content: "mentioned you: msa is ready. just need their legal to sign off",
    timestamp: "1:00 PM",
    read: false,
    type: "post",
  },
  {
    id: "act_10",
    author: "Sarah Chen",
    authorImage: "https://randomuser.me/api/portraits/med/women/44.jpg",
    channelId: "sales",
    channelName: "sales",
    content: "pipeline review starting in 1 hour. make sure your commits are updated",
    timestamp: "1:00 PM",
    read: false,
    type: "post",
  },
];
