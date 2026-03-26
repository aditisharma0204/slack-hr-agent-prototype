# Employee Agent (Cornerstone OnDemand) — Demo Scripts

## Flow 1: Career Opportunity Discovery

### User Story
Employee wants to explore internal career opportunities based on their current skills.

### Demo Steps

| Step | User Action | Agent Response |
|------|-------------|----------------|
| **Trigger** | Type: `I want to explore internal roles` | Greeting + 3 suggested internal roles based on current skills |
| **Choose** | Click **Add to career path** / **Show skill gaps** / **Recommend learning** | Varies by selection (see below) |
| **Add to career path** | _(from above)_ | "Added to your career plan. Syncing with Cornerstone." |
| **Show skill gaps** | _(from above)_ | Transitions to Skill Gap flow (Flow 2) |
| **Recommend learning** | _(from above)_ | Shows 3 recommended courses + Enroll / Back options |

### Alternative Paths
- Click **Enroll** on a course → "Enrolled! Calendar invite sent."
- Click **Back to roles** → returns to the 3 suggested roles
- Type another role name → agent responds with that role's info

---

## Flow 2: Skill Gap & Learning Plan

### User Story
Employee wants to assess readiness for a specific role (e.g., Product Manager).

### Demo Steps

| Step | User Action | Agent Response |
|------|-------------|----------------|
| **Trigger** | Type: `How ready am I for a Product Manager role?` | Readiness score (68%) + top 3 skill gaps listed |
| **Choose** | Click **Create learning plan** / **Find mentor** / **Track progress** | Varies by selection (see below) |
| **Create learning plan** | _(from above)_ | "Learning plan created. 3 courses added to your Cornerstone profile." |
| **Find mentor** | _(from above)_ | Mentor suggestion card → Request intro / Save for later |
| **Track progress** | _(from above)_ | Progress dashboard → Back to readiness |

### Alternative Paths
- Click **Request intro** on mentor → "Intro sent to [mentor]. They typically respond in 1–2 days."
- Click **Save for later** on mentor → "Saved to your mentor shortlist."
- Click **Back to readiness** → returns to readiness score

---

## Flow 3: Mentorship & Action Tracking

### User Story
Employee needs help improving a specific skill (e.g., time management) and wants structured follow-up.

### Demo Steps

| Step | User Action | Agent Response |
|------|-------------|----------------|
| **Trigger** | Type: `I need help improving time management` | Suggests a mentor + 2 learning resources |
| **Choose** | Click **Select mentor** / **Start with resources** | Varies by selection (see below) |
| **Select mentor** | _(from above)_ | "Session scheduled with [mentor] for next Tuesday at 2 PM." |
| **Follow-up** | _(auto after schedule)_ | Action items card: Read resource, Try weekly planning template, Schedule follow-up |
| **Complete item** | Click **Mark complete** on any action | Progress updated, encouragement message |
| **Start with resources** | _(from above)_ | Shows 3 resources → Mark complete / Back |

### Alternative Paths
- Click **Mark complete** on action → "Nice work! 1 of 3 action items done."
- Click **Schedule follow-up** → "Follow-up scheduled for next week."
- Click **Back to suggestions** → returns to mentor + resources

---

## Quick Reference — Trigger Phrases

| Flow | Example Phrases |
|------|----------------|
| Career Discovery | "explore internal roles", "internal opportunities", "what roles are available" |
| Skill Gap | "how ready am I for…", "skill gaps", "readiness for…", "check my readiness" |
| Mentorship | "help improving…", "I need help with…", "time management", "find a mentor" |
