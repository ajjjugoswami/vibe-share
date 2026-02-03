import { Music2 } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { getPlatformColor } from "@/lib/songUtils";

const MiniPlayerBar = () => {
  const { playerState, expandPlayer } = usePlayer();

  if (!playerState || playerState.isExpanded) return null;

  const currentSong = playerState.songs[playerState.currentIndex];
  if (!currentSong) return null;

  return (
    <div 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 cursor-pointer group"
      onClick={expandPlayer}
    >
      {/* Rotating Disc */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-1 shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform">
          {/* Inner Disc */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-card to-muted border-2 border-primary/30 overflow-hidden relative animate-spin-slow">
            {/* Center Hole */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-background border-2 border-primary/50 z-10" />
            </div>
            
            {/* Thumbnail or Icon */}
            {currentSong.thumbnail ? (
              <img 
                src={currentSong.thumbnail} 
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${getPlatformColor(currentSong.platform)}`}>
                <Music2 className="w-8 h-8 text-white/80" />
              </div>
            )}
          </div>
        </div>
        
        {/* Playing Indicator Dots */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
          <div className="w-1 h-1 bg-primary rounded-full animate-music-bar-1"></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-music-bar-2"></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-music-bar-3"></div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayerBar;
