/**
 * VideoManager — wraps the HTML <video> element API for
 * fine-grained playback control, subtitle sync, and preloading.
 */
export class VideoManager {
  private videoElement: HTMLVideoElement | null = null;
  private onEndedCallback: (() => void) | null = null;
  private onTimeUpdateCallback: ((currentTime: number) => void) | null = null;
  private preloadCache: Map<string, HTMLVideoElement> = new Map();

  /** Attach to an existing <video> element */
  attach(el: HTMLVideoElement): void {
    this.detach();
    this.videoElement = el;
    el.addEventListener('ended', this.handleEnded);
    el.addEventListener('timeupdate', this.handleTimeUpdate);
  }

  /** Detach from current video element */
  detach(): void {
    if (this.videoElement) {
      this.videoElement.removeEventListener('ended', this.handleEnded);
      this.videoElement.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.videoElement = null;
    }
  }

  /** Load and play a video source */
  play(src: string): void {
    if (!this.videoElement) return;
    this.videoElement.src = src;
    this.videoElement.play().catch((e) => {
      console.warn('Video play failed:', e);
    });
  }

  /** Pause current playback */
  pause(): void {
    this.videoElement?.pause();
  }

  /** Resume playback */
  resume(): void {
    this.videoElement?.play().catch(() => {});
  }

  /** Seek to a specific time (seconds) */
  seek(time: number): void {
    if (this.videoElement) {
      this.videoElement.currentTime = time;
    }
  }

  /** Get current playback time */
  getCurrentTime(): number {
    return this.videoElement?.currentTime ?? 0;
  }

  /** Get video duration */
  getDuration(): number {
    return this.videoElement?.duration ?? 0;
  }

  /** Set volume (0-1) */
  setVolume(vol: number): void {
    if (this.videoElement) {
      this.videoElement.volume = Math.max(0, Math.min(1, vol));
    }
  }

  /** Set muted state */
  setMuted(muted: boolean): void {
    if (this.videoElement) {
      this.videoElement.muted = muted;
    }
  }

  /** Preload a video (creates hidden element) */
  preload(src: string): void {
    if (this.preloadCache.has(src)) return;
    const el = document.createElement('video');
    el.preload = 'auto';
    el.src = src;
    el.style.display = 'none';
    document.body.appendChild(el);
    this.preloadCache.set(src, el);
  }

  /** Register end callback */
  onEnded(cb: () => void): void {
    this.onEndedCallback = cb;
  }

  /** Register time update callback */
  onTimeUpdate(cb: (currentTime: number) => void): void {
    this.onTimeUpdateCallback = cb;
  }

  /** Cleanup all resources */
  destroy(): void {
    this.detach();
    this.preloadCache.forEach((el) => {
      el.pause();
      el.removeAttribute('src');
      el.load();
      el.remove();
    });
    this.preloadCache.clear();
    this.onEndedCallback = null;
    this.onTimeUpdateCallback = null;
  }

  // ---- Internal handlers ----

  private handleEnded = (): void => {
    this.onEndedCallback?.();
  };

  private handleTimeUpdate = (): void => {
    if (this.videoElement) {
      this.onTimeUpdateCallback?.(this.videoElement.currentTime);
    }
  };
}
