import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { SongLink } from "./PlaylistContext";

interface PlayerState {
  songs: SongLink[];
  currentIndex: number;
  playlistId: string | null;
  playlistTitle: string;
  isExpanded: boolean;
}

interface PlayerContextType {
  playerState: PlayerState | null;
  isPlaying: boolean;
  playSongs: (songs: SongLink[], startIndex?: number, playlistId?: string, playlistTitle?: string) => void;
  setCurrentIndex: (index: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  expandPlayer: () => void;
  minimizePlayer: () => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSongs = useCallback((
    songs: SongLink[], 
    startIndex = 0, 
    playlistId?: string,
    playlistTitle = "Now Playing"
  ) => {
    setPlayerState({
      songs,
      currentIndex: startIndex,
      playlistId: playlistId || null,
      playlistTitle,
      isExpanded: true,
    });
    setIsPlaying(true);
  }, []);

  const setCurrentIndex = useCallback((index: number) => {
    setPlayerState(prev => prev ? { ...prev, currentIndex: index } : null);
  }, []);

  const nextSong = useCallback(() => {
    setPlayerState(prev => {
      if (!prev || prev.currentIndex >= prev.songs.length - 1) return prev;
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const prevSong = useCallback(() => {
    setPlayerState(prev => {
      if (!prev || prev.currentIndex <= 0) return prev;
      return { ...prev, currentIndex: prev.currentIndex - 1 };
    });
  }, []);

  const expandPlayer = useCallback(() => {
    setPlayerState(prev => prev ? { ...prev, isExpanded: true } : null);
  }, []);

  const minimizePlayer = useCallback(() => {
    setPlayerState(prev => prev ? { ...prev, isExpanded: false } : null);
  }, []);

  const closePlayer = useCallback(() => {
    setPlayerState(null);
    setIsPlaying(false);
  }, []);

  return (
    <PlayerContext.Provider value={{
      playerState,
      isPlaying,
      playSongs,
      setCurrentIndex,
      nextSong,
      prevSong,
      expandPlayer,
      minimizePlayer,
      closePlayer,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
