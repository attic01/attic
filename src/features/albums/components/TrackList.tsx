"use client";

import type { Track } from "@/shared/types/database";
import { formatDuration } from "@/shared/lib/format";
import { usePlayer } from "@/features/player/PlayerContext";

type TrackListProps = {
  tracks: Track[];
  artistName: string;
  canPlayFull: boolean;
};

export function TrackList({ tracks, artistName, canPlayFull }: TrackListProps) {
  const { play, current } = usePlayer();

  return (
    <ul className="track-list">
      {tracks.map((track) => {
        const isCurrent = current?.id === track.id;
        return (
          <li
            key={track.id}
            className={isCurrent ? "track-list__row--active" : undefined}
          >
            <span className="track-list__num">{track.track_number}</span>
            <button
              type="button"
              className="track-list__play"
              title={canPlayFull ? `Play ${track.title}` : `Preview ${track.title}`}
              aria-label={
                canPlayFull ? `Play ${track.title}` : `Preview ${track.title}`
              }
              onClick={() =>
                play({
                  id: track.id,
                  title: track.title,
                  artistName,
                  audioUrl: canPlayFull ? track.audio_path : track.preview_path,
                })
              }
            >
              <span className="track-list__title">{track.title}</span>
            </button>
            <span className="track-list__dur">
              {formatDuration(track.duration_seconds)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
