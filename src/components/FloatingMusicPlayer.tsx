import { Music2, Pause, Play } from "lucide-react";

interface FloatingMusicPlayerProps {
  playing: boolean;
  error: boolean;
  label: string;
  statusText: string;
  ariaLabel: string;
  onToggle: () => void;
}

/**
 * Persistent floating devotional music control with animated equalizer indicator.
 */
export function FloatingMusicPlayer({
  playing,
  error,
  label,
  statusText,
  ariaLabel,
  onToggle,
}: FloatingMusicPlayerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={playing}
      className={`floating-music-pill${playing ? " is-playing" : ""}`}
    >
      <span className="floating-music-icon" aria-hidden="true">
        {playing ? <Pause /> : error ? <Music2 /> : <Play />}
      </span>
      <span className="floating-music-text">
        <span className="floating-music-title">{label}</span>
        <span className="floating-music-status">{statusText}</span>
      </span>
      <span className="music-equalizer" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}

