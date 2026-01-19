import { Settings, Grid3X3, Bookmark, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const playlists = [
  { cover: "from-purple-900 to-pink-900", name: "late night drives" },
  { cover: "from-cyan-900 to-blue-900", name: "summer 24" },
  { cover: "from-orange-900 to-red-900", name: "workout beast" },
  { cover: "from-green-900 to-teal-900", name: "study sesh" },
  { cover: "from-pink-900 to-rose-900", name: "feels trip" },
  { cover: "from-indigo-900 to-purple-900", name: "indie gems" },
];

const savedPlaylists = [
  { cover: "from-amber-900 to-orange-900", name: "saved 1" },
  { cover: "from-teal-900 to-cyan-900", name: "saved 2" },
  { cover: "from-rose-900 to-pink-900", name: "saved 3" },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"playlists" | "saved">("playlists");

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-semibold text-lg">@yourname</h1>
          <button className="p-2">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink p-[3px]">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around">
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

        {/* Bio */}
        <div className="mt-4">
          <h2 className="font-semibold">Your Name</h2>
          <p className="text-sm text-muted-foreground mt-1">
            music is my therapy 🎵 sharing good vibes only ✨
          </p>
        </div>

        {/* Edit Profile Button */}
        <Button variant="outline" className="w-full mt-4">
          Edit Profile
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("playlists")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "playlists" 
              ? "border-foreground text-foreground" 
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
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
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {(activeTab === "playlists" ? playlists : savedPlaylists).map((playlist, index) => (
          <button
            key={index}
            className={`aspect-square bg-gradient-to-br ${playlist.cover} rounded-sm overflow-hidden relative group`}
          >
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-white text-xs font-medium truncate">{playlist.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
