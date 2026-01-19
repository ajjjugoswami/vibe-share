import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Link2, Trash2, ExternalLink, Loader2, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAuth } from "@/contexts/AuthContext";
import { detectPlatform, getYouTubeThumbnail, getPlatformColor, getPlatformIcon, gradients } from "@/lib/songUtils";

const suggestedTags = [
  "chill", "vibes", "workout", "study", "party", "roadtrip", 
  "lofi", "hiphop", "indie", "electronic", "rnb", "pop", 
  "rock", "jazz", "classical", "motivation", "sleep", "focus"
];

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist, addSongToPlaylist } = usePlaylist();
  const { isLoggedIn } = useAuth();
  
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
      try {
        const playlist = await createPlaylist({
          title: title.trim(),
          description: description.trim(),
          coverGradient: selectedGradient,
          tags, 
          isPublic: true
        });

        // Add songs
        for (const song of songs) {
          await addSongToPlaylist(playlist.id, {
            title: song.title,
            artist: song.artist,
            url: song.url,
            platform: song.platform,
          });
        }

        navigate(`/playlist/${playlist.id}`);
      } catch (error) {
        console.error('Failed to create playlist:', error);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Create Playlist</h1>
          <Button size="sm" onClick={handleCreate} disabled={!title.trim()}>
            Create
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Cover Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className={`w-40 h-40 rounded-xl bg-gradient-to-br ${selectedGradient} flex items-center justify-center`}>
            <Link2 className="w-12 h-12 text-white/50" />
          </div>
          
          {/* Gradient Picker */}
          <div className="flex gap-2 flex-wrap justify-center">
            {gradients.map((gradient, index) => (
              <button
                key={index}
                onClick={() => setSelectedGradient(gradient)}
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} transition-all ${
                  selectedGradient === gradient ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Playlist Name</label>
            <Input
              placeholder="My awesome playlist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="What's this playlist about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium">Tags ({tags.length}/5)</label>
          </div>

          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-accent/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          {tags.length < 5 && (
            <Input
              placeholder="Add a tag (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="bg-secondary border-border"
            />
          )}

          {/* Suggested Tags */}
          {tags.length < 5 && (
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(t => !tags.includes(t))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Songs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Song Links ({songs.length})</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddSong(!showAddSong)}
              className="text-accent"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Link
            </Button>
          </div>

          {showAddSong && (
            <div className="p-4 bg-secondary rounded-xl space-y-3">
              <Input
                placeholder="Paste YouTube, Spotify, or other link"
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
                className="bg-background border-border"
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
                className="bg-background border-border"
              />
              <Input
                placeholder="Artist name (optional)"
                value={newSongArtist}
                onChange={(e) => setNewSongArtist(e.target.value)}
                className="bg-background border-border"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleAddSong} size="sm" className="flex-1" disabled={!newSongTitle.trim() || !newSongUrl.trim()}>
                  Add Song
                </Button>
                <Button onClick={() => { setShowAddSong(false); setNewSongUrl(""); setPreviewThumbnail(null); }} variant="ghost" size="sm">
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
