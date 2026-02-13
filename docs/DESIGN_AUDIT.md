# Design Audit: Slack / Salesforce Activity Reference

Atomic design audit extracted from reference images. Use this as the single source of truth for implementation.

## Atoms

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| sidebar | #4a154b | Left icon bar background |
| sidebarHover | #350d36 | Sidebar hover (darker purple) |
| activeItem | #1164a3 | Active nav item, link underline |
| text | #1d1c1d | Primary text |
| textSecondary | #616061 | Secondary text, placeholders |
| border | #e8e8e8 | Borders, dividers |
| link | #1264a3 | Links, active tab |
| primaryButton | #2eb886 | Green CTA (Review, etc.) |
| primaryButtonHover | #269873 | Primary button hover |
| background | #ffffff | Main backgrounds |
| backgroundAlt | #f8f8f8 | Hover, input bg, subtle areas |
| betaBadgeBg | #e8f4fc | Beta badge background |
| avatarBg | #611f69 | Default avatar purple |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| body | 15px | Message text, channel names |
| bodyLineHeight | 1.46668 | Slack standard line-height |
| small | 13px | Timestamps, preview text |
| smaller | 12px | Timestamps in list |
| header | 18px | Channel name, panel titles |
| fontFamily | -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Lato, sans-serif | System stack |

### Icons

| Context | Icon | Size | lucide-react |
|---------|------|------|--------------|
| Sidebar | Home | 20px | Home |
| Sidebar | DMs | 20px | MessagesSquare |
| Sidebar | Activity | 20px | Bell |
| Sidebar | Files | 20px | Folder |
| Sidebar | Later | 20px | Bookmark |
| Sidebar | Agentforce | 20px | Bot |
| Sidebar | More | 20px | MoreHorizontal |
| Sidebar | Plus | 18px | Plus |
| Channel header | Users | 16px | Users |
| Channel header | Phone | 16px | Phone |
| Channel header | Pin | 16px | Pin |
| Channel header | Search | 16px | Search |
| Channel header | More | 16px | MoreHorizontal |
| Input toolbar | Bold, Italic, etc. | 14px | Bold, Italic, Underline, etc. |
| Input actions | Plus, Emoji, AtSign, Paperclip, Send | 16px | Plus, Smile, AtSign, Paperclip, Send |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps |
| sm | 8px | Icon gaps, small padding |
| md | 12px | Standard padding |
| lg | 16px | Section padding |
| xl | 20px | Message padding |
| xxl | 24px | Large sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| button | 4px | Buttons |
| input | 8px | Input fields |
| pill | 9999px | Pill buttons, avatars |
| avatar | 4px | Square avatars (Slack style) |

### Shadows

Slack uses borders more than shadows. Use subtle borders (#e8e8e8) for elevation. No drop shadows on standard components.

---

## Molecules

### Icon Button (Sidebar)
- Icon 20px, white
- Hover: bg white/10
- Active: bg white/15
- Padding: py-2.5, full width

### Channel List Item
- Avatar 32x32, rounded or 4px
- Name 15px font-medium
- Preview 13px textSecondary
- Timestamp 12px textSecondary
- Hover: bg #f8f8f8
- Active: bg #f8f8f8 + ring 1px #e8e8e8

### Block Kit Section
- Header: 15px bold
- Fields: 2-col grid, gap-x-4 gap-y-1
- Text: 15px, line-height 1.46668
- Divider: 1px #e8e8e8
- Buttons: primary #2eb886, secondary bordered #e8e8e8

### Tab Bar
- Active: text #1264a3, border-bottom 2px #1264a3
- Inactive: text #616061, hover #1d1c1d

---

## Organisms

### Left Icon Bar
- Width: 60px
- Background: #4a154b
- Logo top, nav icons, Plus button, profile bottom

### Activity Sidebar
- Width: 260px
- White bg, border-r #e8e8e8
- Header: "Activity" + Beta badge
- All/DMs filters, search, filter row, channel list

### Slackbot Panel
- Resizable ~25% default
- Header: Star, Pencil, X, Maximize, Minimize
- Tabs: Messages, History, Files, Proactive, Plus
