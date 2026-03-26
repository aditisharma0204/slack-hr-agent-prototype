# Employee Performance Management Agent — Demo Scripts

## Flow 1: Create Career Goal (Vague → SMART Refinement Loop)

### User Story
Employee wants to create a career goal like "I want to improve coaching skills."

### Demo Steps

| Step | User Action | Agent Response |
|------|-------------|----------------|
| **Trigger** | Type: `I want to improve my coaching skills` | Acknowledge card with vague goal quoted |
| **Acknowledge** | Click **✏️ Start refining goal** | "What outcome would success look like?" |
| **Outcome** | Type: `Become better at coaching junior team members` | Metric selection buttons appear |
| **Metric** | Click **📊 Feedback from team** | Generated SMART goal card with Accept/Edit/Refine |
| **Accept** | Click **✅ Accept Goal** | Confirm submission prompt |
| **Submit** | Click **🚀 Submit** | "Nice work!" + Set reminder button |

### Alternative Paths
- Click **👀 See examples** at Step 1 → shows 3 example SMART goals
- Click **✍️ Custom input** at Metric step → type custom metric
- Click **✏️ Edit** at Accept step → loop back to outcome
- Click **🧾 Save Draft** → saves without submitting
- Click **❌ Not now** or **❌ Cancel** → exits flow gracefully

---

## Flow 2: Performance Summary before 1:1

### User Story
Employee wants quick clarity on performance status before a 1:1 meeting.

### Demo Steps

| Step | User Action | Agent Response |
|------|-------------|----------------|
| **Trigger** | Type: `How am I doing on my goals?` | Dashboard card with all goals, progress bars, risk indicators |
| **Suggestions** | Click **🧠 Get suggestions** | "You are slightly behind on [goal]..." + action buttons |
| **Mentor** | Click **👥 Find mentor** | Mentor card: Priya Sharma with bio |
| **Intro** | Click **✉️ Request intro** | "Done! Intro request sent to Priya Sharma" |

### Alternative Paths
- Click **🔎 View details** → expanded goal detail cards
- Click **✏️ Update progress** → prompts to select which goal
- Click **📚 Find learning resources** → recommended books, workshops, courses
- Click **🗓️ Schedule coaching session** → shows available time slots with manager
- Click **⭐ Save for later** on mentor → saves to shortlist
- Click **📅 Enroll in workshop** → confirms enrollment + calendar notification
- Click **🔙 Back to dashboard** → returns to progress snapshot

---

## Flow 3: Promotion Eligibility Check

### User Story
Employee wants to know if they're ready for promotion.

### Demo Steps

| Step | User Action | Agent Response |
|------|-------------|----------------|
| **Trigger** | Type: `Am I eligible for promotion?` | Evaluation checklist → Readiness Score card (75%) |
| **Growth Plan** | Click **🪄 Create Growth Plan** | Suggested goal: "Lead a cross-functional initiative..." |
| **Add Goal** | Click **✅ Add to Goals** | Goal added to performance plan + confirmation |

### Alternative Paths
- Click **🧾 Start Promotion Request** → submits if eligible, guides if not
- Click **📚 Suggested Skills** → shows 4 skills to strengthen with descriptions
- Click **🔁 Suggest Another** → shows alternate growth goal
- Click **🔙 Back to Readiness** → returns to score card

### Readiness Score Breakdown
The agent evaluates 4 dimensions:
- ✅/⬜ **Goal completion** — completed goals vs total
- ✅/⬜ **Performance rating** — needs ≥ 4/5
- ✅/⬜ **Time in role** — needs ≥ 18 months
- ✅/⬜ **Skill readiness** — cross-team leadership evidence

---

## Other Supported Flows (text-based)

### Self-Review Drafting
- Trigger: `help me write my self review`
- Agent pre-fills draft from completed goals, user edits in composer
- Tone sanitization flags inappropriate language
- Submit when ready

### Policy Q&A
- Trigger: `what is the goal policy?`
- Agent searches knowledge base and returns relevant policy articles

---

## Quick Reference — Trigger Phrases

| Flow | Example Phrases |
|------|----------------|
| Create Goal | "create a goal", "I want to improve...", "help me set a goal" |
| Performance Summary | "how am I doing?", "show my goals", "performance summary" |
| Promotion Check | "am I eligible for promotion?", "promotion readiness", "ready for promotion" |
| Self-Review | "help me write my self review", "start my appraisal" |
| Policy | "what is the goal policy?", "promotion guidelines" |
