import { create } from 'zustand';
import type { GameProject, Scene, GameVariable, AssetItem } from '@shared/types/game';
import { createEmptyProject, createDemoProject } from '@shared/constants/defaults';
import { validateProject } from '@shared/utils/validation';

interface ProjectState {
  /** The current project data */
  project: GameProject;
  /** Whether the project has unsaved changes */
  isDirty: boolean;
  /** Current save path (undefined = never saved) */
  filePath: string | undefined;
  /** Whether we're in demo mode */
  isDemo: boolean;

  // Actions
  newProject: () => void;
  loadDemo: () => void;
  loadProject: (project: GameProject, filePath?: string) => void;
  updateMeta: (meta: Partial<GameProject['meta']>) => void;

  // Scene actions
  addScene: (scene: Scene) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  removeScene: (sceneId: string) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;

  // Variable actions
  addVariable: (variable: GameVariable) => void;
  updateVariable: (variableId: string, updates: Partial<GameVariable>) => void;
  removeVariable: (variableId: string) => void;

  // Asset actions
  addAsset: (type: 'videos' | 'images' | 'audios', asset: AssetItem) => void;
  removeAsset: (type: 'videos' | 'images' | 'audios', assetId: string) => void;

  // Utility
  markClean: () => void;
  getValidationErrors: () => import('@shared/utils/validation').ValidationError[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: createEmptyProject(),
  isDirty: false,
  filePath: undefined,
  isDemo: false,

  newProject: () => {
    set({ project: createEmptyProject(), isDirty: false, filePath: undefined, isDemo: false });
  },

  loadDemo: () => {
    set({ project: createDemoProject(), isDirty: false, filePath: undefined, isDemo: true });
  },

  loadProject: (project, filePath) => {
    set({ project, isDirty: false, filePath, isDemo: false });
  },

  updateMeta: (meta) => {
    set((s) => ({ project: { ...s.project, meta: { ...s.project.meta, ...meta, updatedAt: new Date().toISOString() } }, isDirty: true }));
  },

  // Scenes
  addScene: (scene) => {
    set((s) => {
      const scenes = [...s.project.scenes, scene];
      return { project: { ...s.project, scenes, meta: { ...s.project.meta, updatedAt: new Date().toISOString() } }, isDirty: true };
    });
  },

  updateScene: (sceneId, updates) => {
    set((s) => {
      const scenes = s.project.scenes.map((sc) => (sc.id === sceneId ? { ...sc, ...updates } : sc));
      return { project: { ...s.project, scenes, meta: { ...s.project.meta, updatedAt: new Date().toISOString() } }, isDirty: true };
    });
  },

  removeScene: (sceneId) => {
    set((s) => {
      const scenes = s.project.scenes.filter((sc) => sc.id !== sceneId);
      // Clear references to deleted scene
      const cleaned = scenes.map((sc) => ({
        ...sc,
        nextSceneId: sc.nextSceneId === sceneId ? undefined : sc.nextSceneId,
        choices: sc.choices?.filter((c) => c.nextSceneId !== sceneId).map((c) => (c.nextSceneId === sceneId ? { ...c, nextSceneId: '' } : c)),
      }));
      return { project: { ...s.project, scenes: cleaned, meta: { ...s.project.meta, updatedAt: new Date().toISOString() } }, isDirty: true };
    });
  },

  reorderScenes: (fromIndex, toIndex) => {
    set((s) => {
      const scenes = [...s.project.scenes];
      const [moved] = scenes.splice(fromIndex, 1);
      scenes.splice(toIndex, 0, moved);
      return { project: { ...s.project, scenes }, isDirty: true };
    });
  },

  // Variables
  addVariable: (variable) => {
    set((s) => ({ project: { ...s.project, variables: [...s.project.variables, variable] }, isDirty: true }));
  },

  updateVariable: (variableId, updates) => {
    set((s) => ({
      project: { ...s.project, variables: s.project.variables.map((v) => (v.id === variableId ? { ...v, ...updates } : v)) },
      isDirty: true,
    }));
  },

  removeVariable: (variableId) => {
    set((s) => ({ project: { ...s.project, variables: s.project.variables.filter((v) => v.id !== variableId) }, isDirty: true }));
  },

  // Assets
  addAsset: (type, asset) => {
    set((s) => ({
      project: { ...s.project, assets: { ...s.project.assets, [type]: [...s.project.assets[type], asset] } },
      isDirty: true,
    }));
  },

  removeAsset: (type, assetId) => {
    set((s) => ({
      project: { ...s.project, assets: { ...s.project.assets, [type]: s.project.assets[type].filter((a) => a.id !== assetId) } },
      isDirty: true,
    }));
  },

  // Utility
  markClean: () => set({ isDirty: false }),
  getValidationErrors: () => validateProject(get().project),
}));
