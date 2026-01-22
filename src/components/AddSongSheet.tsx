import { useState, useEffect } from "react";
import { X, Link2, Loader2, Sparkles, Music, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { detectPlatform, getYouTubeThumbnail, getPlatformColor, getPlatformIcon } from "@/lib/songUtils";
import { SongLink } from "@/contexts/PlaylistContext";

interface AddSongSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (song: Omit<SongLink, "id">) => void;
}

const fetchYouTubeInfo = async (url: string): Promise<{ title: string; author: string } | null> => {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title || "",
        author: data.author_name || ""
      };
    }
  } catch (error) {
    console.error("Failed to fetch YouTube info:", error);
  }
  return null;
};

const AddSongSheet = ({ isOpen, onClose, onAdd }: AddSongSheetProps) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [autoFetched, setAutoFetched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setUrl("");
      setTitle("");
      setArtist("");
      setThumbnail(null);
      setAutoFetched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!url.trim()) {
        setThumbnail(null);
        return;
      }

      const platform = detectPlatform(url);
      
      if (platform === "YouTube") {
        setThumbnail(getYouTubeThumbnail(url));
        
        if (!autoFetched) {
          setIsFetching(true);
          const info = await fetchYouTubeInfo(url);
          if (info) {
            setTitle(info.title);
            setArtist(info.author);
            setAutoFetched(true);
          }
          setIsFetching(false);
        }
      } else {
        setThumbnail(null);
      }
    };

    const debounce = setTimeout(fetchInfo, 500);
    return () => clearTimeout(debounce);
  }, [url, autoFetched]);

  const handleSubmit = () => {
    if (!url.trim() || !title.trim()) return;

    const platform = detectPlatform(url);
    onAdd({
      title: title.trim(),
      artist: artist.trim() || "Unknown Artist",
      url: url.trim(),
      platform,
      thumbnail: thumbnail || undefined,
    });
    onClose();
  };

  const platform = url ? detectPlatform(url) : null;
  const isValid = url.trim() && title.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-border/30">
          <button onClick={onClose} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
          <span className="font-semibold">Add Song</span>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!isValid || isFetching}
            className="h-8 px-4 rounded-lg"
          >
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
          </Button>
        </header>

        {/* Form */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Link</label>
            <div className="relative">
              <Input
                placeholder="Paste YouTube, Spotify, or any music link..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setAutoFetched(false);
                }}
                className="h-12 bg-card border-border/50 rounded-xl pl-4 pr-12 text-base"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isFetching ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : url && platform ? (
                  <span className="text-lg">{getPlatformIcon(platform)}</span>
                ) : (
                  <Link2 className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Preview Card */}
          {url && (
            <div className="rounded-2xl overflow-hidden bg-card border border-border/50">
              {thumbnail ? (
                <div className="relative">
                  <img 
                    src={thumbnail} 
                    alt="Preview" 
                    className="w-full aspect-video object-cover"
                    onError={() => setThumbnail(null)}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm ${getPlatformColor(platform || "Other")}`}>
                      {platform}
                    </span>
                  </div>
                  {isFetching && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Fetching details...</span>
                      </div>
                    </div>
                  )}
                  {autoFetched && !isFetching && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Auto-filled
                    </div>
                  )}
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center gap-2 py-12 ${getPlatformColor(platform || "Other")}`}>
                  <span className="text-4xl">{getPlatformIcon(platform || "Other")}</span>
                  <span className="text-sm font-medium opacity-80">{platform || "Unknown"} Link</span>
                </div>
              )}
            </div>
          )}

          {/* Song Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Song Title</label>
              <Input
                placeholder="Enter song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 bg-card border-border/50 rounded-xl text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Artist (optional)</label>
              <Input
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="h-12 bg-card border-border/50 rounded-xl text-base"
              />
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Pro tip</p>
                <p className="text-xs text-muted-foreground">
                  Paste a YouTube link and we'll automatically fetch the title and artist for you!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="p-4 border-t border-border/30 bg-background">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isFetching}
            className="w-full h-12 rounded-xl text-base font-semibold"
            size="lg"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Music className="w-5 h-5 mr-2" />
                Add to Playlist
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSongSheet;
