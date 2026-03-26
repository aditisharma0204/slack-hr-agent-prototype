# Refactor Plan: Conversational UI Pattern

## Current State
- All in-flow actions use Block Kit buttons (rich interactive cards)
- No distinction between welcome state and active conversation
- Single monolithic `HRAgentChat` component
- Engine returns `SlackBlock[]` with `actions` type blocks

## Target State
- **Welcome state**: lightweight ghost/outline starter prompt chips
- **In-flow actions**: numbered text options inside agent messages (no buttons)
- **Free text inputs**: plain conversational questions
- **Clean component structure**: ChatScreen, StarterPromptChips, MessageList, etc.

## Iteration 1 — Types & Engine Foundation
- **What**: Add `pendingActions` to workflow type; add number-to-action resolution in engine
- **Why**: The engine needs to store what "1", "2", "3" map to so it can resolve numbered input
- **Next**: Replace all Block Kit action blocks with numbered text

## Iteration 2 — Engine: Buttons → Numbered Options
- **What**: Replace every `actions` block in all 3 flows with plain text numbered lists
- **Why**: Chat-native conversational pattern, no rich buttons inside flows
- **Next**: Build starter prompt UI

## Iteration 3 — StarterPromptChips + Component Structure
- **What**: Create StarterPromptChips (ghost style), refactor HRAgentChat into clean components
- **Why**: Starter prompts only at welcome state, clean separation of concerns
- **Next**: Wire number input handling, verify all flows

## Iteration 4 — Verify & Polish
- **What**: Test all 3 flows end-to-end, ensure numbered input works, ensure starter prompts hide
- **Why**: Everything must work for the PM demo
- **Next**: Done

---

## Changelog

### Update 1 — Engine + Types + Components (complete)
- **What changed**:
  - Added `PendingAction` type and `pendingActions` field to `HrWorkflow`
  - Added `ConversationPhase` and `phase` field to `HrWorkflowSession`
  - Rewrote entire `engine.ts`: removed `hrHandleAction`, removed all Block Kit `actions` blocks, converted every button interaction to numbered text options stored in `pendingActions`
  - Number resolution: engine checks if user input is a number (1, 2, 3...) and maps to pending action via `resolveNumberedInput`
  - Created `StarterPromptChips` component — ghost/outline style, shown only when `phase === "welcome"`
  - Refactored `HRAgentChat` — removed `onAction` handler, added starter chips, simplified to just handle text input
  - Added mrkdwn rendering (`*bold*`, `_italic_`) to `ChatMessage`
- **Why**: Buttons inside flows break the chat-native conversational pattern; numbered options are platform-agnostic and feel like real agent conversations
- **Next**: Done — all flows verified, server compiling cleanly

### Update 2 — Verification (complete)
- **What changed**: Verified TypeScript compiles (only pre-existing errors in BlockKitRenderer.tsx remain), dev server serves 200, no dangling references to `hrHandleAction` or `onAction` in HR components
- **Why**: Ensure nothing is broken before handoff
- **Next**: Ready for demo
