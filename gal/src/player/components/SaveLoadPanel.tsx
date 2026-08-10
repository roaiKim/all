import { useState } from 'react';
import type { SaveData } from '@shared/types/game';

interface SaveLoadPanelProps {
  saves: SaveData[];
  onSave: (slotIndex: number, label: string) => void;
  onLoad: (slotIndex: number) => void;
  onClose: () => void;
}

const SAVE_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Save/Load overlay panel — shows 10 save slots.
 */
export function SaveLoadPanel({ saves, onSave, onLoad, onClose }: SaveLoadPanelProps) {
  const [mode, setMode] = useState<'save' | 'load'>('save');

  const getSaveForSlot = (slot: number): SaveData | undefined => {
    return saves.find((s) => s.slotIndex === slot);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (mode === 'save') {
      const label = prompt('存档备注（可选）：', `存档 ${slotIndex + 1}`) ?? `存档 ${slotIndex + 1}`;
      onSave(slotIndex, label);
      onClose();
    } else {
      const save = getSaveForSlot(slotIndex);
      if (save) {
        onLoad(slotIndex);
      }
    }
  };

  return (
    <div className="player-modal-overlay" onClick={onClose}>
      <div className="player-modal" onClick={(e) => e.stopPropagation()}>
        <div className="player-modal-header">
          <h2>{mode === 'save' ? '保存进度' : '读取进度'}</h2>
          <button className="player-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="player-modal-tabs">
          <button
            className={`player-modal-tab ${mode === 'save' ? 'active' : ''}`}
            onClick={() => setMode('save')}
          >
            存档
          </button>
          <button
            className={`player-modal-tab ${mode === 'load' ? 'active' : ''}`}
            onClick={() => setMode('load')}
          >
            读档
          </button>
        </div>

        <div className="player-save-slots">
          {SAVE_SLOTS.map((slot) => {
            const save = getSaveForSlot(slot);
            return (
              <div
                key={slot}
                className={`player-save-slot ${save ? 'has-save' : ''}`}
                onClick={() => handleSlotClick(slot)}
              >
                <div className="player-save-slot-index">存档 {slot + 1}</div>
                {save ? (
                  <div className="player-save-slot-info">
                    <div className="player-save-slot-label">{save.label}</div>
                    <div className="player-save-slot-time">
                      {new Date(save.timestamp).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ) : (
                  <div className="player-save-slot-empty">— 空 —</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
