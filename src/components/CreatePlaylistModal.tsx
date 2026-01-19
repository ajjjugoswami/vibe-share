import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Music, Share2, Trash2, GripVertical } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface CreatePlaylistModalProps {
  onClose: () => void;
  onCreate: (playlist: { title: string; description: string; songs: Song[] }) => void;
}

const CreatePlaylistModal = ({ onClose, onCreate }: CreatePlaylistModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);

  const handleAddSong = () => {
    if (newSongTitle.trim() && newSongArtist.trim()) {
      const song: Song = {
        id: Date.now().toString(),
        title: newSongTitle.trim(),
        artist: newSongArtist.trim(),
      };
      setSongs([...songs, song]);
      setNewSongTitle("");
      setNewSongArtist("");
      setShowAddSong(false);
      console.log("[SONG_ADDED]", { song, totalSongs: songs.length + 1, timestamp: new Date().toISOString() });
    }
  };

  const handleRemoveSong = (songId: string) => {
    setSongs(songs.filter(s => s.id !== songId));
    console.log("[SONG_REMOVED]", { songId, timestamp: new Date().toISOString() });
  };

  const handleCreate = () => {
    if (title.trim()) {
      const playlist = { title: title.trim(), description: description.trim(), songs };
      console.log("[PLAYLIST_CREATED]", { playlist, timestamp: new Date().toISOString() });
      onCreate(playlist);
      onClose();
    }
  };

  const handleShare = () => {
    const shareData = {
      title: title || "New Playlist",
      songs: songs.map(s => `${s.title} - ${s.artist}`).join(", "),
    };
    console.log("[PLAYLIST_SHARED]", { shareData, timestamp: new Date().toISOString() });
    
    if (navigator.share) {
      navigator.share({
        title: shareData.title,
        text: `Check out my playlist: ${shareData.title}\nSongs: ${shareData.songs}`,
      });
    } else {
      navigator.clipboard.writeText(`Check out my playlist: ${shareData.title}\nSongs: ${shareData.songs}`);
      console.log("[SHARE_COPIED_TO_CLIPBOARD]", { timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create Playlist</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Playlist Name</label>
            <Input
              placeholder="My awesome playlist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              placeholder="What's this playlist about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Songs ({songs.length})</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddSong(!showAddSong)}
                className="text-primary hover:text-primary/80"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Song
              </Button>
            </div>

            {showAddSong && (
              <div className="p-3 bg-secondary rounded-lg space-y-3">
                <Input
                  placeholder="Song title"
                  value={newSongTitle}
                  onChange={(e) => setNewSongTitle(e.target.value)}
                  className="bg-background border-border"
                />
                <Input
                  placeholder="Artist name"
                  value={newSongArtist}
                  onChange={(e) => setNewSongArtist(e.target.value)}
                  className="bg-background border-border"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddSong} size="sm" className="flex-1">
                    Add
                  </Button>
                  <Button onClick={() => setShowAddSong(false)} variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {songs.length === 0 ? (
              <div className="py-8 text-center">
                <Music className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No songs added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveSong(song.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={!title.trim()}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="flex-1"
          >
            Create Playlist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
