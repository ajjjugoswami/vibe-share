import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeedPlaylists, resetFeedPagination } from "@/store/slices/playlistSlice";
import TopNav from "./TopNav";
import PlaylistCard, { PlaylistData } from "./PlaylistCard";

interface FeedPageProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { feedPlaylists, isLoading, isLoadingMore, error, feedPage, hasMoreFeed } = useAppSelector((state) => state.playlists);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Initial load
  useEffect(() => {
    if (feedPlaylists.length === 0) {
      dispatch(fetchFeedPlaylists({ limit: 20, page: 1 }));
    }
  }, [dispatch, feedPlaylists.length]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMoreFeed && !isLoading && !isLoadingMore) {
      dispatch(fetchFeedPlaylists({ page: feedPage + 1, limit: 20, append: true }));
    }
  }, [dispatch, feedPage, hasMoreFeed, isLoading, isLoadingMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handlePlaylistClick = (playlist: PlaylistData) => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handleRefresh = () => {
    dispatch(resetFeedPagination());
    dispatch(fetchFeedPlaylists({ limit: 20, page: 1 }));
  };

  // Transform Redux state to component format
  const transformedPlaylists: PlaylistData[] = feedPlaylists.map(playlist => ({
    id: playlist.id,
    username: playlist.user?.username || 'unknown',
    userAvatar: "from-purple-600 to-pink-600",
    verified: false,
    playlistName: playlist.title,
    playlistCover: playlist.coverGradient,
    coverImage: playlist.songs[0]?.thumbnail,
    description: playlist.description,
    songs: playlist.songs.map(song => ({
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail
    })),
    totalSongs: playlist.songCount || 0,
    likes: playlist.likesCount,
    isLiked: playlist.isLiked
  }));

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gradient">Fresh Playlists</h2>
            <p className="text-muted-foreground text-sm mt-1">Discover what others are sharing</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="hover:bg-secondary/80"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {error && (
          <div className="text-center py-12 animate-fade-in">
            <div className="glass rounded-xl p-6 max-w-md mx-auto">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && feedPlaylists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading playlists...</p>
          </div>
        )}
        
        {!error && (
          <>
            {/* Masonry Layout */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
              {transformedPlaylists.map((playlist, index) => (
                <div 
                  key={playlist.id} 
                  className="animate-slide-up break-inside-avoid mb-4"
                  style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
                >
                  <PlaylistCard 
                    {...playlist} 
                    onClick={() => handlePlaylistClick(playlist)}
                  />
                </div>
              ))}
            </div>
            
            {transformedPlaylists.length === 0 && !isLoading && (
              <div className="text-center py-16 animate-fade-in">
                <div className="glass rounded-xl p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No playlists yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to share a playlist!</p>
                  <Button onClick={onShareClick} className="btn-gradient">
                    Create Playlist
                  </Button>
                </div>
              </div>
            )}
            
            {/* Infinite scroll trigger */}
            {transformedPlaylists.length > 0 && hasMoreFeed && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading more...</span>
                  </div>
                )}
              </div>
            )}

            {/* End of feed indicator */}
            {transformedPlaylists.length > 0 && !hasMoreFeed && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">You've seen all playlists!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={onShareClick}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full btn-gradient flex items-center justify-center shadow-xl z-40 active:scale-95 transition-all duration-300 md:hidden glow"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default FeedPage;