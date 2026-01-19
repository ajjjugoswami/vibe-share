/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MoreHorizontal, Bookmark, ExternalLink, Edit, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAuth } from "@/contexts/AuthContext";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";

const ViewPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, savePlaylist, unsavePlaylist, savedPlaylists } = usePlaylist();
  const { isLoggedIn, user } = useAuth();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = savedPlaylists.some(p => p.id === id);
  const isOwn = playlist?.user?._id === user?.id;

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (id) {
        try {
          const fetchedPlaylist = await getPlaylist(id);
          setPlaylist(fetchedPlaylist);
        } catch (error) {
          console.error('Failed to fetch playlist:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPlaylist();
  }, [id, getPlaylist]);

  const handleOpenLink = (song: SongLink, index: number) => {
    console.log("[SONG_LINK_OPENED]", {
      playlistId: playlist?.id,
      playlistName: playlist?.title,
      songIndex: index,
      songTitle: song.title,
      url: song.url,
      timestamp: new Date().toISOString()
    });
    window.open(song.url, "_blank", "noopener,noreferrer");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    console.log("[PLAYLIST_LIKE]", {
      playlistId: playlist?.id,
      action: !isLiked ? "liked" : "unliked",
      timestamp: new Date().toISOString()
    });
  };

  const handleSave = () => {
    if (!playlist || !playlist.id) return;
    
    if (isSaved) {
      unsavePlaylist(playlist.id);
    } else {
      savePlaylist(playlist.id);
    }
  };

  const handleShare = () => {
    if (!playlist) return;
    
    const shareText = `Check out "${playlist.title}"\n\nSongs:\n${playlist.songs.map((s, i) => `${i + 1}. ${s.title} - ${s.artist}: ${s.url}`).join("\n")}`;
    
    console.log("[PLAYLIST_SHARE]", {
      playlistId: playlist.id,
      timestamp: new Date().toISOString()
    });

    if (navigator.share) {
      navigator.share({ title: playlist.title, text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleEdit = () => {
    navigate(`/playlist/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Link2 className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">Playlist not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-medium">Playlist</h1>
          <button className="p-2 -mr-2 hover:bg-secondary rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Cover */}
          <div className={`w-full md:w-48 aspect-square rounded-xl bg-gradient-to-br ${playlist.coverGradient} flex items-center justify-center flex-shrink-0`}>
            <Link2 className="w-16 h-16 text-white/30" />
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Playlist</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-muted-foreground text-sm mb-3">
              {playlist.description || "A curated collection of song links"}
            </p>

            {/* Tags */}
            {playlist.tags && playlist.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {playlist.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span>{playlist.songs.length} songs</span>
              <span>•</span>
              <span>{playlist.likesCount.toLocaleString()} likes</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {isOwn && (
                <Button variant="accent" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleLike}
                className={isLiked ? "text-red-500 border-red-500/50" : ""}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              {!isOwn && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleSave}
                  className={isSaved ? "text-foreground" : ""}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Songs List */}
        {playlist.songs.length === 0 ? (
          <div className="py-16 text-center">
            <Link2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No songs in this playlist yet</p>
            {playlist.isOwn && (
              <Button variant="outline" className="mt-4" onClick={handleEdit}>
                Add Songs
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.songs.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => handleOpenLink(song, index)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group transition-colors hover:bg-secondary"
              >
                {/* Thumbnail or Platform Icon */}
                {song.thumbnail ? (
                  <img 
                    src={song.thumbnail} 
                    alt={song.title}
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className={`w-14 h-14 rounded flex items-center justify-center flex-shrink-0 ${getPlatformColor(song.platform)}`}>
                    <span className="text-xl">{getPlatformIcon(song.platform)}</span>
                  </div>
                )}

                {/* Number */}
                <span className="text-sm text-muted-foreground w-6 text-center">{index + 1}</span>

                {/* Title & Artist */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getPlatformColor(song.platform)}`}>
                      {song.platform}
                    </span>
                  </div>
                </div>

                {/* Open Link */}
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlaylist;
