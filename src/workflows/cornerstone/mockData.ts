export interface InternalRole {
  id: string;
  title: string;
  team: string;
  matchPct: number;
  description: string;
}

export interface SkillGap {
  skill: string;
  current: number;
  required: number;
}

export interface LearningCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  description: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string;
  bio: string;
  avatarUrl: string;
}

export interface ActionItem {
  id: string;
  label: string;
  completed: boolean;
}

export function getSuggestedRoles(): InternalRole[] {
  return [
    {
      id: "role-pm",
      title: "Product Manager — Platform",
      team: "Product Engineering",
      matchPct: 82,
      description: "Drive product strategy for internal developer tools. Strong fit based on your technical background and cross-team collaboration.",
    },
    {
      id: "role-em",
      title: "Engineering Manager — Growth",
      team: "Growth Engineering",
      matchPct: 75,
      description: "Lead a team of 6 engineers focused on user acquisition and activation. Aligns with your mentorship experience.",
    },
    {
      id: "role-tl",
      title: "Technical Lead — Data Platform",
      team: "Data Engineering",
      matchPct: 68,
      description: "Own architecture for real-time data pipelines. Matches your system design skills; gap in distributed systems.",
    },
  ];
}

export function getSkillGaps(role: string): { readinessPct: number; gaps: SkillGap[] } {
  const gapsByRole: Record<string, { readinessPct: number; gaps: SkillGap[] }> = {
    "Product Manager": {
      readinessPct: 68,
      gaps: [
        { skill: "Product Strategy & Roadmapping", current: 3, required: 5 },
        { skill: "User Research & Data Analysis", current: 2, required: 4 },
        { skill: "Stakeholder Management", current: 3, required: 5 },
      ],
    },
    "Engineering Manager": {
      readinessPct: 75,
      gaps: [
        { skill: "People Management", current: 3, required: 5 },
        { skill: "Hiring & Talent Development", current: 2, required: 4 },
        { skill: "Budget & Resource Planning", current: 1, required: 3 },
      ],
    },
    "Technical Lead": {
      readinessPct: 72,
      gaps: [
        { skill: "Distributed Systems Design", current: 2, required: 5 },
        { skill: "Technical Mentorship", current: 3, required: 4 },
        { skill: "Architecture Documentation", current: 3, required: 5 },
      ],
    },
  };

  const normalizedRole = Object.keys(gapsByRole).find(
    (k) => role.toLowerCase().includes(k.toLowerCase())
  );

  return gapsByRole[normalizedRole || "Product Manager"];
}

export function getLearningCourses(skill?: string): LearningCourse[] {
  return [
    {
      id: "course-1",
      title: "Product Strategy Fundamentals",
      provider: "Cornerstone OnDemand",
      duration: "8 hours",
      description: "Build a product roadmap from vision to execution. Covers prioritization frameworks and stakeholder alignment.",
    },
    {
      id: "course-2",
      title: "Data-Driven Decision Making",
      provider: "Cornerstone OnDemand",
      duration: "6 hours",
      description: "Learn to leverage analytics for product decisions. Includes A/B testing, cohort analysis, and user segmentation.",
    },
    {
      id: "course-3",
      title: "Stakeholder Communication Masterclass",
      provider: "LinkedIn Learning",
      duration: "4 hours",
      description: "Techniques for influencing without authority. Covers executive presentations and cross-functional alignment.",
    },
  ];
}

export function getMentor(context: string): Mentor {
  const mentors: Record<string, Mentor> = {
    career: {
      id: "mentor-1",
      name: "Ananya Desai",
      role: "Senior Product Manager",
      expertise: "Career transitions, product strategy",
      bio: "Transitioned from engineering to product. Mentored 8 employees through internal role changes.",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/55.jpg",
    },
    skill: {
      id: "mentor-2",
      name: "Raj Krishnamurthy",
      role: "Director of Engineering",
      expertise: "Technical leadership, system design",
      bio: "15 years in engineering leadership. Passionate about growing engineers into strategic thinkers.",
      avatarUrl: "https://randomuser.me/api/portraits/med/men/52.jpg",
    },
    mentorship: {
      id: "mentor-3",
      name: "Lena Okafor",
      role: "Executive Coach",
      expertise: "Time management, productivity systems",
      bio: "Certified executive coach specializing in engineering leaders. Uses evidence-based productivity frameworks.",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/36.jpg",
    },
  };
  return mentors[context] || mentors.mentorship;
}

export function getActionItems(): ActionItem[] {
  return [
    { id: "ai-1", label: "Read: \"Deep Work\" by Cal Newport (Chapter 1–3)", completed: false },
    { id: "ai-2", label: "Try the weekly planning template shared by your mentor", completed: false },
    { id: "ai-3", label: "Schedule a follow-up check-in for next week", completed: false },
  ];
}

export function getTimeManagementResources(): LearningCourse[] {
  return [
    {
      id: "tm-1",
      title: "Time Management for Technical Leaders",
      provider: "Cornerstone OnDemand",
      duration: "3 hours",
      description: "Frameworks for prioritizing deep work, managing context switches, and protecting focus time.",
    },
    {
      id: "tm-2",
      title: "The Eisenhower Matrix in Practice",
      provider: "LinkedIn Learning",
      duration: "2 hours",
      description: "Practical application of urgent-vs-important prioritization for busy professionals.",
    },
  ];
}
