---
name: slackbot-panel-header
description: Always use a star/like icon instead of home icon next to Slackbot icon in panel headers. Use Edit, MoreVertical, and Close icons on the right. Include chat component with prompts at the bottom. Use when building or updating Slackbot panel headers, sidebars, or chat interfaces.
---

# Slackbot Panel Header

## Rule

**In Slackbot panel headers, never use the home icon next to the Slackbot icon. Always use a star/like icon instead.**

## Header Structure

### Left Side (from left to right):
1. **Star/Like Icon** (not Home icon) - Favorite/bookmark functionality
2. **Slackbot Icon** - `/slackbot-logo.svg` image
3. **"Slackbot" text** - Bold label

### Right Side (from left to right):
1. **Edit/Pencil Icon** - Edit or compose functionality
2. **MoreVertical Icon** - More options menu
3. **Close/X Icon** - Close/dismiss panel

## Implementation

```tsx
// ✅ Correct - Use IconStar
<div className="flex items-center gap-2">
  <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" title="Favorite">
    <IconStar width={20} height={20} stroke="currentColor" />
  </button>
  <Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />
  <span className="font-semibold">Slackbot</span>
</div>

// Right side icons
<div className="flex items-center gap-0.5">
  <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" title="Edit">
    <IconPencil width={20} height={20} stroke="currentColor" />
  </button>
  <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" title="More">
    <IconMoreVertical width={20} height={20} stroke="currentColor" />
  </button>
  <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" title="Close" onClick={onClose}>
    <IconX width={20} height={20} stroke="currentColor" />
  </button>
</div>
```

### ❌ Incorrect Usage

```tsx
// ❌ Wrong - Don't use IconHome
<IconHome width={20} height={20} stroke="currentColor" />
```

## Chat Component at Bottom

Always include a chat input component at the bottom of the Slackbot panel with:
- Message input field
- Quick prompt buttons or suggestions
- Submit/send functionality

## Quick Checklist

When building Slackbot panel headers, verify:
- [ ] Using `IconStar` instead of `IconHome` next to Slackbot icon
- [ ] Right side has Edit (IconPencil), More (IconMoreVertical), Close (IconX) icons
- [ ] Chat component included at bottom with prompts
- [ ] Icons have proper hover states and titles
