import { X, ChevronUp, SkipBack, SkipForward, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/contexts/PlayerContext";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";

const MiniPlayerBar = () => {
  const { playerState, expandPlayer, closePlayer, nextSong, prevSong } = usePlayer();

  if (!playerState || playerState.isExpanded) return null;

  const currentSong = playerState.songs[playerState.currentIndex];
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-2 pb-2 md:bottom-4 md:left-auto md:right-4 md:px-0 md:w-[380px]">
      <div 
        className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
        onClick={expandPlayer}
      >
        <div className="flex items-center gap-3 p-3 cursor-pointer">
          {/* Thumbnail */}
          {currentSong.thumbnail ? (
            <img 
              src={currentSong.thumbnail} 
              alt="" 
              className="w-12 h-12 rounded-xl object-cover shrink-0" 
            />
          ) : (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getPlatformColor(currentSong.platform)}`}>
              {getPlatformIcon(currentSong.platform)}
            </div>
          )}

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {/* Playing Indicator */}
              <div className="flex items-end gap-0.5 h-3 shrink-0">
                <div className="w-0.5 bg-primary rounded-full animate-music-bar-1"></div>
                <div className="w-0.5 bg-primary rounded-full animate-music-bar-2"></div>
                <div className="w-0.5 bg-primary rounded-full animate-music-bar-3"></div>
              </div>
              <p className="text-sm font-medium truncate">{currentSong.title}</p>
            </div>
            <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSong}
              disabled={playerState.currentIndex === 0}
              className="h-9 w-9 rounded-full hover:bg-muted disabled:opacity-30"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSong}
              disabled={playerState.currentIndex === playerState.songs.length - 1}
              className="h-9 w-9 rounded-full hover:bg-muted disabled:opacity-30"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={expandPlayer}
              className="h-9 w-9 rounded-full hover:bg-muted"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closePlayer}
              className="h-9 w-9 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="h-0.5 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: `${((playerState.currentIndex + 1) / playerState.songs.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MiniPlayerBar;
