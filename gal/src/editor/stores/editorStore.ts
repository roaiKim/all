import { create } from 'zustand';

interface EditorState {
  // Selection
  selectedSceneId: string | null;
  selectedTab: 'flow' | 'resources' | 'variables' | 'settings';

  // UI panels
  isExportDialogOpen: boolean;

  // Theme / preferences
  isDarkMode: boolean;

  // Actions
  selectScene: (sceneId: string | null) => void;
  setTab: (tab: EditorState['selectedTab']) => void;
  toggleExportDialog: (open?: boolean) => void;
  toggleDarkMode: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedSceneId: null,
  selectedTab: 'flow',
  isExportDialogOpen: false,
  isDarkMode: true,

  selectScene: (sceneId) => set({ selectedSceneId: sceneId }),
  setTab: (tab) => set({ selectedTab: tab }),
  toggleExportDialog: (open) => set((s) => ({ isExportDialogOpen: open ?? !s.isExportDialogOpen })),
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}));
