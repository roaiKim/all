import { useCallback } from 'react';
import { Button, Space, message, Tooltip } from 'antd';
import {
  SaveOutlined,
  ExportOutlined,
  FileAddOutlined,
  UndoOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';

/**
 * Top toolbar with main actions:
 * - New / Demo / Save / Export
 *
 * 预览已内嵌在右侧面板（实时同步），无需按钮。
 * 「全屏试玩」按钮用于在独立窗口中以完整播放器体验游戏（可选）。
 */
export function Toolbar() {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const filePath = useProjectStore((s) => s.filePath);
  const loadDemo = useProjectStore((s) => s.loadDemo);
  const newProject = useProjectStore((s) => s.newProject);
  const getValidationErrors = useProjectStore((s) => s.getValidationErrors);
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

  // 可选：在独立 Tauri 窗口中全屏试玩（完整播放器 UI）
  const handleFullscreenPreview = useCallback(async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('open_preview', { gameData: project });
    } catch {
      message.info('全屏试玩需要在 Tauri 桌面环境（yarn tauri dev）');
    }
  }, [project]);

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
        <Tooltip title="在独立窗口中全屏试玩（完整播放器）">
          <Button icon={<PlayCircleOutlined />} onClick={handleFullscreenPreview} size="small">
            全屏试玩
          </Button>
        </Tooltip>
        <Button icon={<ExportOutlined />} onClick={() => toggleExportDialog(true)} size="small">
          导出
        </Button>
      </Space>
    </div>
  );
}
