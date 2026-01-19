import { ImagePlus, Music2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreatePage = ({ onClose }: { onClose: () => void }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
        <h1 className="font-display font-semibold">New Playlist</h1>
        <Button variant="neon" size="sm" disabled={!playlistName}>
          Share
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Cover */}
        <div className="flex justify-center">
          <button className="w-48 h-48 rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-neon-purple hover:bg-muted/50 transition-colors">
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add cover</span>
          </button>
        </div>

        {/* Playlist Name */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Playlist name</label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="late night drives 🌙"
            className="w-full h-12 px-4 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple text-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Description (optional)</label>
          <textarea
            placeholder="What's the vibe?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple resize-none"
          />
        </div>

        {/* Add Songs */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Songs</label>
          <button className="w-full h-14 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center gap-2 hover:border-neon-cyan hover:bg-muted/50 transition-colors">
            <Plus className="w-5 h-5 text-neon-cyan" />
            <span className="text-neon-cyan font-medium">Add songs</span>
          </button>
          
          {songs.length === 0 && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              Search and add songs to your playlist
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
