/**
 * Slack design tokens - single source of truth.
 * Based on: api.slack.com, Block Kit Builder, reference images.
 */

export const SLACK_TOKENS = {
  colors: {
    sidebar: "#4a154b",
    sidebarHover: "#350d36",
    activeItem: "#1164a3",
    text: "#1d1c1d",
    textSecondary: "#616061",
    border: "#e8e8e8",
    link: "#1264a3",
    primaryButton: "#2eb886",
    primaryButtonHover: "#269873",
    background: "#ffffff",
    backgroundAlt: "#f8f8f8",
    betaBadgeBg: "#e8f4fc",
    avatarBg: "#611f69",
  },
  typography: {
    body: "15px",
    bodyLineHeight: "1.46668",
    small: "13px",
    smaller: "12px",
    header: "18px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lato", sans-serif',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  radius: {
    button: 4,
    input: 8,
    pill: 9999,
    avatar: 4,
  },
  iconSizes: {
    sidebar: 20,
    sidebarSmall: 18,
    channelHeader: 16,
    inputToolbar: 14,
    inputActions: 16,
  },
} as const;

export type SlackTokens = typeof SLACK_TOKENS;
