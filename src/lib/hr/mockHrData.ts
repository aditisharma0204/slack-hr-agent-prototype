export type HrCycle = {
  id: string;
  label: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
};

export type HrGoalStatus = "not_started" | "in_progress" | "completed";

export type HrGoal = {
  id: string;
  cycleId: string;
  title: string;
  successMetric: string;
  targetDate: string; // ISO date
  progressPct: number; // 0-100
  status: HrGoalStatus;
  lastUpdated: string; // ISO datetime
};

export type PerformanceSnapshot = {
  cycleId: string;
  goalsTotal: number;
  goalsCompleted: number;
  goalsBehind: Array<{
    goalId: string;
    title: string;
    behindByPct: number;
    nudge: string;
  }>;
};

export type EmployeeProfile = {
  employeeId: string;
  displayName: string;
  roleTitle: string;
  department: string;
  level: string;
  managerName: string;
  timeInRoleMonths: number;
  performanceRating: 1 | 2 | 3 | 4 | 5; // 5=top
  onPerformancePlan: boolean;
};

export type HrRequestType = "promotion" | "transfer";

export type HrRequest = {
  id: string;
  employeeId: string;
  type: HrRequestType;
  createdAt: string; // ISO datetime
  status: "created" | "submitted" | "cancelled";
  payload: Record<string, unknown>;
};

export type SelfReviewSubmission = {
  id: string;
  employeeId: string;
  cycleId: string;
  submittedAt: string; // ISO datetime
  content: string;
};

function isoNow() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

type HrDb = {
  cycle: HrCycle;
  profile: EmployeeProfile;
  goals: HrGoal[];
  requests: HrRequest[];
  selfReviews: SelfReviewSubmission[];
};

function getDb(): HrDb {
  const key = "__HR_MOCK_DB__";
  const g = globalThis as unknown as Record<string, HrDb | undefined>;
  if (g[key]) return g[key]!;

  const cycle: HrCycle = {
    id: "FY26-H2",
    label: "FY26 H2",
    startDate: "2026-02-01",
    endDate: "2026-07-31",
  };

  const profile: EmployeeProfile = {
    employeeId: "e-1001",
    displayName: "Rita Patel",
    roleTitle: "Senior Software Engineer",
    department: "Product Engineering",
    level: "L4",
    managerName: "Sarah Chen",
    timeInRoleMonths: 20,
    performanceRating: 4,
    onPerformancePlan: false,
  };

  const goals: HrGoal[] = [
    {
      id: "g-001",
      cycleId: cycle.id,
      title: "Earn AWS Solutions Architect Associate certification",
      successMetric: "Pass the AWS SAA exam and share proof of certification",
      targetDate: "2026-05-15",
      progressPct: 60,
      status: "in_progress",
      lastUpdated: "2026-03-01T17:10:00.000Z",
    },
    {
      id: "g-002",
      cycleId: cycle.id,
      title: "Improve API latency for Employee Goals service",
      successMetric: "Reduce p95 latency from 420ms to 300ms across top 5 endpoints",
      targetDate: "2026-04-30",
      progressPct: 100,
      status: "completed",
      lastUpdated: "2026-02-25T22:30:00.000Z",
    },
    {
      id: "g-003",
      cycleId: cycle.id,
      title: "Deliver self-serve goal creation UX improvements",
      successMetric: "Ship redesigned flow and reach +10% completion rate vs baseline",
      targetDate: "2026-06-15",
      progressPct: 35,
      status: "in_progress",
      lastUpdated: "2026-03-05T19:00:00.000Z",
    },
  ];

  const db: HrDb = {
    cycle,
    profile,
    goals,
    requests: [],
    selfReviews: [],
  };

  g[key] = db;
  return db;
}

export function getActiveCycle(): HrCycle {
  return getDb().cycle;
}

export function getEmployeeProfile(): EmployeeProfile {
  return getDb().profile;
}

export function listGoals(cycleId = getActiveCycle().id): HrGoal[] {
  return getDb().goals.filter((g) => g.cycleId === cycleId);
}

export function listCompletedGoals(cycleId = getActiveCycle().id): HrGoal[] {
  return listGoals(cycleId).filter((g) => g.status === "completed");
}

export function createGoal(input: Pick<HrGoal, "cycleId" | "title" | "successMetric" | "targetDate">): HrGoal {
  const db = getDb();
  const goal: HrGoal = {
    id: makeId("g"),
    cycleId: input.cycleId,
    title: input.title,
    successMetric: input.successMetric,
    targetDate: input.targetDate,
    progressPct: 0,
    status: "not_started",
    lastUpdated: isoNow(),
  };
  db.goals = [goal, ...db.goals];
  return goal;
}

export function updateGoalProgress(goalId: string, progressPct: number): HrGoal | null {
  const db = getDb();
  const idx = db.goals.findIndex((g) => g.id === goalId);
  if (idx < 0) return null;
  const clamped = Math.max(0, Math.min(100, Math.round(progressPct)));
  const next: HrGoal = {
    ...db.goals[idx]!,
    progressPct: clamped,
    status: clamped >= 100 ? "completed" : clamped > 0 ? "in_progress" : "not_started",
    lastUpdated: isoNow(),
  };
  db.goals = [...db.goals.slice(0, idx), next, ...db.goals.slice(idx + 1)];
  return next;
}

export function getPerformanceSnapshot(cycleId = getActiveCycle().id): PerformanceSnapshot {
  const goals = listGoals(cycleId);
  const goalsCompleted = goals.filter((g) => g.status === "completed").length;

  // Simple heuristic “behind”: due within 90 days but progress < 75.
  const now = new Date();
  const behind = goals
    .filter((g) => g.status !== "completed")
    .map((g) => {
      const due = new Date(g.targetDate);
      const daysToDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const expected = daysToDue <= 0 ? 100 : Math.max(0, Math.min(100, Math.round(100 - (daysToDue / 180) * 100)));
      const behindByPct = Math.max(0, expected - g.progressPct);
      return { goal: g, daysToDue, behindByPct };
    })
    .filter((x) => x.daysToDue <= 90 && x.behindByPct >= 10)
    .sort((a, b) => b.behindByPct - a.behindByPct)
    .slice(0, 2)
    .map((x) => ({
      goalId: x.goal.id,
      title: x.goal.title,
      behindByPct: x.behindByPct,
      nudge: "Want to update your progress or adjust the target date?",
    }));

  return {
    cycleId,
    goalsTotal: goals.length,
    goalsCompleted,
    goalsBehind: behind,
  };
}

export function getPromotionTransferEligibility(profile = getEmployeeProfile()): {
  eligible: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (profile.timeInRoleMonths < 18) {
    reasons.push(`Time in role is ${profile.timeInRoleMonths} months (needs ≥ 18).`);
  }
  if (profile.performanceRating < 4) {
    reasons.push("Most recent performance rating is below the eligibility threshold (needs ≥ 4/5).");
  }
  if (profile.onPerformancePlan) {
    reasons.push("Employee is currently on a performance improvement plan.");
  }
  return { eligible: reasons.length === 0, reasons };
}

export function createRequest(type: HrRequestType, payload: Record<string, unknown>): HrRequest {
  const db = getDb();
  const request: HrRequest = {
    id: makeId("r"),
    employeeId: db.profile.employeeId,
    type,
    createdAt: isoNow(),
    status: "created",
    payload,
  };
  db.requests = [request, ...db.requests];
  return request;
}

export function submitSelfReview(cycleId: string, content: string): SelfReviewSubmission {
  const db = getDb();
  const submission: SelfReviewSubmission = {
    id: makeId("sr"),
    employeeId: db.profile.employeeId,
    cycleId,
    submittedAt: isoNow(),
    content,
  };
  db.selfReviews = [submission, ...db.selfReviews];
  return submission;
}

