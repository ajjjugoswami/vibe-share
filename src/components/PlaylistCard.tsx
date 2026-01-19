import { Heart, Play, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { likePlaylist, unlikePlaylist } from "@/store/slices/playlistSlice";

interface Song {
  title: string;
  artist: string;
  thumbnail?: string;
}

export interface PlaylistData {
  id: string;
  username: string;
  userAvatar: string;
  verified: boolean;
  playlistName: string;
  playlistCover: string;
  coverImage?: string;
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
  coverImage,
  songs,
  totalSongs,
  likes,
  isLiked = false,
  onClick,
}: PlaylistCardProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get first song thumbnail if available
  const firstSongThumbnail = coverImage || songs[0]?.thumbnail;
  const showThumbnail = firstSongThumbnail && !imageError;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    if (!user) {
      navigate("/sign-in");
      return;
    }

    setIsLiking(true);
    try {
      if (isLikedState) {
        await dispatch(unlikePlaylist(id)).unwrap();
        setIsLikedState(false);
        setLikeCount(prev => prev - 1);
      } else {
        await dispatch(likePlaylist(id)).unwrap();
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
      className="card-elevated overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Cover - Show thumbnail if available, otherwise gradient */}
      <div className="aspect-square relative overflow-hidden">
        {showThumbnail ? (
          <img 
            src={firstSongThumbnail}
            alt={playlistName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${playlistCover}`} />
        )}
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-xl">
            <Play className="w-5 h-5 text-background ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Song count badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {totalSongs} songs
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {playlistName}
        </h3>
        <p className="text-xs text-muted-foreground truncate mt-1">
          {songs.slice(0, 2).map(s => s.artist).join(", ")}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">{username}</span>
          </div>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 text-xs transition-all duration-300 px-2 py-1 rounded-full ${
              isLikedState 
                ? "text-red-500 bg-red-500/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${isLikedState ? "fill-current scale-110" : ""}`} />
            <span>{formatNumber(likeCount)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;