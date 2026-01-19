import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Play } from "lucide-react";
import { useState } from "react";

interface Song {
  title: string;
  artist: string;
}

interface PlaylistPostProps {
  id: string;
  username: string;
  userAvatar: string;
  timeAgo: string;
  playlistName: string;
  playlistCover: string;
  songs: Song[];
  totalSongs: number;
  likes: number;
  comments: number;
  caption: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

const PlaylistPost = ({
  username,
  userAvatar,
  timeAgo,
  playlistName,
  playlistCover,
  songs,
  totalSongs,
  likes,
  comments,
  caption,
  isLiked: initialLiked = false,
  isSaved: initialSaved = false,
}: PlaylistPostProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <article className="border-b border-border pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${userAvatar} p-[2px]`}>
            <div className="w-full h-full rounded-full bg-card" />
          </div>
          <div>
            <span className="font-semibold text-sm">{username}</span>
            <span className="text-muted-foreground text-xs ml-2">• {timeAgo}</span>
          </div>
        </div>
        <button className="text-foreground p-2">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Playlist Card */}
      <div className="mx-4 rounded-2xl overflow-hidden glass-card">
        {/* Cover */}
        <div className={`aspect-square ${playlistCover} relative group cursor-pointer`}>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-neon-cyan flex items-center justify-center glow-cyan">
              <Play className="w-7 h-7 text-background ml-1" fill="currentColor" />
            </div>
          </div>
          
          {/* Playlist info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-display font-bold text-lg text-white">{playlistName}</h3>
            <p className="text-white/70 text-sm">{totalSongs} songs</p>
          </div>
        </div>

        {/* Song preview */}
        <div className="p-4 space-y-2">
          {songs.slice(0, 3).map((song, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs w-4">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>
          ))}
          {totalSongs > 3 && (
            <p className="text-xs text-neon-cyan pt-2 cursor-pointer hover:underline">
              +{totalSongs - 3} more songs
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className={`transition-all active:scale-90 ${isLiked ? "text-neon-pink" : ""}`}
          >
            <Heart 
              className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} 
            />
          </button>
          <button className="active:scale-90 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="active:scale-90 transition-transform">
            <Send className="w-6 h-6" />
          </button>
        </div>
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`active:scale-90 transition-all ${isSaved ? "text-foreground" : ""}`}
        >
          <Bookmark className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pt-2">
        <p className="font-semibold text-sm">{likeCount.toLocaleString()} likes</p>
        <p className="text-sm mt-1">
          <span className="font-semibold">{username}</span>{" "}
          <span className="text-muted-foreground">{caption}</span>
        </p>
        {comments > 0 && (
          <button className="text-muted-foreground text-sm mt-1">
            View all {comments} comments
          </button>
        )}
      </div>
    </article>
  );
};

export default PlaylistPost;
