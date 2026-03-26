import type { StoryConfig } from "@/context/DemoDataContext";
import { hrStoryConfig } from "./hr-story";
import { cornerstoneStoryConfig } from "./cornerstone-story";

export interface EpicEntry {
  id: string;
  label: string;
  description: string;
  config: StoryConfig;
}

export const EPICS: EpicEntry[] = [
  {
    id: "hr",
    label: "HR Service Agent",
    description: "Employee Performance Management",
    config: hrStoryConfig,
  },
  {
    id: "cornerstone",
    label: "Cornerstone OnDemand",
    description: "Career development & team overview",
    config: cornerstoneStoryConfig,
  },
];

export const DEFAULT_EPIC_ID = "hr";

export function getEpicById(id: string): EpicEntry | undefined {
  return EPICS.find((e) => e.id === id);
}
