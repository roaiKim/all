import { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import {
  PlayCircleOutlined,
  ReloadOutlined,
  PauseOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { GameEngine } from '../../../player/engine/GameEngine';
import type { GameState, Scene } from '@shared/types/game';

/**
 * PreviewPanel — live preview embedded in the editor (right sidebar).
 *
 * Like 剪映's preview window: edit on the left, see the result immediately.
 *
 * Behavior:
 * - Watches the project store; on any change, debounce 300ms then hot-reload
 *   the engine via GameEngine.reloadProject() (preserves progress).
 * - "从头开始" button restarts from the first scene.
 * - "当前场景" button jumps to the scene selected in the editor.
 */
export function PreviewPanel() {
  const project = useProjectStore((s) => s.project);
  const selectedSceneId = useEditorStore((s) => s.selectedSceneId);

  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Debounce timer for hot-reload
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep latest engine in a ref so debounced reload uses it
  const engineRef = useRef<GameEngine | null>(null);

  // Initialize engine once
  useEffect(() => {
    const ge = new GameEngine(project);
    engineRef.current = ge;
    setEngine(ge);

    const unsub = ge.subscribe((state) => {
      setGameState(state);
      setCurrentScene(ge.getCurrentScene() ?? null);
    });

    ge.start();

    return () => {
      unsub();
      ge.destroy();
      engineRef.current = null;
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hot-reload on project change (debounced)
  useEffect(() => {
    if (!engineRef.current) return;

    // Visual feedback: show "syncing"
    setIsSyncing(true);
    if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);

    reloadTimerRef.current = setTimeout(() => {
      engineRef.current?.reloadProject(project);
      setIsSyncing(false);
    }, 300);

    return () => {
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    };
  }, [project]);

  // Restart from first scene
  const handleRestart = useCallback(() => {
    engineRef.current?.start();
  }, []);

  // Jump to the currently selected scene
  const handleJumpToSelected = useCallback(() => {
    if (selectedSceneId) {
      engineRef.current?.jumpTo(selectedSceneId);
    }
  }, [selectedSceneId]);

  // Play / pause
  const handleTogglePause = useCallback(() => {
    engineRef.current?.togglePause();
  }, []);

  // Choice / advance handlers
  const handleChoice = useCallback((choiceId: string) => {
    engineRef.current?.selectChoice(choiceId);
  }, []);

  const handleAdvance = useCallback(() => {
    engineRef.current?.advance();
  }, []);

  return (
    <div className="editor-preview-panel">
      {/* Header with controls */}
      <div className="editor-preview-header">
        <span className="editor-preview-title">
          预览 {isSyncing && <span className="editor-preview-syncing">同步中…</span>}
        </span>
        <div className="editor-preview-actions">
          <Tooltip title="从头开始">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleRestart}
            />
          </Tooltip>
          <Tooltip title="从当前选中场景开始">
            <Button
              type="text"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={handleJumpToSelected}
              disabled={!selectedSceneId}
            />
          </Tooltip>
          <Tooltip title="暂停/继续">
            <Button
              type="text"
              size="small"
              icon={gameState?.isPaused ? <PlayCircleOutlined /> : <PauseOutlined />}
              onClick={handleTogglePause}
            />
          </Tooltip>
        </div>
      </div>

      {/* Preview body */}
      <div className="editor-preview-body">
        {/* Current scene info bar */}
        <div className="editor-preview-scene-info">
          <span className="editor-preview-scene-name">{currentScene?.name ?? '—'}</span>
          <span className="editor-preview-scene-type">[{currentScene?.type}]</span>
        </div>

        {!gameState?.isPlaying && gameState ? (
          <div className="editor-preview-ending">
            <p>— 完 —</p>
            <Button size="small" onClick={handleRestart}>
              重新开始
            </Button>
          </div>
        ) : (
          <div className="editor-preview-scene">
            {/* Video placeholder (real video in full player) */}
            {currentScene?.videoSrc && (
              <div className="editor-preview-video-box">
                <span>🎬 {currentScene.videoSrc}</span>
              </div>
            )}

            {/* Dialogue preview */}
            {currentScene?.dialogue && currentScene.dialogue.length > 0 && (
              <div className="editor-preview-dialogue">
                {currentScene.dialogue.map((d, i) => (
                  <div key={i} className="editor-preview-dialogue-line">
                    <strong>{d.speaker}:</strong> {d.text}
                  </div>
                ))}
              </div>
            )}

            {/* Choices */}
            {currentScene?.choices && currentScene.choices.length > 0 && (
              <div className="editor-preview-choices">
                {currentScene.choices.map((c) => (
                  <Button key={c.id} block size="small" onClick={() => handleChoice(c.id)}>
                    {c.text}
                  </Button>
                ))}
              </div>
            )}

            {/* Advance button */}
            {!currentScene?.choices?.length && currentScene?.type !== 'ending' && (
              <Button
                type="primary"
                block
                size="small"
                icon={<StepForwardOutlined />}
                onClick={handleAdvance}
              >
                继续
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
