import type { GameProject } from '../types/game';

const CHANNEL_NAME = 'gal-preview';

/**
 * BroadcastChannel helper — cross-tab communication fallback for
 * browser-based development (when Rust/Tauri is not installed).
 *
 * Primary dev mode: `yarn tauri dev` — Tauri auto-opens two native windows
 *   with HMR, using Rust IPC for data transfer. No BroadcastChannel needed.
 * Fallback mode: `yarn dev` — open editor + player in two browser tabs.
 *   Editor pushes GameProject via BroadcastChannel to the player tab.
 *
 * Works across tabs from the same origin (localhost:1420). Data stays in
 * browser memory — no server round-trip, no disk writes.
 */

type PreviewMessage =
  | { type: 'preview'; gameData: GameProject }
  | { type: 'reload' }
  | { type: 'ping' }; // for connection check

/** Send a preview payload from the editor to any listening player tab */
export function broadcastPreview(gameData: GameProject): void {
  const channel = new BroadcastChannel(CHANNEL_NAME);
  const msg: PreviewMessage = { type: 'preview', gameData };
  channel.postMessage(msg);
  channel.close();
}

/**
 * Listen for preview data from the editor.
 * Returns an unsubscribe function.
 */
export function listenForPreview(
  onData: (gameData: GameProject) => void,
): () => void {
  const channel = new BroadcastChannel(CHANNEL_NAME);

  const handler = (event: MessageEvent<PreviewMessage>) => {
    if (event.data?.type === 'preview' && event.data.gameData) {
      onData(event.data.gameData);
    }
  };

  channel.addEventListener('message', handler);

  return () => {
    channel.removeEventListener('message', handler);
    channel.close();
  };
}
