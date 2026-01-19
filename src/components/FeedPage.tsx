import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "./TopNav";
import PlaylistCard, { PlaylistData } from "./PlaylistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlaylist } from "@/contexts/PlaylistContext";

interface FeedPageProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  const navigate = useNavigate();
  const { feedPlaylists, isLoading, error, fetchFeedPlaylists } = usePlaylist();

  useEffect(() => {
    fetchFeedPlaylists({ limit: 20 });
  }, [fetchFeedPlaylists]);

  const handlePlaylistClick = (playlist: PlaylistData) => {
    console.log("[PLAYLIST_OPENED]", { 
      playlistId: playlist.id, 
      playlistName: playlist.playlistName,
      username: playlist.username,
      timestamp: new Date().toISOString() 
    });
    navigate(`/playlist/${playlist.id}`);
  };

  // Transform context playlists to component format
  const transformedPlaylists: PlaylistData[] = feedPlaylists.map(playlist => ({
    id: playlist.id,
    username: playlist.user?.username || 'unknown',
    userAvatar: "from-purple-600 to-pink-600", // Default avatar gradient
    verified: false, // TODO: Add verified status to user model
    playlistName: playlist.title,
    playlistCover: playlist.coverGradient,
    description: playlist.description,
    songs: playlist.songs.map(song => ({
      title: song.title,
      artist: song.artist
    })),
    totalSongs: playlist.songs.length,
    likes: playlist.likesCount,
    isLiked: playlist.isLiked
  }));

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Fresh Playlists</h2>
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchFeedPlaylists({ limit: 20 })} variant="outline">
              Try Again
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading playlists...</p>
          </div>
        )}
        
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {transformedPlaylists.map((playlist) => (
                <PlaylistCard 
                  key={playlist.id} 
                  {...playlist} 
                  onClick={() => handlePlaylistClick(playlist)}
                />
              ))}
            </div>
            
            {transformedPlaylists.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No playlists found</p>
              </div>
            )}
            
            {transformedPlaylists.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => console.log("[LOAD_MORE_CLICKED]", { timestamp: new Date().toISOString() })}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={onShareClick}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform md:hidden"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default FeedPage;
