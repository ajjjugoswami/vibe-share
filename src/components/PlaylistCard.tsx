import { Heart, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useAuth } from "../contexts/AuthContext";

interface Song {
  title: string;
  artist: string;
}

export interface PlaylistData {
  id: string;
  username: string;
  userAvatar: string;
  verified: boolean;
  playlistName: string;
  playlistCover: string;
  description?: string;
  songs: Song[];
  totalSongs: number;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface PlaylistCardProps extends PlaylistData {
  onClick: () => void;
}

const PlaylistCard = ({
  id,
  username,
  playlistName,
  playlistCover,
  songs,
  totalSongs,
  likes,
  isLiked = false,
  onClick,
}: PlaylistCardProps) => {
  const { likePlaylist, unlikePlaylist } = usePlaylist();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }

    setIsLiking(true);
    try {
      if (isLikedState) {
        await unlikePlaylist(id);
        setIsLikedState(false);
        setLikeCount(prev => prev - 1);
      } else {
        await likePlaylist(id);
        setIsLikedState(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden card-hover cursor-pointer group"
    >
      {/* Cover */}
      <div className={`aspect-square bg-gradient-to-br ${playlistCover} relative`}>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{playlistName}</h3>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {songs.slice(0, 2).map(s => s.artist).join(", ")} • {totalSongs} songs
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{username}</span>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 text-xs transition-colors ${
              isLikedState ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            } ${isLiking ? "opacity-50" : ""}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLikedState ? "fill-current" : ""}`} />
            <span>{formatNumber(likeCount)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
