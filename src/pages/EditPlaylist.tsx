import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, App } from "antd";
import { ArrowLeft, Plus, Link2, Trash2, ExternalLink, Loader2, Save, AlertTriangle, X, Tag, Upload, Image } from "lucide-react";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector } from "@/store/hooks";
import { detectPlatform, getYouTubeThumbnail, getPlatformColor, getPlatformIcon, gradients } from "@/lib/songUtils";
import { playlistsAPI } from "@/lib/api";
import { toast } from "sonner";

const { TextArea } = Input;

const suggestedTags = [
  "chill", "vibes", "workout", "study", "party", "roadtrip", 
  "lofi", "hiphop", "indie", "electronic", "rnb", "pop", 
  "rock", "jazz", "classical", "motivation", "sleep", "focus"
];

const EditPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, updatePlaylist, deletePlaylist, addSongToPlaylist } = usePlaylist();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const { message } = App.useApp();
  
  const [playlist, setPlaylist] = useState<{
    title: string;
    description: string;
    coverGradient: string;
    songs: SongLink[];
    tags: string[];
  } | null>(null);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const [songs, setSongs] = useState<SongLink[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!isLoggedIn) {
        navigate("/sign-in");
        return;
      }
      
      if (!id) {
        navigate("/profile");
        return;
      }

      try {
        setIsLoadingPlaylist(true);
        const playlistData = await getPlaylist(id);
        setPlaylist(playlistData);
        setTitle(playlistData.title);
        setDescription(playlistData.description);
        setSelectedGradient(playlistData.coverGradient);
        setSongs(playlistData.songs);
        setTags(playlistData.tags || []);
        setCurrentThumbnailUrl(playlistData.thumbnailUrl || null);
      } catch (error) {
        console.error('Failed to load playlist:', error);
        navigate("/profile");
      } finally {
        setIsLoadingPlaylist(false);
      }
    };

    fetchPlaylist();
  }, [isLoggedIn, id, navigate, getPlaylist]);

  useEffect(() => {
    if (playlist) {
      const changed = 
        title !== playlist.title ||
        description !== playlist.description ||
        selectedGradient !== playlist.coverGradient ||
        JSON.stringify(songs) !== JSON.stringify(playlist.songs) ||
        JSON.stringify(tags) !== JSON.stringify(playlist.tags || []) ||
        thumbnailFile !== null ||
        removeThumbnail;
      setHasChanges(changed);
    }
  }, [title, description, selectedGradient, songs, tags, playlist, thumbnailFile, removeThumbnail]);

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

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setRemoveThumbnail(false); // Reset remove flag when new file is selected
      setHasChanges(true);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (currentThumbnailUrl) {
      setRemoveThumbnail(true);
    }
    setHasChanges(true);
  };

  const handleAddSong = () => {
    if (newSongTitle.trim() && newSongUrl.trim()) {
      const platform = detectPlatform(newSongUrl.trim());
      let thumbnail: string | undefined;
      
      if (platform === "YouTube") {
        thumbnail = getYouTubeThumbnail(newSongUrl.trim()) || undefined;
      }

      const song: SongLink = {
        id: `song-${Date.now()}`,
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

  const handleRemoveSong = (songId: string) => {
    setSongs(songs.filter(s => s.id !== songId));
  };

  const handleSave = async () => {
    if (id && title.trim()) {
      setIsSaving(true);
      try {
        await updatePlaylist(id, {
          title: title.trim(),
          description: description.trim(),
          coverGradient: selectedGradient,
          tags,
        });

        const newSongs = songs.filter(song => song.id.startsWith('song-'));
        for (const song of newSongs) {
          await addSongToPlaylist(id, {
            title: song.title,
            artist: song.artist,
            url: song.url,
            platform: song.platform,
          });
        }

        // Upload thumbnail if provided
        if (thumbnailFile) {
          try {
            await playlistsAPI.uploadPlaylistThumbnail(id, thumbnailFile);
          } catch (thumbnailError) {
            console.error('Failed to upload thumbnail:', thumbnailError);
            message.error("Playlist saved but thumbnail upload failed");
          }
        }

        // Remove thumbnail if requested
        if (removeThumbnail && currentThumbnailUrl) {
          try {
            await playlistsAPI.removePlaylistThumbnail(id);
          } catch (removeError) {
            console.error('Failed to remove thumbnail:', removeError);
            message.error("Playlist saved but thumbnail removal failed");
          }
        }

        message.success("Playlist saved successfully!");
        // Reset thumbnail states
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setRemoveThumbnail(false);
        navigate(`/playlist/${id}`);
      } catch (error) {
        console.error('Failed to save playlist:', error);
        message.error("Failed to save playlist");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = () => {
    if (id) {
      deletePlaylist(id);
      message.success("Playlist deleted");
      navigate("/profile");
    }
  };

  if (isLoadingPlaylist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Edit Playlist</h1>
          <Button
            type="primary"
            size="small"
            onClick={handleSave}
            disabled={!title.trim() || !hasChanges}
            loading={isSaving}
            icon={<Save className="w-4 h-4" />}
            className="!bg-accent hover:!bg-accent/90 !border-0"
          >
            Save
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Cover Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className={`w-40 h-40 rounded-xl flex items-center justify-center ${
              thumbnailPreview || currentThumbnailUrl ? '' : `bg-gradient-to-br ${selectedGradient}`
            }`}>
              {thumbnailPreview ? (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : currentThumbnailUrl ? (
                <img 
                  src={currentThumbnailUrl} 
                  alt="Current thumbnail" 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Link2 className="w-12 h-12 text-white/50" />
              )}
            </div>
            {(thumbnailPreview || currentThumbnailUrl) && (
              <button
                onClick={handleRemoveThumbnail}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-xs hover:bg-destructive/80"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
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

        {/* Thumbnail Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Custom Thumbnail</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
              id="thumbnail-upload-edit"
            />
            <label
              htmlFor="thumbnail-upload-edit"
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              {thumbnailFile ? 'Change Image' : currentThumbnailUrl ? 'Change Image' : 'Upload Image'}
            </label>
            {thumbnailFile && (
              <span className="text-sm text-muted-foreground">
                {thumbnailFile.name}
              </span>
            )}
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
              size="large"
              className="!bg-secondary !border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <TextArea
              placeholder="What's this playlist about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="!bg-secondary !border-border !resize-none"
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

          {tags.length < 5 && (
            <Input
              placeholder="Add a tag (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="!bg-secondary !border-border"
            />
          )}

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
              <p className="text-muted-foreground">No song links yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add links from YouTube, Spotify, etc.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
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
                    onClick={() => handleRemoveSong(song.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Section */}
        <div className="pt-6 border-t border-border">
          {showDeleteConfirm ? (
            <div className="p-4 bg-destructive/10 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Delete this playlist?</span>
              </div>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button danger onClick={handleDelete} block>
                  Yes, Delete
                </Button>
                <Button onClick={() => setShowDeleteConfirm(false)} block>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              danger
              type="text"
              onClick={() => setShowDeleteConfirm(true)}
              block
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete Playlist
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPlaylist;