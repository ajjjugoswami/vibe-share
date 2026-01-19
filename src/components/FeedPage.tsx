import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeedPlaylists, resetFeedPagination } from "@/store/slices/playlistSlice";
import TopNav from "./TopNav";
import PlaylistPost, { PlaylistPostData } from "./PlaylistPost";

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
      dispatch(fetchFeedPlaylists({ limit: 10, page: 1 }));
    }
  }, [dispatch, feedPlaylists.length]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMoreFeed && !isLoading && !isLoadingMore) {
      dispatch(fetchFeedPlaylists({ page: feedPage + 1, limit: 10, append: true }));
    }
  }, [dispatch, feedPage, hasMoreFeed, isLoading, isLoadingMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
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

  const handlePlaylistClick = (playlist: PlaylistPostData) => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handleRefresh = () => {
    dispatch(resetFeedPagination());
    dispatch(fetchFeedPlaylists({ limit: 10, page: 1 }));
  };

  // Transform Redux state to component format
  const transformedPlaylists: PlaylistPostData[] = feedPlaylists.map(playlist => ({
    id: playlist.id,
    username: playlist.user?.username || 'unknown',
    playlistName: playlist.title,
    playlistCover: playlist.coverGradient,
    coverImage: playlist.songs[0]?.thumbnail,
    description: playlist.description,
    songs: playlist.songs.map(song => ({
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail
    })),
    totalSongs: playlist.songCount || playlist.songs.length || 0,
    likes: playlist.likesCount,
    isLiked: playlist.isLiked,
    isSaved: playlist.isSaved,
    createdAt: playlist.createdAt
  }));

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      {/* Instagram-style centered feed */}
      <div className="max-w-[470px] mx-auto">
        {/* Pull to refresh indicator */}
        {isLoading && feedPlaylists.length > 0 && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 px-4 animate-fade-in">
            <div className="glass rounded-xl p-6">
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
            <p className="text-muted-foreground">Loading your feed...</p>
          </div>
        )}
        
        {!error && (
          <>
            {/* Posts */}
            <div className="divide-y divide-border">
              {transformedPlaylists.map((playlist, index) => (
                <div 
                  key={playlist.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index, 5) * 100}ms` }}
                >
                  <PlaylistPost 
                    {...playlist} 
                    onClick={() => handlePlaylistClick(playlist)}
                  />
                </div>
              ))}
            </div>
            
            {transformedPlaylists.length === 0 && !isLoading && (
              <div className="text-center py-16 px-4 animate-fade-in">
                <div className="glass rounded-xl p-8">
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
                  </div>
                )}
              </div>
            )}

            {/* End of feed */}
            {transformedPlaylists.length > 0 && !hasMoreFeed && (
              <div className="text-center py-8 border-t border-border">
                <p className="text-muted-foreground text-sm">You're all caught up!</p>
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