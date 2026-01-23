/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MoreHorizontal, Bookmark, ExternalLink, Edit, Link2, Play } from "lucide-react";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { likePlaylist, unlikePlaylist } from "@/store/slices/playlistSlice";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MiniPlayer from "@/components/MiniPlayer";
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
  const [activeSongIndex, setActiveSongIndex] = useState<number | null>(null);
  const fetchingRef = useRef(false);
  const isSaved = savedPlaylists.some(p => p.id === id);
  const isOwn = playlist?.user?._id === user?.id;

  useEffect(() => {
    if (playlist) {
      setIsLiked(playlist.isLiked || false);
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

    try {
      if (isLiked) {
        await dispatch(unlikePlaylist(playlist.id)).unwrap();
        setIsLiked(false);
        setPlaylist((prev: any) => prev ? { ...prev, likesCount: (prev.likesCount || 0) - 1 } : null);
      } else {
        await dispatch(likePlaylist(playlist.id)).unwrap();
        setIsLiked(true);
        setPlaylist((prev: any) => prev ? { ...prev, likesCount: (prev.likesCount || 0) + 1 } : null);
      }
      toast.success(isLiked ? "Like removed" : "Playlist liked!");
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to like playlist");
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
      toast.success("Removed from saved playlists");
    } else {
      savePlaylist(playlist.id);
      toast.success("Playlist saved!");
    }
  };

  const handleShare = () => {
    if (!playlist) return;
    
    const shareUrl = `${window.location.origin}/playlist/${id}`;
    
    if (navigator.share) {
      navigator.share({ title: playlist.title, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    }
  };

  const handleEdit = () => {
    navigate(`/playlist/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Link2 className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">Playlist not found</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold">Playlist</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Playlist Header */}
        <div className="flex gap-4 mb-8">
          {/* Cover */}
          <div className={`w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br ${playlist.coverGradient} flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg`}>
            {playlist.thumbnailUrl || playlist.songs[0]?.thumbnail ? (
              <img src={playlist.thumbnailUrl || playlist.songs[0].thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
            ) : (
              <Link2 className="w-12 h-12 text-white/30" />
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium mb-1">Playlist</p>
            <h1 className="text-xl md:text-2xl font-bold mb-1 truncate">{playlist.title}</h1>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {playlist.description || "A curated collection of song links"}
            </p>

            {playlist.tags && playlist.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {playlist.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md">#{tag}</span>
                ))}
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              {playlist.songs.length} songs • {playlist.likesCount?.toLocaleString() || 0} likes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mb-8">
          {isOwn && (
            <Button size="sm" onClick={handleEdit} className="gap-2 rounded-full px-5">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
          <Button 
            size="icon"
            variant="outline"
            onClick={handleLike}
            className={`rounded-full ${isLiked ? "text-red-500 border-red-500/50" : ""}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button 
            size="icon"
            variant="outline"
            onClick={handleShare}
            className="rounded-full"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          {!isOwn && (
            <Button 
              size="icon"
              variant="outline"
              onClick={handleSave}
              className={`rounded-full ${isSaved ? "text-primary border-primary/50" : ""}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        {/* Songs Masonry Grid */}
        {playlist.songs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-card border border-border/40 flex items-center justify-center">
              <Link2 className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No songs in this playlist yet</p>
            {isOwn && (
              <Button className="mt-4" variant="outline" onClick={handleEdit}>
                Add Songs
              </Button>
            )}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {playlist.songs.map((song: SongLink, index: number) => (
              <div 
                key={song.id}
                className="break-inside-avoid bg-card rounded-xl border border-border/40 overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => handlePlaySong(index)}
              >
                {/* Thumbnail */}
                <div className="relative">
                  {song.thumbnail ? (
                    <img 
                      src={song.thumbnail} 
                      alt={song.title}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className={`w-full aspect-square flex items-center justify-center ${getPlatformColor(song.platform)}`}>
                      <span className="text-4xl">{getPlatformIcon(song.platform)}</span>
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium"># {index + 1}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getPlatformColor(song.platform)}`}>
                      {song.platform}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate mb-0.5">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate mb-3">{song.artist}</p>
                  
                  {/* Actions - Always visible */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleOpenExternal(e, song)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(song.url);
                        toast.success("Link copied!");
                      }}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
