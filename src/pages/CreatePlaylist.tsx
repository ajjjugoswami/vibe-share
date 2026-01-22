import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, App } from "antd";
import { ArrowLeft, Plus, Link2, Trash2, ExternalLink, Loader2, X, Tag } from "lucide-react";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector } from "@/store/hooks";
import { detectPlatform, getYouTubeThumbnail, getPlatformColor, getPlatformIcon, gradients } from "@/lib/songUtils";

const { TextArea } = Input;

const suggestedTags = [
  "chill", "vibes", "workout", "study", "party", "roadtrip", 
  "lofi", "hiphop", "indie", "electronic", "rnb", "pop", 
  "rock", "jazz", "classical", "motivation", "sleep", "focus"
];

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist, addSongToPlaylist } = usePlaylist();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const { message } = App.useApp();
  
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

        message.success("Playlist created successfully!");
        navigate(`/playlist/${playlist.id}`);
      } catch (error) {
        console.error('Failed to create playlist:', error);
        message.error("Failed to create playlist");
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-12 max-w-lg mx-auto">
          <Button type="text" size="small" onClick={() => navigate(-1)} icon={<ArrowLeft className="w-4 h-4" />} className="!w-8 !h-8" />
          <span className="font-medium text-sm">New Playlist</span>
          <Button
            type="primary"
            size="small"
            onClick={handleCreate}
            disabled={!title.trim()}
            loading={isCreating}
            className="!h-7 !rounded-lg !text-xs"
          >
            Create
          </Button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-5">
        {/* Cover Preview */}
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${selectedGradient} flex items-center justify-center flex-shrink-0`}>
            <Link2 className="w-8 h-8 text-white/50" />
          </div>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Playlist name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="!bg-secondary !border-border/30 !rounded-lg"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="!bg-secondary !border-border/30 !rounded-lg"
            />
          </div>
        </div>
        
        {/* Gradient Picker */}
        <div className="flex gap-1.5 flex-wrap">
          {gradients.map((gradient, index) => (
            <button
              key={index}
              onClick={() => setSelectedGradient(gradient)}
              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} transition-all ${
                selectedGradient === gradient ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
              }`}
            />
          ))}
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Tags ({tags.length}/5)</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs">
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}

          {tags.length < 5 && (
            <>
              <Input
                placeholder="Add tag..."
                size="small"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="!bg-secondary !border-border/30 !rounded-lg"
              />
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.filter(t => !tags.includes(t)).slice(0, 6).map((tag) => (
                  <button key={tag} onClick={() => handleAddTag(tag)} className="px-2 py-0.5 bg-secondary hover:bg-secondary/80 rounded-md text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    #{tag}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Songs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Song Links ({songs.length})</label>
            <Button
              type="text"
              size="small"
              onClick={() => setShowAddSong(!showAddSong)}
              className="!text-accent"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Link
            </Button>
          </div>

          {showAddSong && (
            <div className="p-4 bg-secondary rounded-xl space-y-3">
              <Input
                placeholder="Paste YouTube, Spotify, or other link"
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
                className="!bg-background !border-border"
              />
              
              {newSongUrl && (
                <div className="rounded-lg overflow-hidden bg-background border border-border">
                  {isLoadingPreview ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : previewThumbnail ? (
                    <div className="relative">
                      <img 
                        src={previewThumbnail} 
                        alt="Video thumbnail" 
                        className="w-full h-32 object-cover"
                        onError={() => setPreviewThumbnail(null)}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPlatformColor(detectPlatform(newSongUrl))}`}>
                          {detectPlatform(newSongUrl)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center py-6 ${getPlatformColor(detectPlatform(newSongUrl))}`}>
                      <span className="text-3xl mr-2">{getPlatformIcon(detectPlatform(newSongUrl))}</span>
                      <span className="text-sm font-medium">{detectPlatform(newSongUrl)}</span>
                    </div>
                  )}
                </div>
              )}

              <Input
                placeholder="Song title"
                value={newSongTitle}
                onChange={(e) => setNewSongTitle(e.target.value)}
                className="!bg-background !border-border"
              />
              <Input
                placeholder="Artist name (optional)"
                value={newSongArtist}
                onChange={(e) => setNewSongArtist(e.target.value)}
                className="!bg-background !border-border"
              />
              
              <div className="flex gap-2">
                <Button
                  type="primary"
                  onClick={handleAddSong}
                  disabled={!newSongTitle.trim() || !newSongUrl.trim()}
                  block
                  className="!bg-accent hover:!bg-accent/90 !border-0"
                >
                  Add Song
                </Button>
                <Button onClick={() => { setShowAddSong(false); setNewSongUrl(""); setPreviewThumbnail(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {songs.length === 0 ? (
            <div className="py-12 text-center">
              <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No song links added yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add links from YouTube, Spotify, etc.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-lg group"
                >
                  {song.thumbnail ? (
                    <img 
                      src={song.thumbnail} 
                      alt={song.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${getPlatformColor(song.platform)}`}>
                      <span className="text-lg">{getPlatformIcon(song.platform)}</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getPlatformColor(song.platform)}`}>
                        {song.platform}
                      </span>
                    </div>
                  </div>
                  
                  <a
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleRemoveSong(index)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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