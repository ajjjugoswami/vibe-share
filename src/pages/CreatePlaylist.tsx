import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Link2, Trash2, ExternalLink, Loader2, X, Tag, Music } from "lucide-react";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector } from "@/store/hooks";
import { detectPlatform, getYouTubeThumbnail, getPlatformColor, getPlatformIcon, gradients } from "@/lib/songUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const suggestedTags = [
  "chill", "vibes", "workout", "study", "party", "roadtrip", 
  "lofi", "hiphop", "indie", "electronic", "rnb", "pop"
];

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist, addSongToPlaylist } = usePlaylist();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const [songs, setSongs] = useState<Omit<SongLink, "id">[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (newSongUrl.trim()) {
      setIsLoadingPreview(true);
      const platform = detectPlatform(newSongUrl);
      
      if (platform === "YouTube") {
        const thumbnail = getYouTubeThumbnail(newSongUrl);
        setPreviewThumbnail(thumbnail);
      } else {
        setPreviewThumbnail(null);
      }
      setIsLoadingPreview(false);
    } else {
      setPreviewThumbnail(null);
    }
  }, [newSongUrl]);

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 5) {
      setTags([...tags, normalizedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleAddSong = () => {
    if (newSongTitle.trim() && newSongUrl.trim()) {
      const platform = detectPlatform(newSongUrl.trim());
      let thumbnail: string | undefined;
      
      if (platform === "YouTube") {
        thumbnail = getYouTubeThumbnail(newSongUrl.trim()) || undefined;
      }

      const song: Omit<SongLink, "id"> = {
        title: newSongTitle.trim(),
        artist: newSongArtist.trim() || "Unknown Artist",
        url: newSongUrl.trim(),
        platform,
        thumbnail,
      };
      setSongs([...songs, song]);
      setNewSongTitle("");
      setNewSongArtist("");
      setNewSongUrl("");
      setPreviewThumbnail(null);
      setShowAddSong(false);
    }
  };

  const handleRemoveSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (title.trim()) {
      setIsCreating(true);
      try {
        const playlist = await createPlaylist({
          title: title.trim(),
          description: description.trim(),
          coverGradient: selectedGradient,
          tags, 
          isPublic: true
        });

        for (const song of songs) {
          await addSongToPlaylist(playlist.id, {
            title: song.title,
            artist: song.artist,
            url: song.url,
            platform: song.platform,
          });
        }

        toast.success("Playlist created successfully!");
        navigate(`/playlist/${playlist.id}`);
      } catch (error) {
        console.error('Failed to create playlist:', error);
        toast.error("Failed to create playlist");
      } finally {
        setIsCreating(false);
      }
    }
  };

  const resetAddSong = () => {
    setShowAddSong(false);
    setNewSongUrl("");
    setNewSongTitle("");
    setNewSongArtist("");
    setPreviewThumbnail(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold">New Playlist</span>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={!title.trim() || isCreating}
            className="h-8 px-4 rounded-lg"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
          </Button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 pb-32 space-y-6">
        {/* Cover & Basic Info */}
        <div className="flex items-start gap-4">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedGradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Link2 className="w-8 h-8 text-white/60" />
          </div>
          <div className="flex-1 space-y-3">
            <Input
              placeholder="Playlist name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-card border-border/40 rounded-xl"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 bg-card border-border/40 rounded-xl"
            />
          </div>
        </div>
        
        {/* Color Picker */}
        <div className="flex gap-2 flex-wrap">
          {gradients.map((gradient, index) => (
            <button
              key={index}
              onClick={() => setSelectedGradient(gradient)}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} transition-all duration-200 ${
                selectedGradient === gradient 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Tags ({tags.length}/5)</span>
          </div>

          <Input
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            disabled={tags.length >= 5}
            className="h-11 bg-card border-border/40 rounded-xl"
          />

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 text-primary rounded-full text-sm font-medium">
                #{tag}
                <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {suggestedTags.filter(t => !tags.includes(t)).slice(0, 6).map((tag) => (
              <button 
                key={tag} 
                onClick={() => handleAddTag(tag)} 
                disabled={tags.length >= 5}
                className="px-3 py-1.5 bg-card border border-border/40 hover:border-primary/30 hover:bg-primary/5 rounded-full text-sm text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Song Links Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Song Links ({songs.length})</span>
            <button
              onClick={() => setShowAddSong(!showAddSong)}
              className="flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          {/* Add Song Form */}
          {showAddSong && (
            <div className="p-4 bg-card rounded-2xl border border-border/40 space-y-3">
              <Input
                placeholder="Paste YouTube, Spotify, or other link"
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
                className="h-11 bg-background border-border/40 rounded-xl"
              />
              
              {newSongUrl && (
                <div className="rounded-xl overflow-hidden bg-background border border-border/40">
                  {isLoadingPreview ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : previewThumbnail ? (
                    <div className="relative">
                      <img 
                        src={previewThumbnail} 
                        alt="Video thumbnail" 
                        className="w-full h-28 object-cover"
                        onError={() => setPreviewThumbnail(null)}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPlatformColor(detectPlatform(newSongUrl))}`}>
                          {detectPlatform(newSongUrl)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center gap-2 py-6 ${getPlatformColor(detectPlatform(newSongUrl))}`}>
                      <span className="text-2xl">{getPlatformIcon(detectPlatform(newSongUrl))}</span>
                      <span className="text-sm font-medium">{detectPlatform(newSongUrl)}</span>
                    </div>
                  )}
                </div>
              )}

              <Input
                placeholder="Song title"
                value={newSongTitle}
                onChange={(e) => setNewSongTitle(e.target.value)}
                className="h-11 bg-background border-border/40 rounded-xl"
              />
              <Input
                placeholder="Artist name (optional)"
                value={newSongArtist}
                onChange={(e) => setNewSongArtist(e.target.value)}
                className="h-11 bg-background border-border/40 rounded-xl"
              />
              
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleAddSong}
                  disabled={!newSongTitle.trim() || !newSongUrl.trim()}
                  className="flex-1 h-11 rounded-xl bg-primary/90 hover:bg-primary"
                >
                  Add Song
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetAddSong}
                  className="h-11 px-6 rounded-xl border-border/40"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Songs List / Empty State */}
          {songs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-card border border-border/40 flex items-center justify-center">
                <Link2 className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No song links added yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add links from YouTube, Spotify, etc.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/30 group hover:border-border/50 transition-colors"
                >
                  {song.thumbnail ? (
                    <img 
                      src={song.thumbnail} 
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getPlatformColor(song.platform)}`}>
                      <Music className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${getPlatformColor(song.platform)}`}>
                        {song.platform}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleRemoveSong(index)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-background"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
