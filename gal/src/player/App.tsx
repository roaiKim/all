import { useEffect, useState, useCallback, useRef } from 'react';
import type { GameProject, GameState, Scene } from '@shared/types/game';
import { createDemoProject } from '@shared/constants/defaults';
import { listenForPreview } from '@shared/utils/broadcast';
import { GameEngine } from './engine/GameEngine';
import { VideoPlayer } from './components/VideoPlayer';
import { ChoicePanel } from './components/ChoicePanel';
import { DialogueBox } from './components/DialogueBox';
import { SaveLoadPanel } from './components/SaveLoadPanel';
import { SettingsPanel } from './components/SettingsPanel';

/**
 * Player App — the runtime that plays a GAL game.
 *
 * Three data sources (priority order):
 * 1. Tauri IPC event  — `listen('load-game-data')`       (desktop dev: yar tauri dev)
 * 2. BroadcastChannel — `listenForPreview()`              (browser dev: 双标签页)
 * 3. Demo project     — `createDemoProject()`             (fallback: 独立打开播放器标签页)
 *
 * Dev workflow:
 *   yarn dev
 *   → 打开 http://localhost:1420/editor/index.html  (编辑器标签页)
 *   → 打开 http://localhost:1420/player/index.html  (播放器标签页)
 *   → 编辑器修改场景 → 点"推送预览" → 播放器实时热加载
 *   → 两个标签页各自 HMR，改编辑器代码和播放器代码都即时生效
 */
function App() {
  const [project, setProject] = useState<GameProject | null>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Track data source for UI indicator
  const [dataSource, setDataSource] = useState<'idle' | 'tauri' | 'broadcast' | 'demo'>('idle');

  // Initialize: try Tauri → try BroadcastChannel → fallback to demo
  useEffect(() => {
    let tauriUnlisten: (() => void) | undefined;
    let broadcastUnlisten: (() => void) | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const init = async () => {
      // ---- Source 1: Tauri IPC (desktop dev) ----
      try {
        const { listen } = await import('@tauri-apps/api/event');
        tauriUnlisten = await listen<{ data: GameProject }>('load-game-data', (event) => {
          setDataSource('tauri');
          setProject(event.payload.data);
        });
        // Tauri is available — don't auto-load demo, wait for editor to push
        return;
      } catch {
        // Not in Tauri — try browser sources
      }

      // ---- Source 2: BroadcastChannel (browser dual-tab dev) ----
      broadcastUnlisten = listenForPreview((gameData) => {
        setDataSource('broadcast');
        // Clear fallback timer since we got data from editor
        if (fallbackTimer) clearTimeout(fallbackTimer);
        setProject(gameData);
      });

      // ---- Source 3: Demo fallback (after a short wait) ----
      // Give BroadcastChannel a moment to receive data from an already-open editor tab.
      // If nothing arrives, load the demo so the player has something to show.
      fallbackTimer = setTimeout(() => {
        if (dataSource === 'idle') {
          setDataSource('demo');
          setProject(createDemoProject());
        }
      }, 500);
    };

    init();

    return () => {
      tauriUnlisten?.();
      broadcastUnlisten?.();
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  // When project is ready, initialize the engine
  useEffect(() => {
    if (!project) return;

    const gameEngine = new GameEngine(project);
    setEngine(gameEngine);

    const unsubscribe = gameEngine.subscribe((state) => {
      setGameState(state);
      const scene = gameEngine.getCurrentScene();
      setCurrentScene(scene ?? null);
    });

    // Auto-start
    gameEngine.start();

    return () => {
      unsubscribe();
      gameEngine.destroy();
    };
  }, [project]);

  // ---- Handlers ----

  const handleChoiceSelected = useCallback(
    (choiceId: string) => {
      engine?.selectChoice(choiceId);
    },
    [engine],
  );

  const handleNext = useCallback(() => {
    engine?.advance();
  }, [engine]);

  const handleSave = useCallback(
    async (slotIndex: number, label: string) => {
      if (!engine) return;
      const saveData = engine.createSaveData(slotIndex, label);
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('save_game', { payload: saveData });
      } catch {
        // Fallback: localStorage
        localStorage.setItem(`gal_save_${slotIndex}`, JSON.stringify(saveData));
      }
    },
    [engine],
  );

  const handleLoad = useCallback(
    async (slotIndex: number) => {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const saveData = await invoke('load_game', { payload: { slotIndex } });
        if (saveData && engine) {
          engine.loadFromSave(saveData);
        }
      } catch {
        // Fallback: localStorage
        const raw = localStorage.getItem(`gal_save_${slotIndex}`);
        if (raw && engine) {
          engine.loadFromSave(JSON.parse(raw));
        }
      }
      setShowSaveLoad(false);
    },
    [engine],
  );

  // ---- Render ----

  if (!project || !gameState) {
    const loadingMessages: Record<string, string> = {
      idle: '等待数据...\n请打开编辑器标签页并点击"推送预览"',
      tauri: '等待编辑器推送数据...',
      broadcast: '正在接收编辑器数据...',
      demo: '加载 Demo 中...',
    };
    return (
      <div className="player-loading">
        <div className="player-loading-text" style={{ whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.8 }}>
          {loadingMessages[dataSource] ?? '加载中...'}
        </div>
        <div className="player-loading-hint">
          {dataSource === 'idle' && (
            <span>编辑器地址：<code>localhost:1420/editor/index.html</code></span>
          )}
        </div>
      </div>
    );
  }

  const isVideoScene = currentScene?.type === 'video' || currentScene?.type === 'choice';
  const showChoices = currentScene?.choices && currentScene.choices.length > 0 && !gameState.isPaused;

  return (
    <div className="player-container">
      {/* Video layer */}
      {isVideoScene && currentScene?.videoSrc && (
        <VideoPlayer
          src={currentScene.videoSrc}
          subtitles={currentScene.subtitles}
          onEnded={handleNext}
          paused={gameState.isPaused}
        />
      )}

      {/* Dialogue layer (for non-video scenes) */}
      {!isVideoScene && currentScene?.dialogue && (
        <div className="player-dialogue-area">
          {currentScene.background && (
            <img className="player-background" src={currentScene.background} alt="" />
          )}
          <DialogueBox
            lines={currentScene.dialogue}
            onComplete={handleNext}
          />
        </div>
      )}

      {/* Subtitles overlay (rendered inside VideoPlayer, but fallback here) */}
      {isVideoScene && currentScene?.dialogue && (
        <DialogueBox
          lines={currentScene.dialogue}
          onComplete={handleNext}
        />
      )}

      {/* Choice panel */}
      {showChoices && currentScene?.choices && (
        <ChoicePanel
          choices={currentScene.choices}
          variables={gameState.variables}
          onSelect={handleChoiceSelected}
        />
      )}

      {/* Ending screen */}
      {currentScene?.type === 'ending' && (
        <div className="player-ending">
          <div className="player-ending-text">— 完 —</div>
          <button className="player-ending-btn" onClick={() => engine?.start()}>
            重新开始
          </button>
        </div>
      )}

      {/* HUD controls */}
      <div className="player-hud">
        {/* Dev mode indicator */}
        <div className="player-hud-source" title={`数据来源: ${dataSource}`}>
          {dataSource === 'broadcast' && '📡 实时'}
          {dataSource === 'demo' && '📦 Demo'}
          {dataSource === 'tauri' && '🖥️ 桌面'}
        </div>
        <div className="player-hud-spacer" />
        <button
          className="player-hud-btn"
          onClick={() => setShowSaveLoad(true)}
          title="存档/读档"
        >
          💾
        </button>
        <button
          className="player-hud-btn"
          onClick={() => setShowSettings(true)}
          title="设置"
        >
          ⚙️
        </button>
      </div>

      {/* Modals */}
      {showSaveLoad && (
        <SaveLoadPanel
          saves={engine?.getAllSaves() ?? []}
          onSave={handleSave}
          onLoad={handleLoad}
          onClose={() => setShowSaveLoad(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;
