import { Heart, Share2, Bookmark, MoreHorizontal, Play, Music2, BookmarkCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Dropdown, App } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { likePlaylist, unlikePlaylist, savePlaylist, unsavePlaylist } from "@/store/slices/playlistSlice";
import UserAvatar from "@/components/UserAvatar";
import { triggerHaptic } from "@/hooks/useHaptic";
import ShareDrawer from "@/components/ShareDrawer";

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
  userAvatar,
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
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setIsLikedState(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setIsSavedState(isSaved);
  }, [isSaved]);

  useEffect(() => {
    setLikeCount(likes);
  }, [likes]);

  const firstSongThumbnail = coverImage;
  const showThumbnail = firstSongThumbnail && !imageError;

  const handleLike = async (e?: React.MouseEvent, skipAnimation = false) => {
    if (e) e.stopPropagation();
    if (isLiking) return;

    if (!skipAnimation) {
      triggerHaptic('light');
    }

    if (!user) {
      navigate("/sign-in");
      return;
    }

    // Optimistic update
    const wasLiked = isLikedState;
    setIsLikedState(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await dispatch(unlikePlaylist(id)).unwrap();
      } else {
        await dispatch(likePlaylist(id)).unwrap();
      }
    } catch (error) {
      // Revert on error
      setIsLikedState(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
      console.error("Failed to toggle like:", error);
    }
  };

  // Double-tap to like (Instagram-style)
  const handleDoubleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      e.stopPropagation();
      if (!isLikedState && user) {
        setShowLikeAnimation(true);
        triggerHaptic('medium');
        handleLike(undefined, true);
        setTimeout(() => setShowLikeAnimation(false), 800);
      }
    } else {
      lastTapRef.current = now;
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaving) return;

    triggerHaptic('medium');

    if (!user) {
      navigate("/sign-in");
      return;
    }

    // Optimistic update
    const wasSaved = isSavedState;
    setIsSavedState(!wasSaved);

    try {
      if (wasSaved) {
        await dispatch(unsavePlaylist(id)).unwrap();
        message.success("Removed from saved");
      } else {
        await dispatch(savePlaylist(id)).unwrap();
        message.success("Saved to collection");
      }
    } catch (error) {
      // Revert on error
      setIsSavedState(wasSaved);
      message.error("Action failed, please try again");
      console.error("Failed to toggle save:", error);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setShareDrawerOpen(true);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const truncatedDescription = description && description.length > 120 
    ? description.slice(0, 120) + "..." 
    : description;

  const menuItems = [
    { 
      key: 'copyLink', 
      label: 'Copy Link', 
      onClick: () => {
        navigator.clipboard.writeText(`${window.location.origin}/playlist/${id}`);
        message.success("Link copied!");
      }
    },
  ];

  return (
    <article className="bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2.5">
        <button 
          type="button"
          className="flex items-center gap-2.5 group touch-manipulation text-left flex-1 min-w-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${username}`);
          }}
        >
          <UserAvatar avatarUrl={userAvatar} size={32} className="ring-1 ring-border/20" />
          <div className="min-w-0">
            <Text strong className="text-sm block group-active:text-primary/80 transition-colors truncate">
              {username}
            </Text>
          </div>
        </button>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <button 
            type="button"
            className="p-2 -mr-2 rounded-full hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation"
            onClick={(e) => e.stopPropagation()}
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </Dropdown>
      </div>

      {/* Cover Image */}
      <button 
        type="button"
        className="relative w-full group overflow-hidden touch-manipulation text-left"
        onClick={(e) => {
          handleDoubleTap(e);
          onClick();
        }}
      >
        <div className="aspect-square w-full bg-muted">
          {showThumbnail ? (
            <img 
              src={firstSongThumbnail}
              alt={playlistName}
              className="w-full h-full object-cover select-none"
              draggable={false}
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Image failed to load:', firstSongThumbnail, e);
                setImageError(true);
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${playlistCover} flex items-center justify-center`}>
              <div className="text-center text-white/90">
                <Music2 className="w-20 h-20 mx-auto mb-3 opacity-80" strokeWidth={1.5} />
                <p className="text-base font-semibold">{totalSongs} tracks</p>
              </div>
            </div>
          )}
        </div>

        {/* Double-tap like animation */}
        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Heart 
              className="w-28 h-28 text-white fill-white animate-[ping_0.8s_ease-out]" 
              strokeWidth={0}
            />
          </div>
        )}
      </button>

      {/* Actions - Instagram style */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-2">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={handleLike}
            disabled={isLiking}
            className={`transition-all duration-200 touch-manipulation active:scale-90 ${
              isLikedState ? "text-red-500" : "text-foreground"
            } ${isLiking ? "opacity-50" : ""}`}
            aria-label={isLikedState ? "Unlike" : "Like"}
          >
            <Heart 
              className={`w-7 h-7 transition-all duration-200 ${
                isLikedState ? "fill-current scale-110" : ""
              }`}
              strokeWidth={isLikedState ? 2.5 : 2}
            />
          </button>
          <button 
            type="button"
            onClick={handleShare}
            className="text-foreground transition-all duration-200 active:scale-90 touch-manipulation"
            aria-label="Share"
          >
            <Share2 className="w-[26px] h-[26px]" strokeWidth={2} />
          </button>
        </div>
        <button 
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={`transition-all duration-200 touch-manipulation active:scale-90 ${
            isSavedState ? "text-foreground" : "text-foreground"
          } ${isSaving ? "opacity-50" : ""}`}
          aria-label={isSavedState ? "Unsave" : "Save"}
        >
          {isSavedState ? (
            <BookmarkCheck className="w-7 h-7 fill-current" strokeWidth={2} />
          ) : (
            <Bookmark className="w-7 h-7" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Likes count */}
      <div className="px-3 pb-1.5">
        <Text strong className="text-sm">
          {formatNumber(likeCount)} {likeCount === 1 ? 'like' : 'likes'}
        </Text>
      </div>

      {/* Title and Description */}
      <div className="px-3 pb-3">
        <div className="mb-0.5">
          <Text strong className="text-sm mr-2">{username}</Text>
          <Text className="text-sm">{playlistName}</Text>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {showFullDescription ? description : truncatedDescription}
            {description.length > 120 && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowFullDescription(!showFullDescription); 
                }}
                className="text-muted-foreground/70 ml-1 font-medium hover:text-muted-foreground"
              >
                {showFullDescription ? "less" : "more"}
              </button>
            )}
          </p>
        )}
        <Text type="secondary" className="text-xs block mt-1">
          {totalSongs} {totalSongs === 1 ? 'song' : 'songs'}
        </Text>
      </div>

      {/* Share Drawer */}
      <ShareDrawer
        open={shareDrawerOpen}
        onClose={() => setShareDrawerOpen(false)}
        shareUrl={`${window.location.origin}/playlist/${id}`}
        shareTitle="Share Playlist"
        shareText={`Check out "${playlistName}" on VibeShare!`}
      />
    </article>
  );
};

export default PlaylistPost;