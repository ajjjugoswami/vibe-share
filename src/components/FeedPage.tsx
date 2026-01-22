import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, LayoutGrid, List } from "lucide-react";
import { Button, Spin, Empty, Typography, Segmented } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeedPlaylists, resetFeedPagination } from "@/store/slices/playlistSlice";
import TopNav from "./TopNav";
import PlaylistPost, { PlaylistPostData } from "./PlaylistPost";
import PlaylistCard from "./PlaylistCard";

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
    <div className="min-h-screen pb-24 md:pb-0">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      {/* View Mode Toggle */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-end">
        <Segmented
          value={viewMode}
          onChange={(val) => setViewMode(val as 'list' | 'grid')}
          options={[
            { value: 'list', icon: <List className="w-4 h-4" /> },
            { value: 'grid', icon: <LayoutGrid className="w-4 h-4" /> },
          ]}
          className="!bg-secondary"
        />
      </div>

      <div className={viewMode === 'list' ? "max-w-[500px] mx-auto" : "max-w-6xl mx-auto px-4"}>
        {isLoading && feedPlaylists.length > 0 && (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 px-4 animate-fade-in">
            <div className="glass rounded-2xl p-8">
              <Text type="danger" className="block mb-4">{error}</Text>
              <Button onClick={handleRefresh} icon={<RefreshCw className="w-4 h-4" />} className="!rounded-xl">
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && feedPlaylists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Spin size="large" />
            <Text type="secondary" className="mt-4">Discovering great playlists...</Text>
          </div>
        )}
        
        {!error && (
          <>
            {viewMode === 'list' ? (
              <div className="divide-y divide-border/30">
                {transformedPlaylists.map((playlist, index) => (
                  <div 
                    key={playlist.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index, 5) * 80}ms` }}
                  >
                    <PlaylistPost 
                      {...playlist} 
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="masonry-grid">
                {transformedPlaylists.map((playlist, index) => (
                  <div 
                    key={playlist.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                  >
                    <PlaylistCard 
                      {...playlist}
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {transformedPlaylists.length === 0 && !isLoading && (
              <Empty
                className="py-20"
                image={
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
                    <Plus className="w-10 h-10 text-primary" />
                  </div>
                }
                description={
                  <div className="mt-4">
                    <Text strong className="block mb-2 text-lg">No playlists yet</Text>
                    <Text type="secondary">Be the first to share a playlist!</Text>
                  </div>
                }
              >
                <Button 
                  type="primary" 
                  onClick={onShareClick} 
                  className="!mt-4 !h-12 !px-8 btn-gradient !border-0 !rounded-xl"
                >
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
              <div className="text-center py-10">
                <div className="inline-block px-6 py-3 rounded-full bg-secondary/50">
                  <Text type="secondary">You're all caught up! ✨</Text>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onShareClick}
        className="fab md:hidden glow animate-glow"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default FeedPage;