import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Link2, Share2, Trash2, GripVertical, ExternalLink } from "lucide-react";

interface SongLink {
  id: string;
  title: string;
  artist: string;
  url: string;
  platform: string;
}

const detectPlatform = (url: string): string => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("spotify.com")) return "Spotify";
  if (url.includes("soundcloud.com")) return "SoundCloud";
  if (url.includes("apple.com") || url.includes("music.apple")) return "Apple Music";
  if (url.includes("deezer.com")) return "Deezer";
  if (url.includes("tidal.com")) return "Tidal";
  return "Link";
};

interface CreatePlaylistModalProps {
  onClose: () => void;
  onCreate: (playlist: { title: string; description: string; songs: SongLink[] }) => void;
}

const CreatePlaylistModal = ({ onClose, onCreate }: CreatePlaylistModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState<SongLink[]>([]);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);

  const handleAddSong = () => {
    if (newSongTitle.trim() && newSongUrl.trim()) {
      const song: SongLink = {
        id: Date.now().toString(),
        title: newSongTitle.trim(),
        artist: newSongArtist.trim() || "Unknown Artist",
        url: newSongUrl.trim(),
        platform: detectPlatform(newSongUrl.trim()),
      };
      setSongs([...songs, song]);
      setNewSongTitle("");
      setNewSongArtist("");
      setNewSongUrl("");
      setShowAddSong(false);
      console.log("[SONG_LINK_ADDED]", { song, totalSongs: songs.length + 1, timestamp: new Date().toISOString() });
    }
  };

  const handleRemoveSong = (songId: string) => {
    setSongs(songs.filter(s => s.id !== songId));
    console.log("[SONG_LINK_REMOVED]", { songId, timestamp: new Date().toISOString() });
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
      songs: songs.map(s => `${s.title} - ${s.artist}: ${s.url}`).join("\n"),
    };
    console.log("[PLAYLIST_SHARED]", { shareData, timestamp: new Date().toISOString() });
    
    if (navigator.share) {
      navigator.share({
        title: shareData.title,
        text: `Check out my playlist: ${shareData.title}\n\n${shareData.songs}`,
      });
    } else {
      navigator.clipboard.writeText(`Check out my playlist: ${shareData.title}\n\n${shareData.songs}`);
      console.log("[SHARE_COPIED_TO_CLIPBOARD]", { timestamp: new Date().toISOString() });
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "YouTube": return "bg-red-500/20 text-red-400";
      case "Spotify": return "bg-green-500/20 text-green-400";
      case "SoundCloud": return "bg-orange-500/20 text-orange-400";
      case "Apple Music": return "bg-pink-500/20 text-pink-400";
      case "Deezer": return "bg-purple-500/20 text-purple-400";
      case "Tidal": return "bg-blue-500/20 text-blue-400";
      default: return "bg-muted text-muted-foreground";
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
              <label className="text-sm font-medium text-foreground">Song Links ({songs.length})</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddSong(!showAddSong)}
                className="text-primary hover:text-primary/80"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Link
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
                  placeholder="Artist name (optional)"
                  value={newSongArtist}
                  onChange={(e) => setNewSongArtist(e.target.value)}
                  className="bg-background border-border"
                />
                <Input
                  placeholder="Paste YouTube, Spotify, or other link"
                  value={newSongUrl}
                  onChange={(e) => setNewSongUrl(e.target.value)}
                  className="bg-background border-border"
                />
                {newSongUrl && (
                  <p className="text-xs text-muted-foreground">
                    Detected: <span className="text-foreground">{detectPlatform(newSongUrl)}</span>
                  </p>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleAddSong} size="sm" className="flex-1" disabled={!newSongTitle.trim() || !newSongUrl.trim()}>
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
                <Link2 className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No song links added yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add links from YouTube, Spotify, etc.</p>
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPlatformColor(song.platform)}`}>
                          {song.platform}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
