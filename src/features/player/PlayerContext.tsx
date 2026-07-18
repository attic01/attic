"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PlayerTrack = {
  id: string;
  title: string;
  artistName: string;
  audioUrl?: string | null;
};

type PlayerContextValue = {
  current: PlayerTrack | null;
  isPlaying: boolean;
  play: (track: PlayerTrack) => void;
  toggle: () => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((track: PlayerTrack) => {
    setCurrent(track);
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrent(null);
  }, []);

  const value = useMemo(
    () => ({ current, isPlaying, play, toggle, stop }),
    [current, isPlaying, play, toggle, stop],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return ctx;
}
