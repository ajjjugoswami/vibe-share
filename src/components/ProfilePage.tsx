import { Settings, Grid3X3, Bookmark, Music, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const playlists = [
  { cover: "from-purple-900 to-pink-900", name: "late night drives", songs: 24 },
  { cover: "from-cyan-900 to-blue-900", name: "summer 24", songs: 18 },
  { cover: "from-orange-900 to-red-900", name: "workout beast", songs: 32 },
  { cover: "from-green-900 to-teal-900", name: "study sesh", songs: 45 },
  { cover: "from-pink-900 to-rose-900", name: "feels trip", songs: 21 },
  { cover: "from-indigo-900 to-purple-900", name: "indie gems", songs: 28 },
];

const savedPlaylists = [
  { cover: "from-amber-900 to-orange-900", name: "gym vibes", songs: 15 },
  { cover: "from-teal-900 to-cyan-900", name: "chill beats", songs: 40 },
  { cover: "from-rose-900 to-pink-900", name: "party mix", songs: 25 },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"playlists" | "saved">("playlists");

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-semibold text-lg">@yourname</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink p-[3px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <Music className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 pt-2">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="font-display font-bold text-xl">6</div>
                <div className="text-xs text-muted-foreground">playlists</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-xl">1.2K</div>
                <div className="text-xs text-muted-foreground">followers</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-xl">342</div>
                <div className="text-xs text-muted-foreground">following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <h2 className="font-semibold">Your Name</h2>
          <p className="text-sm text-muted-foreground mt-1">
            music is my therapy 🎵 sharing good vibes only ✨
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1">
            Edit Profile
          </Button>
          <Button variant="neon" className="flex-1">
            Share Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mt-2">
        <button
          onClick={() => setActiveTab("playlists")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "playlists" 
              ? "border-foreground text-foreground" 
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="text-sm font-medium">My Playlists</span>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "saved" 
              ? "border-foreground text-foreground" 
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-sm font-medium">Saved</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {(activeTab === "playlists" ? playlists : savedPlaylists).map((playlist, index) => (
          <button
            key={index}
            className="group text-left"
          >
            <div className={`aspect-square bg-gradient-to-br ${playlist.cover} rounded-2xl overflow-hidden relative mb-2`}>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-medium truncate">{playlist.name}</p>
            <p className="text-xs text-muted-foreground">{playlist.songs} songs</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
