/**
 * Slack design tokens - single source of truth.
 * Based on pixel-perfect audit of reference images.
 */

export const SLACK_TOKENS = {
  colors: {
    // Sidebar
    iconBar: "#1a1d21", // Dark grey (Salesforce Activity reference)
    iconBarAlt: "#4a154b", // Purple (Slack DM reference)
    sidebarHover: "rgba(255, 255, 255, 0.1)",
    sidebarActive: "rgba(255, 255, 255, 0.15)",
    
    // Notifications
    notificationRed: "#e01e5a",
    notificationRedAlt: "#d92d20",
    
    // Text
    text: "#1d1c1d",
    textSecondary: "#616061",
    
    // Borders & Backgrounds
    border: "#e8e8e8",
    borderSubtle: "#d1d1d1",
    background: "#ffffff",
    backgroundAlt: "#f8f8f8",
    backgroundGrey: "#f0f0f0",
    backgroundGreyAlt: "#ebebeb",
    backgroundHover: "#e5e5e5",
    
    // Links & Buttons
    link: "#1264a3",
    activeItem: "#1264a3",
    primaryButton: "#2eb886",
    primaryButtonHover: "#269873",
    
    // Badges & Tags
    betaBadgeBg: "#e8f4fc",
    betaBadgeText: "#1264a3",
    
    // Avatars
    avatarBg: "#611f69",
    avatarBgVariants: ["#611f69", "#e01e5a", "#36c5f0", "#2eb886", "#ecb22e"],
  },
  
  typography: {
    // Font Family
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lato", sans-serif',
    
    // Sizes
    header: "18px",
    body: "15px",
    bodyLineHeight: "1.46668",
    medium: "14px",
    small: "13px",
    smaller: "12px",
    tiny: "11px",
    mini: "10px",
    
    // Weights
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
    weightBold: 700,
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
    // Left icon bar
    logo: 32,
    navIcon: 20,
    navIconPlus: 18,
    
    // Sidebar
    channelAvatar: 32,
    sidebarAction: 12,
    
    // Channel header
    channelHeader: 16,
    
    // Message feed
    messageAvatar: 36,
    
    // Input
    inputToolbar: 14,
    inputActions: 16,
    
    // Slackbot panel
    slackbotLogo: 24,
    slackbotHeader: 16,
    slackbotTab: 14,
    actionButton: 16,
    
    // Mascot
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
