/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MoreHorizontal, Bookmark, ExternalLink, Edit, Link2, Play, Clock, Music2, BookmarkCheck } from "lucide-react";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { likePlaylist, unlikePlaylist } from "@/store/slices/playlistSlice";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MiniPlayer from "@/components/MiniPlayer";
import UserAvatar from "@/components/UserAvatar";
import { PlaylistDetailSkeleton } from "@/components/skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ViewPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, savePlaylist, unsavePlaylist, savedPlaylists } = usePlaylist();
  const { user } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const dispatch = useAppDispatch();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeSongIndex, setActiveSongIndex] = useState<number | null>(null);
  const fetchingRef = useRef(false);
  const isSaved = savedPlaylists.some(p => p.id === id);
  const isOwn = playlist?.user?._id === user?.id;

  useEffect(() => {
    if (playlist) {
      setIsLiked(playlist.isLiked || false);
      setLikeCount(playlist.likesCount || 0);
    }
  }, [playlist]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id || fetchingRef.current) return;
      
      fetchingRef.current = true;
      setLoading(true);
      try {
        const fetchedPlaylist = await getPlaylist(id);
        setPlaylist(fetchedPlaylist);
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };
    fetchPlaylist();
  }, [id, getPlaylist]);

  const handlePlaySong = (index: number) => {
    setActiveSongIndex(index);
  };

  const handleOpenExternal = (e: React.MouseEvent, song: SongLink) => {
    e.stopPropagation();
    window.open(song.url, "_blank", "noopener,noreferrer");
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }

    if (!playlist?.id) return;

    // Optimistic update
    const wasLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (wasLiked) {
        await dispatch(unlikePlaylist(playlist.id)).unwrap();
      } else {
        await dispatch(likePlaylist(playlist.id)).unwrap();
      }
    } catch (error) {
      // Revert on error
      setIsLiked(wasLiked);
      setLikeCount(prevCount);
      toast.error("Failed to update like");
    }
  };

  const handleSave = () => {
    if (!playlist || !playlist.id) return;
    
    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }
    
    if (isSaved) {
      unsavePlaylist(playlist.id);
      toast.success("Removed from saved");
    } else {
      savePlaylist(playlist.id);
      toast.success("Saved to library!");
    }
  };

  const handleShare = () => {
    if (!playlist) return;
    
    const shareUrl = `${window.location.origin}/playlist/${id}`;
    
    if (navigator.share) {
      navigator.share({ title: playlist.title, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    }
  };

  const handleEdit = () => {
    navigate(`/playlist/${id}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <PlaylistDetailSkeleton />;
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center">
          <Link2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Playlist not found</p>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-12 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-sm">Playlist</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={handleShare}>Copy Link</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Gradient */}
          <div className={`absolute inset-0 h-48 bg-gradient-to-b ${playlist.coverGradient} opacity-20`} />
          
          <div className="relative px-4 pt-6 pb-4">
            <div className="flex gap-4">
              {/* Cover */}
              <div className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br ${playlist.coverGradient} flex-shrink-0 overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/10`}>
                {playlist.thumbnailUrl || playlist.songs[0]?.thumbnail ? (
                  <img 
                    src={playlist.thumbnailUrl || playlist.songs[0].thumbnail} 
                    alt={playlist.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-10 h-10 text-white/40" />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0 py-1">
                <h1 className="text-xl md:text-2xl font-bold mb-1 truncate">{playlist.title}</h1>
                
                {/* Creator */}
                <button 
                  onClick={() => navigate(`/user/${playlist.user?.username || playlist.username}`)}
                  className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity"
                >
                  <UserAvatar 
                    avatarUrl={playlist.userAvatar || playlist.user?.avatarUrl} 
                    size={20} 
                    className="ring-1 ring-border"
                  />
                  <span className="text-sm text-muted-foreground">@{playlist.user?.username || playlist.username}</span>
                </button>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Music2 className="w-3.5 h-3.5" />
                    {playlist.songs.length} songs
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {likeCount} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(playlist.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {playlist.description && (
              <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                {playlist.description}
              </p>
            )}

            {/* Tags */}
            {playlist.tags && playlist.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {playlist.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-5">
              {isOwn && (
                <Button 
                  size="sm" 
                  onClick={handleEdit} 
                  className="gap-2 rounded-full px-5 h-9"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
              
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 ${
                  isLiked 
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
                {likeCount}
              </button>
              
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              
              {!isOwn && (
                <button
                  onClick={handleSave}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                    isSaved 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25" 
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 scale-110" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 mx-4" />

        {/* Songs List */}
        <div className="px-4 py-4">
          {playlist.songs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Music2 className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">No songs yet</p>
              <p className="text-sm text-muted-foreground/70">This playlist is empty</p>
              {isOwn && (
                <Button className="mt-4 rounded-full" variant="outline" onClick={handleEdit}>
                  Add Songs
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {playlist.songs.map((song: SongLink, index: number) => (
                <div 
                  key={song.id}
                  className="group flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => handlePlaySong(index)}
                >
                  {/* Number / Play */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-muted-foreground group-hover:hidden font-medium">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 hidden group-hover:block text-primary fill-current" />
                  </div>
                  
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                    {song.thumbnail ? (
                      <img 
                        src={song.thumbnail} 
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${getPlatformColor(song.platform)}`}>
                        <span className="text-lg">{getPlatformIcon(song.platform)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getPlatformColor(song.platform)}`}>
                        {song.platform}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <button 
                    onClick={(e) => handleOpenExternal(e, song)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mini Player */}
      {activeSongIndex !== null && playlist.songs.length > 0 && (
        <MiniPlayer
          songs={playlist.songs}
          currentIndex={activeSongIndex}
          onChangeIndex={setActiveSongIndex}
          onClose={() => setActiveSongIndex(null)}
        />
      )}
    </div>
  );
};

export default ViewPlaylist;