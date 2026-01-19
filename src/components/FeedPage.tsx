import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { Button, Spin, Empty, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeedPlaylists, resetFeedPagination } from "@/store/slices/playlistSlice";
import TopNav from "./TopNav";
import PlaylistPost, { PlaylistPostData } from "./PlaylistPost";

const { Text } = Typography;

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

  useEffect(() => {
    if (feedPlaylists.length === 0) {
      dispatch(fetchFeedPlaylists({ limit: 10, page: 1 }));
    }
  }, [dispatch, feedPlaylists.length]);

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
      
      <div className="max-w-[470px] mx-auto">
        {isLoading && feedPlaylists.length > 0 && (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 px-4 animate-fade-in">
            <div className="glass rounded-xl p-6">
              <Text type="danger" className="block mb-4">{error}</Text>
              <Button onClick={handleRefresh} icon={<RefreshCw className="w-4 h-4" />}>
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && feedPlaylists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Spin size="large" />
            <Text type="secondary" className="mt-4">Loading your feed...</Text>
          </div>
        )}
        
        {!error && (
          <>
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
              <Empty
                className="py-16"
                image={<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><Plus className="w-8 h-8 text-primary" /></div>}
                description={
                  <div>
                    <Text strong className="block mb-2">No playlists yet</Text>
                    <Text type="secondary">Be the first to share a playlist!</Text>
                  </div>
                }
              >
                <Button type="primary" onClick={onShareClick} className="btn-gradient !border-0">
                  Create Playlist
                </Button>
              </Empty>
            )}
            
            {transformedPlaylists.length > 0 && hasMoreFeed && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isLoadingMore && <Spin />}
              </div>
            )}

            {transformedPlaylists.length > 0 && !hasMoreFeed && (
              <div className="text-center py-8 border-t border-border">
                <Text type="secondary">You're all caught up!</Text>
              </div>
            )}
          </>
        )}
      </div>

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