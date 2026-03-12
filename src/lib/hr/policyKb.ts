export type PolicyArticle = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  sourceLabel: string;
};

const ARTICLES: PolicyArticle[] = [
  {
    id: "goals-smart",
    title: "Writing high-quality (SMART) goals",
    sourceLabel: "People Policy · Goals",
    tags: ["goals", "smart", "specific", "measurable", "time-bound"],
    body:
      "Goals should be Specific, Measurable, Achievable, Relevant, and Time-bound. Include a clear outcome, a metric for success, and a target date. If a goal is vague (e.g., “get better at communication”), add a concrete deliverable (e.g., “publish 3 design docs and run 2 stakeholder reviews by June 30”).",
  },
  {
    id: "goals-updates",
    title: "Updating goal progress",
    sourceLabel: "People Policy · Goals",
    tags: ["goals", "progress", "updates"],
    body:
      "Employees should update goal progress at least monthly, and before 1:1s or mid-cycle check-ins. If circumstances change, update the target date or metric in agreement with your manager.",
  },
  {
    id: "self-review",
    title: "Self-review and appraisal submission",
    sourceLabel: "People Policy · Performance",
    tags: ["self-review", "appraisal", "cycle", "submission"],
    body:
      "Self-reviews should summarize impact against completed goals, highlight learnings, and call out collaboration. Use specific examples and outcomes. Professional tone is required; inappropriate language may be returned for revision before submission.",
  },
  {
    id: "promotion-eligibility",
    title: "Promotion eligibility (high-level)",
    sourceLabel: "People Policy · Career Growth",
    tags: ["promotion", "eligibility", "time in role", "rating"],
    body:
      "Promotion decisions are based on sustained performance and role scope. Common eligibility checks include sufficient time in current role, recent strong performance, and being in good standing (e.g., not on an active performance plan). Final approval is manager-led and may require calibration.",
  },
  {
    id: "internal-transfer",
    title: "Internal transfers (high-level)",
    sourceLabel: "People Policy · Mobility",
    tags: ["transfer", "internal mobility", "department change"],
    body:
      "Internal transfers may require a minimum time in role and manager awareness. Some teams have additional requirements (e.g., critical project coverage). Employees should clarify timeline, role expectations, and transition plan before submitting a request.",
  },
];

function tokenize(q: string) {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => t.length >= 3);
}

export function searchPolicyKb(query: string, limit = 2): Array<{ article: PolicyArticle; score: number; matched: string[] }> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = ARTICLES.map((a) => {
    const hay = `${a.title} ${a.body} ${a.tags.join(" ")}`.toLowerCase();
    const matched = tokens.filter((t) => hay.includes(t));
    const score = matched.length + (matched.some((t) => a.title.toLowerCase().includes(t)) ? 1 : 0);
    return { article: a, score, matched };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

