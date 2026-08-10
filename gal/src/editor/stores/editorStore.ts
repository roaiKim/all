import { create } from 'zustand';

interface EditorState {
  // Selection
  selectedSceneId: string | null;
  selectedTab: 'flow' | 'resources' | 'variables' | 'settings';

  // UI panels
  isNodeEditorOpen: boolean;
  isPreviewPanelOpen: boolean;
  isExportDialogOpen: boolean;

  // Theme / preferences
  isDarkMode: boolean;

  // Actions
  selectScene: (sceneId: string | null) => void;
  setTab: (tab: EditorState['selectedTab']) => void;
  toggleNodeEditor: (open?: boolean) => void;
  togglePreviewPanel: (open?: boolean) => void;
  toggleExportDialog: (open?: boolean) => void;
  toggleDarkMode: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedSceneId: null,
  selectedTab: 'flow',
  isNodeEditorOpen: true,
  isPreviewPanelOpen: false,
  isExportDialogOpen: false,
  isDarkMode: true,

  selectScene: (sceneId) => set({ selectedSceneId: sceneId }),
  setTab: (tab) => set({ selectedTab: tab }),
  toggleNodeEditor: (open) => set((s) => ({ isNodeEditorOpen: open ?? !s.isNodeEditorOpen })),
  togglePreviewPanel: (open) => set((s) => ({ isPreviewPanelOpen: open ?? !s.isPreviewPanelOpen })),
  toggleExportDialog: (open) => set((s) => ({ isExportDialogOpen: open ?? !s.isExportDialogOpen })),
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}));
