import { useCallback } from 'react';
import { Button, List, Popconfirm, Empty, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { v4 as uuid } from 'uuid';
import type { Scene, SceneType } from '@shared/types/game';

const SCENE_TYPE_LABELS: Record<SceneType, string> = {
  video: '视频',
  dialogue: '对话',
  choice: '选择',
  branch: '分支',
  ending: '结局',
};

const SCENE_TYPE_COLORS: Record<SceneType, string> = {
  video: '#6b8cff',
  dialogue: '#52c41a',
  choice: '#faad14',
  branch: '#722ed1',
  ending: '#ff4d4f',
};

/**
 * StoryFlow — left sidebar scene list.
 * Displays all scenes in order with drag-to-reorder support.
 */
export function StoryFlow() {
  const scenes = useProjectStore((s) => s.project.scenes);
  const firstSceneId = useProjectStore((s) => s.project.meta.firstSceneId);
  const addScene = useProjectStore((s) => s.addScene);
  const removeScene = useProjectStore((s) => s.removeScene);
  const updateMeta = useProjectStore((s) => s.updateMeta);
  const selectedSceneId = useEditorStore((s) => s.selectedSceneId);
  const selectScene = useEditorStore((s) => s.selectScene);

  const handleAddScene = useCallback(() => {
    const newScene: Scene = {
      id: uuid(),
      name: `场景 ${scenes.length + 1}`,
      type: 'video',
      dialogue: [],
    };
    addScene(newScene);
    selectScene(newScene.id);

    // Auto-set as first scene if none
    if (!firstSceneId) {
      updateMeta({ firstSceneId: newScene.id });
    }

    message.success('已添加新场景');
  }, [scenes.length, firstSceneId, addScene, selectScene, updateMeta]);

  const handleSetFirst = useCallback(
    (sceneId: string) => {
      updateMeta({ firstSceneId: sceneId });
      message.success('已设置起始场景');
    },
    [updateMeta],
  );

  return (
    <div className="editor-story-flow">
      <div className="editor-story-flow-header">
        <span>场景 ({scenes.length})</span>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAddScene}>
          添加场景
        </Button>
      </div>

      {scenes.length === 0 ? (
        <Empty description="暂无场景" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          className="editor-scene-list"
          dataSource={scenes}
          renderItem={(scene) => (
            <List.Item
              className={`editor-scene-item ${selectedSceneId === scene.id ? 'selected' : ''} ${firstSceneId === scene.id ? 'is-first' : ''}`}
              onClick={() => selectScene(scene.id)}
              actions={[
                firstSceneId !== scene.id && (
                  <Button
                    key="set-first"
                    type="link"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetFirst(scene.id);
                    }}
                  >
                    设为起始
                  </Button>
                ),
                <Popconfirm
                  key="delete"
                  title="确定删除此场景？"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    removeScene(scene.id);
                    if (selectedSceneId === scene.id) selectScene(null);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <span
                    className="editor-scene-type-dot"
                    style={{ background: SCENE_TYPE_COLORS[scene.type] }}
                  />
                }
                title={
                  <span className="editor-scene-name">
                    {firstSceneId === scene.id && '▶ '}
                    {scene.name}
                  </span>
                }
                description={SCENE_TYPE_LABELS[scene.type]}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
