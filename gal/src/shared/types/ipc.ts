// ============================================================
// IPC communication types — Tauri invoke / event payloads
// ============================================================

import type { GameProject, SaveData } from './game';

// ---- Commands (Renderer → Rust) ----

/** Open the preview player window with the current project data */
export interface OpenPreviewPayload {
  gameData: GameProject;
}

/** Save project to disk */
export interface SaveProjectPayload {
  filePath?: string; // if omitted, save to current path
  gameData: GameProject;
}

/** Load project from disk */
export interface LoadProjectResult {
  filePath: string;
  gameData: GameProject;
}

/** Export the game as a standalone package */
export interface ExportGamePayload {
  gameData: GameProject;
  outputDir: string;
}

/** Save game progress */
export interface SaveGamePayload {
  slotIndex: number;
  label: string;
  currentSceneId: string;
  variables: Record<string, string | number | boolean>;
}

/** Load game progress */
export interface LoadGamePayload {
  slotIndex: number;
}

// ---- Events (Rust → Renderer) ----

/** Data pushed to the preview/player window on load */
export interface LoadGameDataEvent {
  data: GameProject;
}

/** Result of a save operation */
export interface SaveResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/** Result of an export operation */
export interface ExportResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

// ---- Tauri command signatures (for type-safe invoke) ----

export interface GalCommands {
  open_preview: (payload: OpenPreviewPayload) => Promise<void>;
  save_project: (payload: SaveProjectPayload) => Promise<SaveResult>;
  load_project: () => Promise<LoadProjectResult>;
  export_game: (payload: ExportGamePayload) => Promise<ExportResult>;
  save_game: (payload: SaveGamePayload) => Promise<SaveResult>;
  load_game: (payload: LoadGamePayload) => Promise<SaveData | null>;
}
