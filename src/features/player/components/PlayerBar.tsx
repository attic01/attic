"use client";

import { usePlayer } from "@/features/player/PlayerContext";

export function PlayerBar() {
  const { current, isPlaying, toggle, stop } = usePlayer();

  if (!current) return null;

  return (
    <div className="player-bar" role="region" aria-label="Music player">
      <div className="player-bar__inner">
        <div className="player-bar__meta">
          <div className="player-bar__title">{current.title}</div>
          <div className="player-bar__artist">{current.artistName}</div>
        </div>
        <div className="player-bar__controls">
          <button type="button" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button type="button" onClick={stop} aria-label="Stop">
            ■
          </button>
        </div>
        <div className="player-bar__progress">
          {isPlaying ? "Playing" : "Paused"}
          {!current.audioUrl ? " · preview soon" : ""}
        </div>
      </div>
    </div>
  );
}
