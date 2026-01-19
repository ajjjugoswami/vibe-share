import { Play, Heart } from "lucide-react";

interface PlaylistCardProps {
  title: string;
  creator: string;
  coverGradient: string;
  songCount: number;
  likes: number;
}

const PlaylistCard = ({ title, creator, coverGradient, songCount, likes }: PlaylistCardProps) => {
  return (
    <div className="group relative glass-card p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer">
      {/* Cover Art */}
      <div className={`relative aspect-square rounded-xl mb-4 overflow-hidden ${coverGradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <button className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-neon-cyan flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 glow-cyan">
          <Play className="w-5 h-5 text-background ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Info */}
      <h3 className="font-display font-semibold text-foreground truncate mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground truncate mb-3">
        by {creator}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{songCount} songs</span>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
