import { X, Heart, Share2, MoreHorizontal, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlaylistData } from "./PlaylistCard";

interface SongLink {
  title: string;
  artist: string;
  url: string;
  platform: string;
}

interface PlaylistDetailProps {
  playlist: PlaylistData;
  onClose: () => void;
}

const allSongs: SongLink[] = [
  { title: "Die For You", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=mTLQhPFx2nM", platform: "YouTube" },
  { title: "Blinding Lights", artist: "The Weeknd", url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b", platform: "Spotify" },
  { title: "Save Your Tears", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=XXYlFuWEuKI", platform: "YouTube" },
  { title: "After Hours", artist: "The Weeknd", url: "https://open.spotify.com/track/2p8IUWQDrpjuFltbdgLOag", platform: "Spotify" },
  { title: "Starboy", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=34Na4j8AVgA", platform: "YouTube" },
  { title: "The Hills", artist: "The Weeknd", url: "https://soundcloud.com/theweeknd/the-hills", platform: "SoundCloud" },
  { title: "Can't Feel My Face", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=KEI4qSrkPAs", platform: "YouTube" },
  { title: "Often", artist: "The Weeknd", url: "https://open.spotify.com/track/4PhsKqMdgMEUSstTDAmMpg", platform: "Spotify" },
];

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "YouTube": return "bg-red-500/20 text-red-400";
    case "Spotify": return "bg-green-500/20 text-green-400";
    case "SoundCloud": return "bg-orange-500/20 text-orange-400";
    case "Apple Music": return "bg-pink-500/20 text-pink-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const PlaylistDetail = ({ playlist, onClose }: PlaylistDetailProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleOpenLink = (song: SongLink, index: number) => {
    console.log("[SONG_LINK_OPENED]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      songIndex: index,
      songTitle: song.title,
      songArtist: song.artist,
      platform: song.platform,
      url: song.url,
      timestamp: new Date().toISOString()
    });
    window.open(song.url, "_blank", "noopener,noreferrer");
  };

  const handleLike = () => {
    const newState = !isLiked;
    setIsLiked(newState);
    console.log("[PLAYLIST_LIKE_DETAIL]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      action: newState ? "liked" : "unliked",
      timestamp: new Date().toISOString()
    });
  };

  const handleSave = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    console.log("[PLAYLIST_SAVE]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      action: newState ? "saved" : "unsaved",
      timestamp: new Date().toISOString()
    });
  };

  const handleShare = () => {
    const shareText = `Check out "${playlist.playlistName}" by ${playlist.username}\n\nSongs:\n${allSongs.map((s, i) => `${i + 1}. ${s.title} - ${s.artist}: ${s.url}`).join("\n")}`;
    
    console.log("[PLAYLIST_SHARE]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      username: playlist.username,
      timestamp: new Date().toISOString()
    });

    if (navigator.share) {
      navigator.share({ title: playlist.playlistName, text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      console.log("[SHARE_COPIED_TO_CLIPBOARD]", { timestamp: new Date().toISOString() });
    }
  };

  const handleClose = () => {
    console.log("[PLAYLIST_CLOSED]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      <div className="h-full overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
            <button onClick={handleClose} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h1 className="font-medium">Playlist</h1>
            <button className="p-2 -mr-2 hover:bg-secondary rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Playlist Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Cover */}
            <div className={`w-full md:w-48 aspect-square rounded-xl bg-gradient-to-br ${playlist.playlistCover} flex-shrink-0`} />
            
            {/* Info */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Playlist</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{playlist.playlistName}</h1>
              <p className="text-muted-foreground text-sm mb-4">
                {playlist.description || "A curated collection of song links"}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="font-medium text-foreground">{playlist.username}</span>
                <span>•</span>
                <span>{playlist.totalSongs} songs</span>
                <span>•</span>
                <span>{playlist.likes.toLocaleString()} likes</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleLike}
                  className={isLiked ? "text-red-500 border-red-500/50" : ""}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleSave}
                  className={isSaved ? "text-foreground" : ""}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Songs List */}
          <div className="space-y-1">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[32px_1fr_120px_100px] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-border">
              <span>#</span>
              <span>Title</span>
              <span>Platform</span>
              <span className="text-right">Action</span>
            </div>

            {/* Songs */}
            {allSongs.map((song, index) => (
              <div 
                key={index}
                onClick={() => handleOpenLink(song, index)}
                className="grid grid-cols-[32px_1fr_100px] md:grid-cols-[32px_1fr_120px_100px] gap-4 px-4 py-3 rounded-lg cursor-pointer group transition-colors hover:bg-secondary"
              >
                {/* Number */}
                <div className="flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">{index + 1}</span>
                </div>

                {/* Title & Artist */}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>

                {/* Platform - Desktop only */}
                <div className="hidden md:flex items-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPlatformColor(song.platform)}`}>
                    {song.platform}
                  </span>
                </div>

                {/* Open Link */}
                <div className="flex items-center justify-end gap-2">
                  <span className={`md:hidden text-xs px-2 py-0.5 rounded-full ${getPlatformColor(song.platform)}`}>
                    {song.platform}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
