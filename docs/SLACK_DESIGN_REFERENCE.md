# Slack Design Reference

Canonical references for Slack UI alignment.

## Official Resources

- [Block Kit](https://api.slack.com/block-kit) - JSON structure for app surfaces
- [Block Kit Builder](https://app.slack.com/block-kit-builder) - Visual prototyping (canonical visual reference)
- [Block Kit Reference](https://api.slack.com/reference/block-kit) - Blocks, elements, composition objects
- [Designing with Block Kit](https://api.slack.com/block-kit/designing) - Accessibility and design guidelines

## Design Tokens

See `src/design/slack-tokens.ts` for the single source of truth.

## Icon Mapping (lucide-react)

| Slack / Reference | lucide-react |
|-------------------|--------------|
| Home | Home |
| DMs | MessagesSquare |
| Activity | Bell |
| Files | Folder |
| Later | Bookmark |
| Agentforce | Bot |
| More | MoreHorizontal |
| Plus | Plus |
| Users | Users |
| Phone | Phone |
| Pin | Pin |
| Search | Search |
| Bold | Bold |
| Italic | Italic |
| Emoji | Smile |
| Mention | AtSign |
| Attachment | Paperclip |
| Send | Send |
| Discover | Sparkles |
| Create | Pencil |
| Find | Search |
| Brainstorm | Lightbulb |

## Note

Slack Kit (Slack's internal design system) is not open source. Block Kit Builder is the best visual reference for how Slack renders blocks. No public repo provides Slack's exact CSS.
