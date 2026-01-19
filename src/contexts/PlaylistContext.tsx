import { createContext, useContext, useState, ReactNode } from "react";

export interface SongLink {
  id: string;
  title: string;
  artist: string;
  url: string;
  platform: string;
  thumbnail?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverGradient: string;
  songs: SongLink[];
  likes: number;
  createdAt: string;
  updatedAt: string;
  isOwn: boolean;
}

interface PlaylistContextType {
  playlists: Playlist[];
  savedPlaylists: Playlist[];
  createPlaylist: (playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt" | "likes" | "isOwn">) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Omit<Playlist, "id" | "createdAt" | "isOwn">>) => void;
  deletePlaylist: (id: string) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  savePlaylist: (playlist: Playlist) => void;
  unsavePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Omit<SongLink, "id">) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  updateSongInPlaylist: (playlistId: string, songId: string, updates: Partial<SongLink>) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};

const gradients = [
  "from-purple-800 to-pink-900",
  "from-red-800 to-orange-900",
  "from-green-800 to-teal-900",
  "from-blue-800 to-indigo-900",
  "from-amber-800 to-rose-900",
  "from-cyan-800 to-blue-900",
  "from-fuchsia-800 to-purple-900",
  "from-emerald-800 to-cyan-900",
];

// Mock initial data
const initialPlaylists: Playlist[] = [
  {
    id: "u1",
    title: "my favorites",
    description: "Songs I love the most",
    coverGradient: "from-purple-800 to-pink-900",
    songs: [
      { id: "s1", title: "Blinding Lights", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ", platform: "YouTube", thumbnail: "https://img.youtube.com/vi/4NRXx6U8ABQ/mqdefault.jpg" },
      { id: "s2", title: "Save Your Tears", artist: "The Weeknd", url: "https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g", platform: "Spotify" },
    ],
    likes: 142,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isOwn: true,
  },
  {
    id: "u2",
    title: "workout mix",
    description: "Gym motivation bangers",
    coverGradient: "from-red-800 to-orange-900",
    songs: [
      { id: "s3", title: "Lose Yourself", artist: "Eminem", url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s", platform: "YouTube", thumbnail: "https://img.youtube.com/vi/_Yhyp-_hX2s/mqdefault.jpg" },
    ],
    likes: 89,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    isOwn: true,
  },
];

const initialSavedPlaylists: Playlist[] = [
  {
    id: "saved1",
    title: "late night drives",
    description: "Perfect for 2am drives",
    coverGradient: "from-indigo-800 to-purple-900",
    songs: [
      { id: "ss1", title: "Die For You", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=mTLQhPFx2nM", platform: "YouTube", thumbnail: "https://img.youtube.com/vi/mTLQhPFx2nM/mqdefault.jpg" },
    ],
    likes: 1823,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12",
    isOwn: false,
  },
];

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>(initialSavedPlaylists);

  const createPlaylist = (playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt" | "likes" | "isOwn">) => {
    const newPlaylist: Playlist = {
      ...playlist,
      id: `playlist-${Date.now()}`,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOwn: true,
      coverGradient: playlist.coverGradient || gradients[Math.floor(Math.random() * gradients.length)],
    };
    
    setPlaylists(prev => [newPlaylist, ...prev]);
    console.log("[PLAYLIST_CREATED]", { playlist: newPlaylist, timestamp: new Date().toISOString() });
    return newPlaylist;
  };

  const updatePlaylist = (id: string, updates: Partial<Omit<Playlist, "id" | "createdAt" | "isOwn">>) => {
    setPlaylists(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    ));
    console.log("[PLAYLIST_UPDATED]", { playlistId: id, updates, timestamp: new Date().toISOString() });
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    console.log("[PLAYLIST_DELETED]", { playlistId: id, timestamp: new Date().toISOString() });
  };

  const getPlaylist = (id: string) => {
    return playlists.find(p => p.id === id) || savedPlaylists.find(p => p.id === id);
  };

  const savePlaylist = (playlist: Playlist) => {
    if (!savedPlaylists.find(p => p.id === playlist.id)) {
      setSavedPlaylists(prev => [...prev, { ...playlist, isOwn: false }]);
      console.log("[PLAYLIST_SAVED]", { playlistId: playlist.id, timestamp: new Date().toISOString() });
    }
  };

  const unsavePlaylist = (id: string) => {
    setSavedPlaylists(prev => prev.filter(p => p.id !== id));
    console.log("[PLAYLIST_UNSAVED]", { playlistId: id, timestamp: new Date().toISOString() });
  };

  const addSongToPlaylist = (playlistId: string, song: Omit<SongLink, "id">) => {
    const newSong: SongLink = { ...song, id: `song-${Date.now()}` };
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, songs: [...p.songs, newSong], updatedAt: new Date().toISOString() }
        : p
    ));
    console.log("[SONG_ADDED]", { playlistId, song: newSong, timestamp: new Date().toISOString() });
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, songs: p.songs.filter(s => s.id !== songId), updatedAt: new Date().toISOString() }
        : p
    ));
    console.log("[SONG_REMOVED]", { playlistId, songId, timestamp: new Date().toISOString() });
  };

  const updateSongInPlaylist = (playlistId: string, songId: string, updates: Partial<SongLink>) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { 
            ...p, 
            songs: p.songs.map(s => s.id === songId ? { ...s, ...updates } : s),
            updatedAt: new Date().toISOString()
          }
        : p
    ));
    console.log("[SONG_UPDATED]", { playlistId, songId, updates, timestamp: new Date().toISOString() });
  };

  return (
    <PlaylistContext.Provider value={{
      playlists,
      savedPlaylists,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      getPlaylist,
      savePlaylist,
      unsavePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      updateSongInPlaylist,
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};
