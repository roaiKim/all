import { useState } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
}

/**
 * Settings panel — volume, display, controls.
 */
export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [masterVolume, setMasterVolume] = useState(1);
  const [bgmVolume, setBgmVolume] = useState(0.8);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [textSpeed, setTextSpeed] = useState(2); // 1=slow, 2=normal, 3=fast

  return (
    <div className="player-modal-overlay" onClick={onClose}>
      <div className="player-modal player-settings" onClick={(e) => e.stopPropagation()}>
        <div className="player-modal-header">
          <h2>设置</h2>
          <button className="player-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="player-settings-body">
          {/* Volume */}
          <div className="player-settings-group">
            <label>主音量</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
            />
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>

          <div className="player-settings-group">
            <label>背景音乐</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgmVolume}
              onChange={(e) => setBgmVolume(Number(e.target.value))}
            />
            <span>{Math.round(bgmVolume * 100)}%</span>
          </div>

          <div className="player-settings-group">
            <label>音效</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
            />
            <span>{Math.round(sfxVolume * 100)}%</span>
          </div>

          {/* Text speed */}
          <div className="player-settings-group">
            <label>文字速度</label>
            <select value={textSpeed} onChange={(e) => setTextSpeed(Number(e.target.value))}>
              <option value={1}>慢</option>
              <option value={2}>正常</option>
              <option value={3}>快</option>
            </select>
          </div>
        </div>

        <div className="player-settings-footer">
          <button className="player-btn" onClick={onClose}>
            返回游戏
          </button>
        </div>
      </div>
    </div>
  );
}
