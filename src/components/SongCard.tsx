import { Play, TrendingUp } from "lucide-react";

interface SongCardProps {
  title: string;
  artist: string;
  cover: string;
  addedBy: number;
  rank?: number;
}

const SongCard = ({ title, artist, cover, addedBy, rank }: SongCardProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
      {rank && (
        <span className={`w-5 text-center text-sm font-medium ${
          rank <= 2 ? "text-accent" : "text-muted-foreground"
        }`}>
          {rank}
        </span>
      )}
      
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cover} flex-shrink-0 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-3 h-3 text-white" fill="currentColor" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
      </div>
      
      <span className="text-xs text-muted-foreground">
        {addedBy >= 1000 ? (addedBy / 1000).toFixed(1) + "K" : addedBy} adds
      </span>
    </div>
  );
};

export default SongCard;
