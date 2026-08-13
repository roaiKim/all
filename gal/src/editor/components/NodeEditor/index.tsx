import { useCallback } from 'react';
import { Form, Input, Select, Button, Space, Divider, Empty, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { v4 as uuid } from 'uuid';
import type { Scene, Choice } from '@shared/types/game';

/**
 * NodeEditor — right sidebar panel for editing the selected scene's properties.
 * Shows when a scene is selected in the StoryFlow list.
 */
export function NodeEditor() {
  const project = useProjectStore((s) => s.project);
  const updateScene = useProjectStore((s) => s.updateScene);
  const removeScene = useProjectStore((s) => s.removeScene);
  const selectedSceneId = useEditorStore((s) => s.selectedSceneId);
  const selectScene = useEditorStore((s) => s.selectScene);

  const scene = project.scenes.find((s) => s.id === selectedSceneId);

  const handleFieldChange = useCallback(
    (field: keyof Scene, value: unknown) => {
      if (!selectedSceneId) return;
      updateScene(selectedSceneId, { [field]: value });
    },
    [selectedSceneId, updateScene],
  );

  const handleAddChoice = useCallback(() => {
    if (!scene) return;
    const newChoice: Choice = {
      id: uuid(),
      text: '新选项',
      nextSceneId: scene.nextSceneId || '',
    };
    const choices = [...(scene.choices ?? []), newChoice];
    updateScene(scene.id, { choices } as Partial<Scene>);
  }, [scene, updateScene]);

  const handleUpdateChoice = useCallback(
    (choiceId: string, field: keyof Choice, value: string) => {
      if (!scene?.choices) return;
      const choices = scene.choices.map((c) => (c.id === choiceId ? { ...c, [field]: value } : c));
      updateScene(scene.id, { choices } as Partial<Scene>);
    },
    [scene, updateScene],
  );

  const handleRemoveChoice = useCallback(
    (choiceId: string) => {
      if (!scene?.choices) return;
      const choices = scene.choices.filter((c) => c.id !== choiceId);
      updateScene(scene.id, { choices } as Partial<Scene>);
    },
    [scene, updateScene],
  );

  const handleAddDialogue = useCallback(() => {
    if (!scene) return;
    const dialogue = [...(scene.dialogue ?? []), { speaker: '', text: '' }];
    updateScene(scene.id, { dialogue } as Partial<Scene>);
  }, [scene, updateScene]);

  const handleUpdateDialogue = useCallback(
    (index: number, field: 'speaker' | 'text', value: string) => {
      if (!scene?.dialogue) return;
      const dialogue = scene.dialogue.map((d, i) => (i === index ? { ...d, [field]: value } : d));
      updateScene(scene.id, { dialogue } as Partial<Scene>);
    },
    [scene, updateScene],
  );

  const handleRemoveDialogue = useCallback(
    (index: number) => {
      if (!scene?.dialogue) return;
      const dialogue = scene.dialogue.filter((_, i) => i !== index);
      updateScene(scene.id, { dialogue } as Partial<Scene>);
    },
    [scene, updateScene],
  );

  if (!scene) {
    return (
      <div className="editor-node-editor">
        <Empty description="选择一个场景进行编辑" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div className="editor-node-editor">
      <div className="editor-node-editor-header">
        <h3>场景属性</h3>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => {
            removeScene(scene.id);
            selectScene(null);
          }}
        />
      </div>

      <div className="editor-node-editor-body">
        <Form layout="vertical" size="small">
          <Form.Item label="场景名称">
            <Input value={scene.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
          </Form.Item>

          <Form.Item label="类型">
            <Select
              value={scene.type}
              onChange={(v) => handleFieldChange('type', v)}
              options={[
                { label: '视频', value: 'video' },
                { label: '对话', value: 'dialogue' },
                { label: '选择', value: 'choice' },
                { label: '分支', value: 'branch' },
                { label: '结局', value: 'ending' },
              ]}
            />
          </Form.Item>

          {(scene.type === 'video' || scene.type === 'choice') && (
            <Form.Item label="视频路径">
              <Input
                value={scene.videoSrc ?? ''}
                onChange={(e) => handleFieldChange('videoSrc', e.target.value || undefined)}
                placeholder="assets/videos/xxx.mp4"
              />
            </Form.Item>
          )}

          <Form.Item label="背景图片">
            <Input
              value={scene.background ?? ''}
              onChange={(e) => handleFieldChange('background', e.target.value || undefined)}
              placeholder="assets/images/bg.png"
            />
          </Form.Item>

          <Form.Item label="BGM路径">
            <Input
              value={scene.bgm ?? ''}
              onChange={(e) => handleFieldChange('bgm', e.target.value || undefined)}
              placeholder="assets/audio/bgm.mp3"
            />
          </Form.Item>

          {scene.type !== 'ending' && (
            <Form.Item label="下一场景">
              <Select
                value={scene.nextSceneId ?? undefined}
                onChange={(v) => handleFieldChange('nextSceneId', v || undefined)}
                allowClear
                placeholder="线性跳转目标（可选）"
                options={project.scenes
                  .filter((s) => s.id !== scene.id)
                  .map((s) => ({ label: s.name, value: s.id }))}
              />
            </Form.Item>
          )}
        </Form>

        <Divider />

        {/* Dialogue editor */}
        <div className="editor-node-section">
          <div className="editor-node-section-header">
            <span>对话</span>
            <Button type="dashed" icon={<PlusOutlined />} size="small" onClick={handleAddDialogue}>
              添加
            </Button>
          </div>
          {(scene.dialogue ?? []).map((d, i) => (
            <div key={i} className="editor-node-dialogue-item">
              <Input
                placeholder="说话人"
                value={d.speaker}
                onChange={(e) => handleUpdateDialogue(i, 'speaker', e.target.value)}
                size="small"
              />
              <Input.TextArea
                placeholder="对话内容"
                value={d.text}
                onChange={(e) => handleUpdateDialogue(i, 'text', e.target.value)}
                size="small"
                rows={2}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveDialogue(i)}
              />
            </div>
          ))}
        </div>

        <Divider />

        {/* Choices editor */}
        <div className="editor-node-section">
          <div className="editor-node-section-header">
            <span>选项</span>
            <Button type="dashed" icon={<PlusOutlined />} size="small" onClick={handleAddChoice}>
              添加
            </Button>
          </div>
          {(scene.choices ?? []).map((choice) => (
            <div key={choice.id} className="editor-node-choice-item">
              <Input
                placeholder="选项文本"
                value={choice.text}
                onChange={(e) => handleUpdateChoice(choice.id, 'text', e.target.value)}
                size="small"
              />
              <Select
                placeholder="跳转到场景"
                value={choice.nextSceneId || undefined}
                onChange={(v) => handleUpdateChoice(choice.id, 'nextSceneId', v || '')}
                size="small"
                options={project.scenes
                  .filter((s) => s.id !== scene.id)
                  .map((s) => ({ label: s.name, value: s.id }))}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveChoice(choice.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
