import { Play, TrendingUp, Flame } from "lucide-react";

interface SongCardProps {
  title: string;
  artist: string;
  cover: string;
  addedBy: number;
  rank?: number;
}

const SongCard = ({ title, artist, cover, addedBy, rank }: SongCardProps) => {
  return (
    <div className="glass-card p-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
      {rank && (
        <div className={`w-6 text-center font-display font-bold ${
          rank === 1 ? "neon-text-pink" : rank === 2 ? "neon-text-cyan" : "text-muted-foreground"
        }`}>
          {rank}
        </div>
      )}
      
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cover} flex-shrink-0 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-4 h-4 text-white" fill="currentColor" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
      </div>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Flame className="w-3 h-3 text-neon-pink" />
        <span>{addedBy >= 1000 ? (addedBy / 1000).toFixed(1) + "K" : addedBy}</span>
      </div>
    </div>
  );
};

export default SongCard;
