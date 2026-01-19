import { X, Play, Pause, Heart, Share2, Clock, MoreHorizontal, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlaylistData } from "./PlaylistCard";

interface PlaylistDetailProps {
  playlist: PlaylistData;
  onClose: () => void;
}

const allSongs = [
  { title: "Die For You", artist: "The Weeknd", duration: "3:52", album: "Starboy" },
  { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", album: "After Hours" },
  { title: "Save Your Tears", artist: "The Weeknd", duration: "3:35", album: "After Hours" },
  { title: "After Hours", artist: "The Weeknd", duration: "6:01", album: "After Hours" },
  { title: "Starboy", artist: "The Weeknd", duration: "3:50", album: "Starboy" },
  { title: "The Hills", artist: "The Weeknd", duration: "4:02", album: "Beauty Behind the Madness" },
  { title: "Can't Feel My Face", artist: "The Weeknd", duration: "3:33", album: "Beauty Behind the Madness" },
  { title: "Often", artist: "The Weeknd", duration: "4:09", album: "Beauty Behind the Madness" },
];

const PlaylistDetail = ({ playlist, onClose }: PlaylistDetailProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlaySong = (index: number, song: typeof allSongs[0]) => {
    const isNowPlaying = playingIndex !== index;
    setPlayingIndex(isNowPlaying ? index : null);
    
    console.log("[SONG_PLAY]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      songIndex: index,
      songTitle: song.title,
      songArtist: song.artist,
      action: isNowPlaying ? "play" : "pause",
      timestamp: new Date().toISOString()
    });
  };

  const handlePlayAll = () => {
    console.log("[PLAYLIST_PLAY_ALL]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      totalSongs: allSongs.length,
      timestamp: new Date().toISOString()
    });
    setPlayingIndex(0);
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
    console.log("[PLAYLIST_SHARE]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      username: playlist.username,
      timestamp: new Date().toISOString()
    });
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
                {playlist.description || "A curated collection of songs"}
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
                <Button variant="accent" onClick={handlePlayAll}>
                  <Play className="w-4 h-4" fill="currentColor" />
                  Play All
                </Button>
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
            <div className="hidden md:grid grid-cols-[32px_1fr_1fr_80px] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-border">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span className="text-right">
                <Clock className="w-4 h-4 inline" />
              </span>
            </div>

            {/* Songs */}
            {allSongs.map((song, index) => (
              <div 
                key={index}
                onClick={() => handlePlaySong(index, song)}
                className={`grid grid-cols-[32px_1fr_80px] md:grid-cols-[32px_1fr_1fr_80px] gap-4 px-4 py-3 rounded-lg cursor-pointer group transition-colors ${
                  playingIndex === index ? "bg-accent/10" : "hover:bg-secondary"
                }`}
              >
                {/* Number / Play */}
                <div className="flex items-center justify-center">
                  {playingIndex === index ? (
                    <Pause className="w-4 h-4 text-accent" />
                  ) : (
                    <>
                      <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
                      <Play className="w-4 h-4 hidden group-hover:block" />
                    </>
                  )}
                </div>

                {/* Title & Artist */}
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${playingIndex === index ? "text-accent" : ""}`}>
                    {song.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>

                {/* Album - Desktop only */}
                <p className="hidden md:block text-sm text-muted-foreground truncate self-center">
                  {song.album}
                </p>

                {/* Duration */}
                <p className="text-sm text-muted-foreground text-right self-center">
                  {song.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
