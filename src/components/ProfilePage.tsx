import { Settings, Grid3X3, Bookmark, Music, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PlaylistCard, { PlaylistData } from "./PlaylistCard";
import PlaylistDetail from "./PlaylistDetail";

const userPlaylists: PlaylistData[] = [
  { id: "u1", username: "you", userAvatar: "", verified: false, playlistName: "my favorites", playlistCover: "from-purple-800 to-pink-900", songs: [], totalSongs: 24, likes: 142 },
  { id: "u2", username: "you", userAvatar: "", verified: false, playlistName: "workout mix", playlistCover: "from-red-800 to-orange-900", songs: [], totalSongs: 18, likes: 89 },
  { id: "u3", username: "you", userAvatar: "", verified: false, playlistName: "chill vibes", playlistCover: "from-green-800 to-teal-900", songs: [], totalSongs: 32, likes: 256 },
];

const savedPlaylists: PlaylistData[] = [
  { id: "s1", username: "luna.waves", userAvatar: "", verified: false, playlistName: "late night", playlistCover: "from-indigo-800 to-purple-900", songs: [], totalSongs: 24, likes: 1823 },
  { id: "s2", username: "chill.hub", userAvatar: "", verified: true, playlistName: "study beats", playlistCover: "from-emerald-800 to-teal-900", songs: [], totalSongs: 45, likes: 5672 },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"playlists" | "saved">("playlists");
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);

  const currentPlaylists = activeTab === "playlists" ? userPlaylists : savedPlaylists;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <h1 className="font-semibold">@yourname</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="font-semibold">{userPlaylists.length}</div>
                <div className="text-xs text-muted-foreground">playlists</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">1.2K</div>
                <div className="text-xs text-muted-foreground">followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">342</div>
                <div className="text-xs text-muted-foreground">following</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold">Your Name</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sharing my music taste with the world
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1">Edit Profile</Button>
          <Button variant="secondary" className="flex-1">Share Profile</Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("playlists")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors text-sm ${
              activeTab === "playlists" 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            My Playlists
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors text-sm ${
              activeTab === "saved" 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentPlaylists.map((playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              {...playlist} 
              onClick={() => setSelectedPlaylist(playlist)}
            />
          ))}
        </div>
      </div>

      {selectedPlaylist && (
        <PlaylistDetail 
          playlist={selectedPlaylist} 
          onClose={() => setSelectedPlaylist(null)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
