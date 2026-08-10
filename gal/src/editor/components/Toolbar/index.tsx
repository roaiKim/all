import { useCallback } from 'react';
import { Button, Space, message } from 'antd';
import {
  SaveOutlined,
  PlayCircleOutlined,
  ExportOutlined,
  FileAddOutlined,
  UndoOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { broadcastPreview } from '@shared/utils/broadcast';

/**
 * Top toolbar with main actions:
 * - New / Save / Preview / Export
 *
 * Preview modes:
 * - Tauri desktop: opens a new OS window (via Rust IPC)
 * - Browser dev:   sends data via BroadcastChannel to the player tab
 * - Fallback:       opens inline bottom panel
 */
export function Toolbar() {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const filePath = useProjectStore((s) => s.filePath);
  const loadDemo = useProjectStore((s) => s.loadDemo);
  const newProject = useProjectStore((s) => s.newProject);
  const getValidationErrors = useProjectStore((s) => s.getValidationErrors);
  const togglePreviewPanel = useEditorStore((s) => s.togglePreviewPanel);
  const toggleExportDialog = useEditorStore((s) => s.toggleExportDialog);

  const handleSave = useCallback(async () => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      message.warning(`项目存在 ${errors.length} 个问题，请检查后再保存`);
      return;
    }

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('save_project', {
        payload: { gameData: project, filePath },
      });
      if (result) {
        useProjectStore.getState().markClean();
        message.success('保存成功');
      }
    } catch {
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.meta.title || 'project'}.gal.json`;
      a.click();
      URL.revokeObjectURL(url);
      useProjectStore.getState().markClean();
      message.success('已导出为 JSON 文件');
    }
  }, [project, filePath, getValidationErrors]);

  const handlePreview = useCallback(async () => {
    // Strategy 1: Tauri desktop — open new OS window
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('open_preview', { gameData: project });
      message.success('已打开预览窗口');
      return;
    } catch {
      // Not in Tauri, try browser dev approaches
    }

    // Strategy 2: Browser dev — BroadcastChannel to player tab
    try {
      broadcastPreview(project);
      message.success(
        '已推送到播放器标签页！请打开 http://localhost:1420/player/index.html',
        3,
      );
      return;
    } catch {
      // BroadcastChannel not available (very old browser)
    }

    // Strategy 3: Fallback — inline bottom panel
    togglePreviewPanel(true);
    message.info('使用内置预览面板（建议打开播放器标签页以获得完整体验）');
  }, [project, togglePreviewPanel]);

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-left">
        <span className="editor-toolbar-title">GAL Editor</span>
        <span className="editor-toolbar-project-name">
          {project.meta.title}
          {isDirty && <span className="editor-toolbar-dirty"> ●</span>}
        </span>
      </div>

      <Space className="editor-toolbar-actions">
        <Button icon={<FileAddOutlined />} onClick={newProject} size="small">
          新建
        </Button>
        <Button icon={<UndoOutlined />} onClick={loadDemo} size="small">
          Demo
        </Button>
        <Button icon={<SaveOutlined />} onClick={handleSave} type="primary" size="small">
          保存 {isDirty && '*'}
        </Button>
        <Button icon={<PlayCircleOutlined />} onClick={handlePreview} size="small">
          预览
        </Button>
        <Button icon={<ExportOutlined />} onClick={() => toggleExportDialog(true)} size="small">
          导出
        </Button>
      </Space>
    </div>
  );
}
