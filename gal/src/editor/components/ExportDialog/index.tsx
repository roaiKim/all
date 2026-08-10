import { useState, useCallback } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';

/**
 * ExportDialog — export the game as a standalone package.
 * Uses Tauri's save dialog when available, falls back to JSON download.
 */
export function ExportDialog() {
  const project = useProjectStore((s) => s.project);
  const getValidationErrors = useProjectStore((s) => s.getValidationErrors);
  const toggleExportDialog = useEditorStore((s) => s.toggleExportDialog);
  const [exportFormat, setExportFormat] = useState<'json' | 'standalone'>('json');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    // Validate
    const errors = getValidationErrors();
    if (errors.length > 0) {
      message.error(`项目存在 ${errors.length} 个问题，无法导出。请先修复。`);
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === 'json') {
        // Download as JSON
        const blob = new Blob([JSON.stringify(project, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.meta.title || 'game'}.gal.json`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('已导出 JSON 文件');
      } else {
        // Tauri standalone export
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          await invoke('export_game', { gameData: project });
          message.success('导出成功');
        } catch {
          message.warning('桌面端导出需要在 Tauri 环境下运行');
        }
      }
      toggleExportDialog(false);
    } catch (err) {
      message.error('导出失败: ' + String(err));
    } finally {
      setIsExporting(false);
    }
  }, [project, exportFormat, getValidationErrors, toggleExportDialog]);

  return (
    <Modal
      title="导出游戏"
      open
      onCancel={() => toggleExportDialog(false)}
      footer={[
        <Button key="cancel" onClick={() => toggleExportDialog(false)}>
          取消
        </Button>,
        <Button key="export" type="primary" loading={isExporting} onClick={handleExport}>
          导出
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="导出格式">
          <Select
            value={exportFormat}
            onChange={setExportFormat}
            options={[
              { label: 'JSON 剧本文件（可用编辑器再次导入）', value: 'json' },
              { label: '独立可执行文件（Tauri 桌面端）', value: 'standalone' },
            ]}
          />
        </Form.Item>

        <Form.Item label="项目信息">
          <div style={{ color: '#888', fontSize: 13 }}>
            标题: {project.meta.title}
            <br />
            场景数: {project.scenes.length}
            <br />
            变量数: {project.variables.length}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
