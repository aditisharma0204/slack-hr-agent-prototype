import { GENERIC_GLOBAL_DMS, ExtendedDemoDM } from '../components/presentation/GlobalDMsView';
import type { NavView } from '@/app/(demo)/demo/workspace/[workspaceId]/_context/demo-layout-context';
import type { DemoChannel } from '@/context/DemoDataContext';

/**
 * Sidebar app configuration
 */
export interface SidebarApp {
  id: string;
  name: string;
  icon: string;
}

/**
 * Arc-specific UI and data payload configuration.
 * Drives the actual UI state, DM lists, and navigation for each arc.
 */
export interface ArcPayloadConfig {
  defaultNavId: NavView;
  sidebarDms: ExtendedDemoDM[];
  sidebarChannels?: DemoChannel[];
  sidebarApps?: SidebarApp[];
  botScriptId?: string;
  allowedTabs?: NavView[];
}

/**
 * Metadata for a single template entry.
 */
export interface TemplateMetadata {
  id: string;
  title: string;
  description: string;
  payload: ArcPayloadConfig;
}

/**
 * Simplified metadata for the boilerplate shell.
 * Designers can add new entries here when building new concepts.
 */
export const DEMO_METADATA: TemplateMetadata[] = [
  {
    id: 'template',
    title: 'Slack App Shell Boilerplate',
    description: 'A clean slate for designing new Slack integrations.',
    payload: {
      defaultNavId: 'today',
      sidebarDms: GENERIC_GLOBAL_DMS,
    },
  },
];
