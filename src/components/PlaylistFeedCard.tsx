import { Heart, Share2, Bookmark, Play, MoreHorizontal, Verified } from "lucide-react";
import { useState } from "react";

interface Song {
  title: string;
  artist: string;
  duration: string;
}

interface PlaylistFeedCardProps {
  id: string;
  username: string;
  userAvatar: string;
  verified: boolean;
  timeAgo: string;
  playlistName: string;
  playlistCover: string;
  description: string;
  songs: Song[];
  totalSongs: number;
  likes: number;
  shares: number;
}

const PlaylistFeedCard = ({
  username,
  userAvatar,
  verified,
  timeAgo,
  playlistName,
  playlistCover,
  description,
  songs,
  totalSongs,
  likes,
  shares,
}: PlaylistFeedCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [expanded, setExpanded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      {/* User Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${userAvatar} p-[2px]`}>
            <div className="w-full h-full rounded-full bg-card" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{username}</span>
              {verified && <Verified className="w-4 h-4 text-neon-cyan" fill="currentColor" />}
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Playlist Cover + Title */}
      <div className={`relative aspect-[16/9] bg-gradient-to-br ${playlistCover} group cursor-pointer`}>
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Playlist info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <h3 className="font-display font-bold text-xl text-white">{playlistName}</h3>
          <p className="text-white/70 text-sm mt-1">{totalSongs} songs • {description}</p>
        </div>
      </div>

      {/* Songs Preview */}
      <div className="p-4 space-y-1">
        {songs.slice(0, expanded ? songs.length : 3).map((song, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <span className="text-muted-foreground text-sm w-5 group-hover:hidden">{index + 1}</span>
            <Play className="w-4 h-4 text-neon-cyan hidden group-hover:block" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{song.title}</p>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </div>
            <span className="text-xs text-muted-foreground">{song.duration}</span>
          </div>
        ))}
        
        {totalSongs > 3 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 text-sm text-neon-cyan font-medium hover:underline"
          >
            {expanded ? "Show less" : `+${totalSongs - 3} more songs`}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1 border-t border-border/50">
        <div className="flex items-center gap-1">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted transition-all active:scale-95 ${
              isLiked ? "text-neon-pink" : "text-muted-foreground"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{formatNumber(likeCount)}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted transition-all active:scale-95 text-muted-foreground">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">{formatNumber(shares)}</span>
          </button>
        </div>
        
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-full hover:bg-muted transition-all active:scale-95 ${
            isSaved ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
};

export default PlaylistFeedCard;
