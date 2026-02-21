---
name: slackbot-icon-usage
description: Always use the Slackbot icon image from the public folder instead of text "SB" when displaying Slackbot messages, avatars, or any Slackbot-related UI elements. Use when rendering Slackbot messages, chat interfaces, or any component that represents Slackbot visually.
---

# Slackbot Icon Usage

## Rule

**Always use the Slackbot icon image (`/slackbot-logo.svg`) instead of text "SB" when displaying Slackbot in the UI.**

## When to Apply

Apply this rule when:
- Rendering Slackbot message avatars in chat threads
- Displaying Slackbot in message headers or user lists
- Creating Slackbot-related UI components
- Showing Slackbot branding or identity elements
- Any visual representation of Slackbot in the interface

## Implementation

Use the Slackbot icon from the public folder:

```tsx
// ✅ Correct - Use icon image
<Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />

// Or with Next.js Image component
<img src="/slackbot-logo.svg" alt="Slackbot" className="w-8 h-8" />
```

## Examples

### ✅ Correct Usage

```tsx
// Message avatar
<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
  <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
</div>

// Header branding
<div className="flex items-center gap-2">
  <Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />
  <span>Slackbot</span>
</div>
```

### ❌ Incorrect Usage

```tsx
// ❌ Wrong - Don't use text "SB"
<div className="w-8 h-8 rounded-full bg-[#611f69] flex items-center justify-center">
  <span className="text-white text-xs font-bold">SB</span>
</div>

// ❌ Wrong - Don't use initials
<span className="text-white text-xs font-bold">SB</span>
```

## Quick Checklist

When rendering Slackbot UI elements, verify:
- [ ] Using `/slackbot-logo.svg` image instead of "SB" text
- [ ] Image has appropriate `alt` text ("Slackbot")
- [ ] Image sizing is appropriate for context (typically 16-32px)
- [ ] No text-based fallbacks like "SB" or initials
