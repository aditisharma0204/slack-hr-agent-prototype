/**
 * Slack design tokens - from Figma design system (node 803:59733).
 * Source: Figma MCP get_variable_defs.
 */

export const SLACK_TOKENS = {
  colors: {
    // From Figma: 🌞Light/Primary, Content
    text: "#1D1C1D",
    textSecondary: "#616061", // Max Contrast Gray
    textTertiary: "#7c7a7f", // Core Content Tertiary
    textHighlight: "#454447", // Core Content Secondary

    // From Figma / Reference: Left icon bar is DARK GREY
    iconBar: "#1a1d21", // Dark grey (left nav strip)
    // Theme purple for avatars, accents
    sidebar: "#611f69", // Window BG Primary (channel avatars)
    sidebarDark: "#39063a", // Window BG Secondary
    sidebarHover: "rgba(255, 255, 255, 0.1)",
    sidebarActive: "rgba(255, 255, 255, 0.15)",
    themeImportant: "#4a154b", // Content Important
    themeBase: "#eabdfb", // Base Important
    themeSurface: "#F9EDFF", // Inverse Primary

    // From Figma: Core
    background: "#FFFFFF",
    backgroundAlt: "#f8f8f8", // Base Secondary
    activitySidebar: "#f5f5f5", // Light grey for Activity panel (matches reference)
    border: "#e8e8e8",
    borderSecondary: "#5e5d6073",
    borderTertiary: "#5E5D60",

    // From Figma: Links & Buttons
    link: "#1264a3", // Content Highlight 1
    primaryButton: "#20a271", // Inverse Highlight 2 (Figma green)
    primaryButtonHover: "#1a8a5f",

    // Notifications
    notificationRed: "#e01e5a",

    // Badges & Avatars
    betaBadgeBg: "#e8f4fc",
    betaBadgeText: "#1264a3",
    avatarBg: "#611f69",
    avatarBgVariants: ["#611f69", "#e01e5a", "#36c5f0", "#2eb886", "#ecb22e"],
  },

  typography: {
    fontFamily: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    // From Figma: Body - Regular
    body: "15px",
    bodyLineHeight: "22px",
    bodyWeight: 400,

    // From Figma: Caption
    caption: "13px",
    captionLineHeight: "18px",

    // From Figma: Micro
    micro: "12px",
    microLineHeight: "18px",

    // Sizes
    header: "18px",
    title: "22px",
    medium: "14px",
    small: "13px",
    smaller: "12px",

    // Weights
    weightRegular: 400,
    weightMedium: 500,
    weightBold: 700,
    weightBlack: 900,
  },

  shadows: {
    // From Figma: Level 1 - Button Shadow
    button: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
    // From Figma: Level 2 - Menu Shadow
    menu: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
    // From Figma: Level 3 - Modal Shadow
    modal: "0 18px 48px 0 rgba(0, 0, 0, 0.1)",
  },

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 6,
    md: 8,
    base: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
  },

  radius: {
    subtle: 3,
    small: 4,
    medium: 6,
    large: 8,
    pill: 9999,
    avatar: 4,
    button: 4,
    input: 8,
  },

  iconSizes: {
    logo: 32,
    navIcon: 20,
    navIconPlus: 18,
    channelAvatar: 32,
    sidebarAction: 12,
    channelHeader: 16,
    messageAvatar: 36,
    inputToolbar: 14,
    inputActions: 16,
    slackbotLogo: 24,
    slackbotHeader: 16,
    slackbotTab: 14,
    actionButton: 16,
    mascot: 120,
  },

  dimensions: {
    iconBarWidth: 60,
    sidebarWidth: 260,
    channelHeaderHeight: 49,
    slackbotPanelMinWidth: 300,
    slackbotPanelMaxWidth: 480,
    notificationBadge: 18,
    avatarProfile: 32,
    avatarChannel: 32,
    avatarMessage: 36,
  },
} as const;

export type SlackTokens = typeof SLACK_TOKENS;
