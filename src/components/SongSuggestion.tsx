import { Play, Plus, TrendingUp } from "lucide-react";

interface SongSuggestionProps {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  suggestedBy: number;
}

const SongSuggestion = ({ title, artist, albumCover, suggestedBy }: SongSuggestionProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="glass-card p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-neon-pink" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Song Suggestion
        </span>
        <span className="text-xs text-muted-foreground">
          • {formatNumber(suggestedBy)} people added this
        </span>
      </div>

      {/* Song Card */}
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${albumCover} flex-shrink-0 relative group cursor-pointer overflow-hidden`}>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-8 h-8 text-white" fill="currentColor" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <p className="text-muted-foreground truncate">{artist}</p>
        </div>

        {/* Add Button */}
        <button className="w-10 h-10 rounded-full border-2 border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan/10 transition-colors active:scale-95">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SongSuggestion;
