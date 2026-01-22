import { useState, useEffect } from "react";
import { X, Link2, Loader2, Sparkles } from "lucide-react";
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
    // Use YouTube oEmbed API (no API key needed)
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

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setUrl("");
      setTitle("");
      setArtist("");
      setThumbnail(null);
      setAutoFetched(false);
    }
  }, [isOpen]);

  // Auto-fetch when URL changes
  useEffect(() => {
    const fetchInfo = async () => {
      if (!url.trim()) {
        setThumbnail(null);
        return;
      }

      const platform = detectPlatform(url);
      
      if (platform === "YouTube") {
        setThumbnail(getYouTubeThumbnail(url));
        
        // Auto-fetch title and artist
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 rounded-t-3xl animate-slide-up max-h-[85vh] overflow-auto">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3" />
        
        <div className="p-4 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add Song Link</h3>
            <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* URL Input */}
            <div className="relative">
              <Input
                placeholder="Paste YouTube, Spotify, or any link..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setAutoFetched(false);
                }}
                className="h-12 bg-background border-border/40 rounded-xl pr-10"
              />
              <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Preview */}
            {url && (
              <div className="rounded-xl overflow-hidden bg-background border border-border/40">
                {thumbnail ? (
                  <div className="relative">
                    <img 
                      src={thumbnail} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
                      onError={() => setThumbnail(null)}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPlatformColor(platform || "Other")}`}>
                        {platform}
                      </span>
                    </div>
                    {isFetching && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Fetching info...
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`flex items-center justify-center gap-2 py-8 ${getPlatformColor(platform || "Other")}`}>
                    <span className="text-2xl">{getPlatformIcon(platform || "Other")}</span>
                    <span className="text-sm font-medium">{platform}</span>
                  </div>
                )}
              </div>
            )}

            {/* Auto-fetched indicator */}
            {autoFetched && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-filled from YouTube</span>
              </div>
            )}

            {/* Title Input */}
            <Input
              placeholder="Song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-background border-border/40 rounded-xl"
            />

            {/* Artist Input */}
            <Input
              placeholder="Artist name (optional)"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="h-12 bg-background border-border/40 rounded-xl"
            />

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!url.trim() || !title.trim() || isFetching}
              className="w-full h-12 rounded-xl text-base"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Add Song"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSongSheet;
