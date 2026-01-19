import { Heart, Share2, Bookmark, MoreHorizontal, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Typography, Dropdown, App } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { likePlaylist, unlikePlaylist, savePlaylist, unsavePlaylist } from "@/store/slices/playlistSlice";

const { Text } = Typography;

interface Song {
  title: string;
  artist: string;
  thumbnail?: string;
}

export interface PlaylistPostData {
  id: string;
  username: string;
  userAvatar?: string;
  playlistName: string;
  playlistCover: string;
  coverImage?: string;
  description?: string;
  songs: Song[];
  totalSongs: number;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt?: string;
}

interface PlaylistPostProps extends PlaylistPostData {
  onClick: () => void;
}

const PlaylistPost = ({
  id,
  username,
  playlistName,
  playlistCover,
  coverImage,
  description,
  songs,
  totalSongs,
  likes,
  isLiked = false,
  isSaved = false,
  onClick,
}: PlaylistPostProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isSavedState, setIsSavedState] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaving) return;

    if (!user) {
      navigate("/sign-in");
      return;
    }

    setIsSaving(true);
    try {
      if (isSavedState) {
        await dispatch(unsavePlaylist(id)).unwrap();
        setIsSavedState(false);
        message.success("Removed from saved");
      } else {
        await dispatch(savePlaylist(id)).unwrap();
        setIsSavedState(true);
        message.success("Saved to collection");
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/playlist/${id}`;
    const shareText = `Check out "${playlistName}" playlist!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: playlistName, text: shareText, url: shareUrl });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      message.success("Link copied to clipboard");
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const truncatedDescription = description && description.length > 100 
    ? description.slice(0, 100) + "..." 
    : description;

  const menuItems = [
    { key: 'report', label: 'Report' },
    { key: 'copyLink', label: 'Copy Link' },
  ];

  return (
    <article className="bg-background border-b border-border">
      {/* Header - User Info */}
      <div className="flex items-center justify-between px-4 py-3">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/user/${username}`)}
        >
          <Avatar 
            size={32} 
            className="bg-gradient-to-br from-primary to-primary/50"
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong className="text-sm">{username}</Text>
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <button className="p-1 hover:bg-secondary rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </Dropdown>
      </div>

      {/* Content - Playlist Cover */}
      <div 
        className="relative cursor-pointer group"
        onClick={onClick}
      >
        <div className="aspect-square w-full">
          {showThumbnail ? (
            <img 
              src={firstSongThumbnail}
              alt={playlistName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${playlistCover} flex items-center justify-center`}>
              <div className="text-center text-white/70">
                <Play className="w-16 h-16 mx-auto mb-2" />
                <p className="text-lg font-medium">{totalSongs} songs</p>
              </div>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-xl">
            <Play className="w-7 h-7 text-background ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Song count badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
          {totalSongs} songs
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`transition-all duration-200 active:scale-90 ${isLiking ? "opacity-50" : ""}`}
            >
              <Heart 
                className={`w-6 h-6 ${isLikedState ? "text-red-500 fill-current" : "hover:text-muted-foreground"}`} 
              />
            </button>
            <button 
              onClick={handleShare}
              className="transition-all duration-200 active:scale-90"
            >
              <Share2 className="w-6 h-6 hover:text-muted-foreground" />
            </button>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`transition-all duration-200 active:scale-90 ${isSaving ? "opacity-50" : ""}`}
          >
            <Bookmark 
              className={`w-6 h-6 ${isSavedState ? "fill-current" : "hover:text-muted-foreground"}`} 
            />
          </button>
        </div>

        {/* Like count */}
        <Text strong className="text-sm mb-1 block">
          {formatNumber(likeCount)} likes
        </Text>

        {/* Caption */}
        <div className="text-sm">
          <Text strong className="mr-2">{username}</Text>
          <Text>
            {playlistName}
            {description && (
              <>
                {" - "}
                {showFullDescription ? description : truncatedDescription}
                {description.length > 100 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowFullDescription(!showFullDescription); }}
                    className="text-muted-foreground ml-1"
                  >
                    {showFullDescription ? "less" : "more"}
                  </button>
                )}
              </>
            )}
          </Text>
        </div>

        {/* Songs preview */}
        {songs.length > 0 && (
          <button 
            onClick={onClick}
            className="text-muted-foreground text-sm mt-1 hover:underline"
          >
            View all {totalSongs} songs
          </button>
        )}
      </div>
    </article>
  );
};

export default PlaylistPost;