import { useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";
import { triggerHaptic } from "@/hooks/useHaptic";
import { SongLink } from "@/contexts/PlaylistContext";

interface SwipeableQueueItemProps {
  song: SongLink;
  index: number;
  isActive: boolean;
  isTemporary?: boolean;
  onSelect: () => void;
  onRemove?: () => void;
  innerRef?: React.Ref<HTMLButtonElement>;
}

const SWIPE_THRESHOLD = 80;

const SwipeableQueueItem = ({
  song,
  index,
  isActive,
  isTemporary = false,
  onSelect,
  onRemove,
  innerRef,
}: SwipeableQueueItemProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onRemove) return;
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onRemove) return;
    const currentX = e.touches[0].clientX;
    const diff = startXRef.current - currentX;
    
    if (diff > 10) {
      isDraggingRef.current = true;
    }
    
    if (isDraggingRef.current) {
      const newTranslate = Math.min(0, Math.max(-SWIPE_THRESHOLD - 20, -diff));
      setTranslateX(newTranslate);
      
      if (-diff <= -SWIPE_THRESHOLD && translateX > -SWIPE_THRESHOLD) {
        triggerHaptic("medium");
      }
    }
  };

  const handleTouchEnd = () => {
    if (!onRemove) return;
    
    if (translateX <= -SWIPE_THRESHOLD) {
      // Trigger remove
      setIsRemoving(true);
      triggerHaptic("success");
      setTimeout(() => {
        onRemove();
      }, 200);
    } else if (!isDraggingRef.current) {
      // It was a tap, not a swipe
      onSelect();
    }
    
    if (!isRemoving) {
      setTranslateX(0);
    }
    isDraggingRef.current = false;
  };

  return (
    <div className={cn("relative overflow-hidden", isRemoving && "animate-slide-out-right")}>
      {/* Delete background */}
      {onRemove && (
        <div className="absolute inset-y-0 right-0 w-20 bg-destructive flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-destructive-foreground" />
        </div>
      )}
      
      {/* Main content */}
      <button
        ref={innerRef}
        onClick={!isDraggingRef.current && !onRemove ? onSelect : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDraggingRef.current ? "none" : "transform 0.2s ease-out",
        }}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors border-b border-border/10 bg-background",
          isActive ? "bg-primary/10" : "hover:bg-muted/30"
        )}
      >
        <div className="w-5 shrink-0 flex justify-center">
          {isActive ? (
            <div className="flex items-center gap-[2px]">
              <div className="w-[2px] h-2 bg-primary rounded-sm animate-music-bar-1"></div>
              <div className="w-[2px] h-2 bg-primary rounded-sm animate-music-bar-2"></div>
              <div className="w-[2px] h-2 bg-primary rounded-sm animate-music-bar-3"></div>
            </div>
          ) : (
            <span className="text-[10px] text-muted-foreground">{index + 1}</span>
          )}
        </div>
        {song.thumbnail ? (
          <img
            src={song.thumbnail}
            alt=""
            className="w-12 h-9 rounded object-cover shrink-0"
          />
        ) : (
          <div
            className={`w-12 h-9 rounded flex items-center justify-center shrink-0 ${getPlatformColor(song.platform)}`}
          >
            {getPlatformIcon(song.platform)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs font-normal leading-tight line-clamp-2",
              isActive ? "text-foreground" : "text-foreground/80"
            )}
          >
            {song.title}
          </p>
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
            {song.artist}
          </p>
        </div>
        
        {/* Swipe hint */}
        {onRemove && translateX === 0 && (
          <div className="text-[10px] text-muted-foreground/50 pr-1">←</div>
        )}
      </button>
    </div>
  );
};

export default SwipeableQueueItem;
