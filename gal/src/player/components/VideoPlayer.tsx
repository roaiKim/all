import { useRef, useEffect, useCallback, useState } from 'react';
import type { Subtitle } from '@shared/types/game';

interface VideoPlayerProps {
  src: string;
  subtitles?: Subtitle[];
  onEnded?: () => void;
  paused?: boolean;
}

/**
 * Video player component with subtitle overlay.
 * Uses native <video> element for playback.
 */
export function VideoPlayer({ src, subtitles, onEnded, paused }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleEnded = () => onEnded?.();
    const handleTimeUpdate = () => setCurrentTime(el.currentTime);

    el.addEventListener('ended', handleEnded);
    el.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      el.removeEventListener('ended', handleEnded);
      el.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onEnded]);

  // Handle pause/resume from outside
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) {
      el.pause();
    } else if (el.paused) {
      el.play().catch(() => {});
    }
  }, [paused]);

  // Reload when src changes
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  }, [src]);

  const toggleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  // Find active subtitle
  const activeSubtitle = subtitles?.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime,
  );

  return (
    <div className="player-video-wrapper">
      <video
        ref={videoRef}
        className="player-video"
        src={src}
        preload="auto"
        playsInline
        onClick={toggleFullscreen}
      />

      {/* Subtitle overlay */}
      {activeSubtitle && (
        <div className="player-subtitle">
          <span className="player-subtitle-text">{activeSubtitle.text}</span>
        </div>
      )}

      {/* Fullscreen indicator */}
      {!isFullscreen && (
        <div className="player-video-hint">点击视频全屏</div>
      )}
    </div>
  );
}
