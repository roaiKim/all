import { useState, useCallback } from 'react';
import type { DialogueLine } from '@shared/types/game';

interface DialogueBoxProps {
  lines: DialogueLine[];
  onComplete?: () => void;
}

/**
 * Dialogue box — displays speaker lines one at a time with typewriter effect.
 * Click to advance to the next line or complete the current one.
 */
export function DialogueBox({ lines, onComplete }: DialogueBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentLine = lines[currentIndex];

  // Start typing the current line
  const startTyping = useCallback(
    (text: string) => {
      setIsTyping(true);
      let i = 0;
      setDisplayedText('');

      const interval = setInterval(() => {
        i++;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 40); // typing speed: ~25 chars/sec

      return () => clearInterval(interval);
    },
    [],
  );

  // Advance to next line
  const advance = useCallback(() => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(currentLine?.text ?? '');
      setIsTyping(false);
      return;
    }

    if (currentIndex < lines.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  }, [currentIndex, currentLine, isTyping, lines.length, onComplete]);

  // Start typing when line changes
  useState(() => {
    if (currentLine) {
      return startTyping(currentLine.text);
    }
  });

  if (!currentLine) return null;

  return (
    <div className="player-dialogue-box" onClick={advance}>
      <div className="player-dialogue-speaker">{currentLine.speaker}</div>
      <div className="player-dialogue-text">
        {displayedText}
        {isTyping && <span className="player-dialogue-cursor">|</span>}
      </div>
      <div className="player-dialogue-hint">
        {isTyping ? '点击跳过' : currentIndex < lines.length - 1 ? '点击继续 ▼' : '点击继续 ▶'}
      </div>
    </div>
  );
}
