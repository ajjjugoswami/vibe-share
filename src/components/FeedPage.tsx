import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Empty, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeedPlaylists, resetFeedPagination, isCacheValid } from "@/store/slices/playlistSlice";
import TopNav from "./TopNav";
import PlaylistPost, { PlaylistPostData } from "./PlaylistPost";
import SwipeablePlaylist from "./SwipeablePlaylist";
import { FeedSkeleton, FeedCardSkeleton } from "@/components/skeletons";
import { triggerHaptic } from "@/hooks/useHaptic";

const { Text } = Typography;

interface FeedPageProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { feedPlaylists, isLoading, isLoadingMore, error, feedPage, hasMoreFeed, feedLastFetched } = useAppSelector((state) => state.playlists);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const playlistRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Only fetch if cache is invalid or no data
  useEffect(() => {
    if (feedPlaylists.length === 0 || !isCacheValid(feedLastFetched)) {
      dispatch(fetchFeedPlaylists({ limit: 10, page: 1 }));
    }
  }, [dispatch, feedPlaylists.length, feedLastFetched]);

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

  const transformedPlaylists: PlaylistPostData[] = feedPlaylists.map(playlist => {
    return {
      id: playlist.id,
      username: playlist.username || playlist.user?.username || 'unknown',
      userAvatar: playlist.userAvatar,
      playlistName: playlist.title,
      playlistCover: playlist.coverGradient,
      coverImage: playlist.thumbnailUrl,
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
    };
  });

  const handleSwipeToPrev = useCallback(() => {
    if (focusedIndex > 0) {
      const newIndex = focusedIndex - 1;
      setFocusedIndex(newIndex);
      playlistRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedIndex]);

  const handleSwipeToNext = useCallback(() => {
    if (focusedIndex < transformedPlaylists.length - 1) {
      const newIndex = focusedIndex + 1;
      setFocusedIndex(newIndex);
      playlistRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedIndex, transformedPlaylists.length]);

  // Track which playlist is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setFocusedIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    playlistRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [transformedPlaylists.length]);

  return (
    <div className="min-h-screen">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      <div className="max-w-lg mx-auto">
        {isLoading && feedPlaylists.length > 0 && (
          <div className="px-4 py-4">
            <FeedCardSkeleton />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 px-4 animate-fade-in">
            <div className="glass rounded-2xl p-6">
              <Text type="danger" className="block mb-3 text-sm">{error}</Text>
              <Button size="small" onClick={handleRefresh} icon={<RefreshCw className="w-3 h-3" />} className="!rounded-lg !h-8">
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && feedPlaylists.length === 0 && (
          <FeedSkeleton count={3} />
        )}
        
        {!error && (
          <>
            <div className="divide-y divide-border/30 relative">
              {/* Swipe Navigation Indicators */}
              {focusedIndex > 0 && (
                <div className="fixed left-2 top-1/2 -translate-y-1/2 z-30 md:hidden pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground animate-pulse">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              )}
              {focusedIndex < transformedPlaylists.length - 1 && (
                <div className="fixed right-2 top-1/2 -translate-y-1/2 z-30 md:hidden pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground animate-pulse">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              {transformedPlaylists.map((playlist, index) => (
                <div 
                  key={playlist.id}
                  ref={(el) => { playlistRefs.current[index] = el; }}
                  data-index={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
                >
                  <SwipeablePlaylist
                    onSwipeLeft={handleSwipeToNext}
                    onSwipeRight={handleSwipeToPrev}
                    enabled={true}
                  >
                    <PlaylistPost 
                      {...playlist} 
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  </SwipeablePlaylist>
                </div>
              ))}
            </div>
            
            {transformedPlaylists.length === 0 && !isLoading && (
              <Empty
                className="py-16"
                description={
                  <div className="mt-2">
                    <Text strong className="block mb-1">No playlists yet</Text>
                    <Text type="secondary" className="text-sm">Be the first to share!</Text>
                  </div>
                }
              >
                <Button size="small" onClick={onShareClick} className="!rounded-[8px] px-4 !h-8">
                  Create Playlist
                </Button>
              </Empty>
            )}
            
            {transformedPlaylists.length > 0 && hasMoreFeed && (
              <div ref={loadMoreRef} className="px-4 py-4">
                {isLoadingMore && <FeedCardSkeleton />}
              </div>
            )}

            {transformedPlaylists.length > 0 && !hasMoreFeed && (
              <div className="text-center py-8">
                <Text type="secondary" className="text-sm">You're all caught up!</Text>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedPage;