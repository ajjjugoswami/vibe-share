import { Heart, Share2, Bookmark, Play, Verified } from "lucide-react";
import { useState } from "react";

interface Song {
  title: string;
  artist: string;
}

interface PlaylistCardProps {
  id: string;
  username: string;
  userAvatar: string;
  verified: boolean;
  playlistName: string;
  playlistCover: string;
  songs: Song[];
  totalSongs: number;
  likes: number;
}

const PlaylistCard = ({
  username,
  userAvatar,
  verified,
  playlistName,
  playlistCover,
  songs,
  totalSongs,
  likes,
}: PlaylistCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="glass-card overflow-hidden hover:bg-white/5 transition-colors group cursor-pointer">
      {/* Cover */}
      <div className={`aspect-[4/3] bg-gradient-to-br ${playlistCover} relative`}>
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        
        {/* Song count badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white">
          {totalSongs} songs
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-sm truncate mb-1">{playlistName}</h3>
        
        {/* Songs preview */}
        <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {songs.slice(0, 3).map(s => s.title).join(" • ")}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${userAvatar}`} />
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{username}</span>
              {verified && <Verified className="w-3 h-3 text-neon-cyan" fill="currentColor" />}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-neon-pink" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{formatNumber(likeCount)}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              className={`transition-colors ${isSaved ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
