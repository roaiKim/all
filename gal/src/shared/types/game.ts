// ============================================================
// Game Project Data Model — the canonical format for GAL scripts
// ============================================================

/** Top-level project container */
export interface GameProject {
  meta: ProjectMeta;
  scenes: Scene[];
  variables: GameVariable[];
  assets: AssetManifest;
}

export interface ProjectMeta {
  title: string;
  version: string;
  author: string;
  resolution: Resolution;
  firstSceneId: string; // entry point
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

export interface Resolution {
  width: number;
  height: number;
}

// ---- Scene ----

export interface Scene {
  id: string;
  name: string;
  type: SceneType;
  /** Path to video file (relative to project assets dir). Required for video/choice types. */
  videoSrc?: string;
  /** Timed subtitles overlaid on video */
  subtitles?: Subtitle[];
  /** Static dialogue (no video). For 'dialogue' type. */
  dialogue?: DialogueLine[];
  /** Branching choices (displayed at end of video or after dialogue) */
  choices?: Choice[];
  /** Linear next scene (if no choices) */
  nextSceneId?: string;
  /** Conditions that must be met before this scene can be entered */
  conditions?: Condition[];
  /** Effects applied when entering this scene */
  effects?: Effect[];
  /** Background music to play during this scene */
  bgm?: string;
  /** Background image (for non-video scenes) */
  background?: string;
}

export type SceneType = 'video' | 'dialogue' | 'choice' | 'branch' | 'ending';

export interface Subtitle {
  startTime: number; // seconds
  endTime: number;
  text: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  avatar?: string; // path to speaker portrait
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  /** Conditions that must be met for this choice to appear */
  conditions?: Condition[];
  /** Effects applied when this choice is selected */
  effects?: Effect[];
}

// ---- Logic ----

export interface Condition {
  variableId: string;
  operator: ConditionOperator;
  value: VariableValue;
}

export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';

export interface Effect {
  variableId: string;
  action: EffectAction;
  value: VariableValue;
}

export type EffectAction = 'set' | 'add' | 'toggle';

// ---- Variables ----

export interface GameVariable {
  id: string;
  name: string; // display name
  key: string; // programmatic key (e.g. "affection_score")
  type: VariableType;
  defaultValue: VariableValue;
}

export type VariableType = 'number' | 'boolean' | 'string';
export type VariableValue = string | number | boolean;

// ---- Assets ----

export interface AssetManifest {
  videos: AssetItem[];
  images: AssetItem[];
  audios: AssetItem[];
}

export interface AssetItem {
  id: string;
  name: string;
  path: string; // relative to project root
  size: number; // bytes
  mimeType?: string;
}

// ---- Save / Load ----

export interface SaveData {
  id: string;
  slotIndex: number;
  timestamp: string;
  thumbnail?: string; // base64 screenshot
  currentSceneId: string;
  variables: Record<string, VariableValue>;
  label: string; // user-editable label
}

// ---- Game state at runtime ----

export interface GameState {
  currentSceneId: string;
  variables: Record<string, VariableValue>;
  history: string[]; // stack of visited scene IDs
  isPlaying: boolean;
  isPaused: boolean;
}
