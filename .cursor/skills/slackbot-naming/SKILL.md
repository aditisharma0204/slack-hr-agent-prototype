---
name: slackbot-naming
description: Enforce naming convention: always use "Slackbot" instead of "Agentforce" in Slack UI, messages, and user-facing text. Use when writing Slack-related content, UI components, messages, or any user-facing text in Slack contexts.
---

# Slackbot Naming Convention

## Rule

**Never write "Agentforce" in Slack contexts. Always use "Slackbot" instead.**

## When to Apply

Apply this naming convention when:
- Writing Slack messages or bot responses
- Creating Slack UI components or panels
- Writing user-facing text in Slack interfaces
- Referencing the bot or assistant in Slack contexts
- Creating labels, headers, or titles in Slack UI

## Examples

### ✅ Correct Usage

```typescript
// UI Component
<span>Slackbot</span>

// Message
"Good morning Rita. Slackbot here to help..."

// Panel Header
<h2>Slackbot Pipeline Planning</h2>
```

### ❌ Incorrect Usage

```typescript
// UI Component
<span>Agentforce</span>  // ❌ Wrong

// Message
"Agentforce here to help..."  // ❌ Wrong

// Panel Header
<h2>Agentforce Pipeline Planning</h2>  // ❌ Wrong
```

## Code Context

In code, you may see references to "Agentforce" in:
- Component names (e.g., `Arc1AgentforcePanel.tsx`)
- Internal variable names
- File names

**This is acceptable for code organization**, but any **user-facing text** displayed in Slack must say "Slackbot".

## Quick Checklist

When writing Slack-related content, verify:
- [ ] All user-facing text says "Slackbot", not "Agentforce"
- [ ] Message content uses "Slackbot"
- [ ] UI labels and headers use "Slackbot"
- [ ] Button text and tooltips use "Slackbot"
- [ ] Error messages use "Slackbot"
