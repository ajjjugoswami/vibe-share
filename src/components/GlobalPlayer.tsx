import { useEffect, useRef } from "react";
import { X, ExternalLink, Music2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/contexts/PlayerContext";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";
import MiniPlayerBar from "./MiniPlayerBar";

const getEmbedUrl = (url: string, platform: string): string | null => {
  if (platform === "YouTube") {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        // return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=0&rel=0&enablejsapi=1&controls=1&modestbranding=1&fs=0&iv_load_policy=3&disablekb=1`;

        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=0&rel=0&enablejsapi=1&controls=0&modestbranding=1&fs=0&iv_load_policy=3&disablekb=1`;
      }
    }
  }

  if (platform === "Spotify") {
    const match = url.match(
      /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    );
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }
  }

  return null;
};

const GlobalPlayer = () => {
  const {
    playerState,
    setCurrentIndex,
    nextSong,
    prevSong,
    minimizePlayer,
    closePlayer,
  } = usePlayer();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentSong = playerState?.songs[playerState.currentIndex];
  const embedUrl = currentSong
    ? getEmbedUrl(currentSong.url, currentSong.platform)
    : null;

  // Media Session API for background/lock screen controls
  useEffect(() => {
    if (!playerState || !currentSong) return;

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist || "Unknown Artist",
        album: playerState.playlistTitle,
        artwork: currentSong.thumbnail
          ? [
              {
                src: currentSong.thumbnail,
                sizes: "512x512",
                type: "image/png",
              },
            ]
          : [],
      });

      navigator.mediaSession.setActionHandler("previoustrack", prevSong);
      navigator.mediaSession.setActionHandler("nexttrack", nextSong);
    }

    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      }
    };
  }, [currentSong, prevSong, nextSong, playerState?.playlistTitle]);

  const handleOpenExternal = () => {
    if (currentSong) {
      window.open(currentSong.url, "_blank", "noopener,noreferrer");
    }
  };

  if (!playerState) return null;

  return (
    <>
      {/* COMMENTED OUT: Hidden Player - Always mounted to maintain playback */}
      {/* This was causing duplicate playback - keeping only the visible iframe */}
      {/* <div className="fixed -top-[9999px] -left-[9999px] w-[1px] h-[1px] overflow-hidden">
        {embedUrl && (
          <iframe
            ref={iframeRef}
            key={`hidden-${currentSong?.id || playerState.currentIndex}`}
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            title={currentSong?.title}
          />
        )}
      </div> */}

      {/* COMMENTED OUT: Mini Player Bar (when minimized) */}
      {/* <MiniPlayerBar /> */}

      {/* Full Player Modal (when expanded) */}
      {playerState.isExpanded && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={minimizePlayer}
          />

          {/* Player Content */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col bg-background md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-[85vh] md:w-[440px] md:max-h-[700px] md:rounded-xl md:border md:border-border/50">
            {/* Compact Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-border/30 shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="flex items-end gap-[2px] h-3 shrink-0">
                  <div className="w-[3px] bg-primary rounded-sm animate-music-bar-1"></div>
                  <div className="w-[3px] bg-primary rounded-sm animate-music-bar-2"></div>
                  <div className="w-[3px] bg-primary rounded-sm animate-music-bar-3"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate leading-tight">
                    {currentSong?.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate leading-tight">
                    {currentSong?.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted/50"
                  onClick={handleOpenExternal}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                {/* <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-muted/50"
                  onClick={minimizePlayer}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted/50"
                  onClick={closePlayer}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Player Area - Actual playback happens here */}
            <div className="w-full aspect-video bg-black shrink-0">
              {embedUrl ? (
                <iframe
                  ref={iframeRef}
                  key={currentSong?.id || playerState.currentIndex}
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentSong?.title}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-b from-card to-muted">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center ${currentSong ? getPlatformColor(currentSong.platform) : "bg-muted"}`}
                  >
                    <Music2 className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{currentSong?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentSong?.artist}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-center text-xs max-w-[240px]">
                    This platform doesn't support in-app playback
                  </p>
                  <Button
                    size="sm"
                    onClick={handleOpenExternal}
                    className="gap-1.5 h-8 text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open in {currentSong?.platform}
                  </Button>
                </div>
              )}
            </div>

            {/* Queue Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-y border-border/20 shrink-0">
              <p className="text-xs font-medium">Queue</p>
              <p className="text-xs text-muted-foreground">
                {playerState.currentIndex + 1} / {playerState.songs.length}
              </p>
            </div>

            {/* Queue List */}
            <ScrollArea className="flex-1 min-h-0">
              <div>
                {playerState.songs.map((song, index) => (
                  <button
                    key={song.id || index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors border-b border-border/10",
                      index === playerState.currentIndex
                        ? "bg-primary/10"
                        : "hover:bg-muted/30",
                    )}
                  >
                    {/* Index / Playing Indicator */}
                    <div className="w-5 shrink-0 flex justify-center">
                      {index === playerState.currentIndex ? (
                        <div className="flex items-center gap-[2px]">
                          <div className="w-[2px] h-2 bg-primary rounded-sm animate-music-bar-1"></div>
                          <div className="w-[2px] h-2 bg-primary rounded-sm animate-music-bar-2"></div>
                          <div className="w-[2px] h-2 bg-primary rounded-sm animate-music-bar-3"></div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Thumbnail */}
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

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-normal leading-tight line-clamp-2",
                          index === playerState.currentIndex
                            ? "text-foreground"
                            : "text-foreground/80",
                        )}
                      >
                        {song.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            {/* Safe Area for Mobile */}
            <div className="h-safe-area-inset-bottom shrink-0" />
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalPlayer;
