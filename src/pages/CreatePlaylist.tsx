import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Link2, Loader2, X, Tag, Upload, Image } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector } from "@/store/hooks";
import { gradients } from "@/lib/songUtils";
import { playlistsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AddSongSheet from "@/components/AddSongSheet";
import SortableSongItem from "@/components/SortableSongItem";

const suggestedTags = ["chill", "vibes", "workout", "study", "party", "roadtrip"];

type SongWithTempId = Omit<SongLink, "id"> & { tempId: string };

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist, addSongToPlaylist } = usePlaylist();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const [songs, setSongs] = useState<SongWithTempId[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

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

  const handleAddSong = (song: Omit<SongLink, "id">) => {
    setSongs([...songs, { ...song, tempId: crypto.randomUUID() }]);
  };

  const handleRemoveSong = (tempId: string) => {
    setSongs(songs.filter(s => s.tempId !== tempId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSongs((items) => {
        const oldIndex = items.findIndex(i => i.tempId === active.id);
        const newIndex = items.findIndex(i => i.tempId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
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

        // Upload thumbnail if provided
        if (thumbnailFile) {
          try {
            await playlistsAPI.uploadPlaylistThumbnail(playlist.id, thumbnailFile);
          } catch (thumbnailError) {
            console.error('Failed to upload thumbnail:', thumbnailError);
            // Don't fail the entire creation if thumbnail upload fails
            toast.error("Playlist created, but thumbnail upload failed");
          }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
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

      {/* Compact Form - No scroll needed for basic info */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Cover + Title Row */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ${
              thumbnailPreview ? '' : `bg-gradient-to-br ${selectedGradient}`
            }`}>
              {thumbnailPreview ? (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Link2 className="w-6 h-6 text-white/60" />
              )}
            </div>
            {thumbnailPreview && (
              <button
                onClick={handleRemoveThumbnail}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-xs hover:bg-destructive/80"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Playlist name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 bg-card border-border/40 rounded-[8px]"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-8 bg-card border-border/40 rounded-[8px] text-sm"
            />
          </div>
        </div>
        
        {/* Compact Color Picker */}
        <div className="flex gap-1.5 flex-wrap">
          {gradients.map((gradient, index) => (
            <button
              key={index}
              onClick={() => setSelectedGradient(gradient)}
              className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} transition-all ${
                selectedGradient === gradient 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Custom Thumbnail (Optional)</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              {thumbnailFile ? 'Change Image' : 'Upload Image'}
            </label>
            {thumbnailFile && (
              <span className="text-xs text-muted-foreground">
                {thumbnailFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Compact Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/15 text-primary rounded-full text-xs font-medium">
              #{tag}
              <button onClick={() => handleRemoveTag(tag)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {tags.length < 5 && (
            <Input
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="h-7 w-20 bg-transparent border-0 text-xs px-1 focus-visible:ring-0"
            />
          )}
        </div>
        
        {/* Quick suggested tags */}
        {tags.length < 5 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestedTags.filter(t => !tags.includes(t)).map((tag) => (
              <button 
                key={tag} 
                onClick={() => handleAddTag(tag)} 
                className="px-2 py-0.5 bg-muted hover:bg-muted/80 rounded-full text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Songs Section - Scrollable */}
      <div className="max-w-lg mx-auto px-4 pb-32">
        <div className="flex items-center justify-between py-3 border-t border-border/30">
          <span className="text-sm font-semibold">Songs ({songs.length})</span>
          <button
            onClick={() => setShowAddSong(true)}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {songs.length === 0 ? (
          <button 
            onClick={() => setShowAddSong(true)}
            className="w-full py-10 border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-sm">Tap to add your first song</span>
            <span className="text-xs">YouTube, Spotify, SoundCloud...</span>
          </button>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={songs.map(s => s.tempId)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <SortableSongItem
                    key={song.tempId}
                    song={song}
                    index={index}
                    onRemove={() => handleRemoveSong(song.tempId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {songs.length > 0 && (
          <button
            onClick={() => setShowAddSong(true)}
            className="w-full mt-3 py-3 border border-dashed border-border/50 rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add another song</span>
          </button>
        )}
      </div>

      {/* Add Song Sheet */}
      <AddSongSheet
        isOpen={showAddSong}
        onClose={() => setShowAddSong(false)}
        onAdd={handleAddSong}
      />
    </div>
  );
};

export default CreatePlaylist;
