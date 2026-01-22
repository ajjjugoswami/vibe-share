import { useState } from "react";
import { X, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MiniPlayerProps {
  url: string;
  title: string;
  artist?: string;
  platform: string;
  onClose: () => void;
}

const getEmbedUrl = (url: string, platform: string): string | null => {
  if (platform === "YouTube") {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
      }
    }
  }
  
  if (platform === "Spotify") {
    // Convert Spotify URLs to embed format
    const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }
  }
  
  if (platform === "SoundCloud") {
    // SoundCloud requires their widget API - return null to show external link
    return null;
  }
  
  return null;
};

const MiniPlayer = ({ url, title, artist, platform, onClose }: MiniPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const embedUrl = getEmbedUrl(url, platform);

  const handleOpenExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Player Modal */}
      <div 
        className={cn(
          "fixed z-50 bg-card border border-border/50 shadow-2xl transition-all duration-300 overflow-hidden",
          isExpanded 
            ? "inset-4 md:inset-8 rounded-2xl" 
            : "bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[400px] rounded-2xl"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/30 bg-background/50">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-sm font-medium truncate">{title}</p>
            {artist && <p className="text-xs text-muted-foreground truncate">{artist}</p>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleOpenExternal}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className={cn(
          "bg-black",
          isExpanded ? "h-[calc(100%-52px)]" : "aspect-video"
        )}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-card">
              <p className="text-muted-foreground text-center text-sm">
                This platform doesn't support in-app playback
              </p>
              <Button onClick={handleOpenExternal} className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Open in {platform}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
