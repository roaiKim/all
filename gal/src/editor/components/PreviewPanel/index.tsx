import { useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { GameEngine } from '../../../player/engine/GameEngine';
import type { GameState, Scene } from '@shared/types/game';

/**
 * PreviewPanel — in-editor preview of the game.
 * Runs the GameEngine in a bottom drawer panel.
 */
export function PreviewPanel() {
  const project = useProjectStore((s) => s.project);
  const togglePreviewPanel = useEditorStore((s) => s.togglePreviewPanel);

  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);

  // Initialize engine
  useEffect(() => {
    const ge = new GameEngine(project);
    setEngine(ge);

    const unsub = ge.subscribe((state) => {
      setGameState(state);
      setCurrentScene(ge.getCurrentScene() ?? null);
    });

    ge.start();

    return () => {
      unsub();
      ge.destroy();
    };
  }, [project]);

  const handleChoice = (choiceId: string) => {
    engine?.selectChoice(choiceId);
  };

  const handleAdvance = () => {
    engine?.advance();
  };

  return (
    <div className="editor-preview-panel">
      <div className="editor-preview-header">
        <span>预览</span>
        <div>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => {
              engine?.start();
            }}
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => togglePreviewPanel(false)}
          />
        </div>
      </div>

      <div className="editor-preview-body">
        {!gameState?.isPlaying && gameState ? (
          <div className="editor-preview-ending">
            <p>游戏结束</p>
            <Button onClick={() => engine?.start()}>重新开始</Button>
          </div>
        ) : (
          <div className="editor-preview-scene">
            <div className="editor-preview-scene-info">
              当前场景: {currentScene?.name ?? '—'}
              <span className="editor-preview-scene-type">[{currentScene?.type}]</span>
            </div>

            {/* Dialogue preview */}
            {currentScene?.dialogue && (
              <div className="editor-preview-dialogue">
                {currentScene.dialogue.map((d, i) => (
                  <div key={i} className="editor-preview-dialogue-line">
                    <strong>{d.speaker}:</strong> {d.text}
                  </div>
                ))}
              </div>
            )}

            {/* Choices preview */}
            {currentScene?.choices && currentScene.choices.length > 0 && (
              <div className="editor-preview-choices">
                {currentScene.choices.map((c) => (
                  <Button
                    key={c.id}
                    block
                    onClick={() => handleChoice(c.id)}
                    style={{ marginBottom: 8 }}
                  >
                    {c.text}
                  </Button>
                ))}
              </div>
            )}

            {/* Advance button */}
            {!currentScene?.choices?.length && currentScene?.type !== 'ending' && (
              <Button type="primary" block onClick={handleAdvance}>
                继续 ▶
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
