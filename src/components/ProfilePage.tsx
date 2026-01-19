import { Settings, Grid3X3, Bookmark, Music, Share2, LogOut, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlaylist, Playlist } from "@/contexts/PlaylistContext";
import { useSocial } from "@/contexts/SocialContext";
import { Link2 } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"playlists" | "saved">("playlists");
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { playlists, savedPlaylists, refreshPlaylists, refreshSavedPlaylists } = usePlaylist();
  const { following, followers } = useSocial();

  const currentPlaylists = activeTab === "playlists" ? playlists : savedPlaylists;

  // Refresh playlists when component mounts
  useEffect(() => {
    if (isLoggedIn && user) {
      refreshPlaylists();
      refreshSavedPlaylists();
    }
  }, [isLoggedIn, user, refreshPlaylists, refreshSavedPlaylists]);

  const handleTabChange = (tab: "playlists" | "saved") => {
    setActiveTab(tab);
    console.log("[PROFILE_TAB_CHANGE]", { tab, timestamp: new Date().toISOString() });
  };

  const handleEditProfile = () => {
    console.log("[EDIT_PROFILE_CLICKED]", { timestamp: new Date().toISOString() });
  };

  const handleShareProfile = () => {
    console.log("[SHARE_PROFILE_CLICKED]", { timestamp: new Date().toISOString() });
  };

  const handleSettings = () => {
    console.log("[SETTINGS_CLICKED]", { timestamp: new Date().toISOString() });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handleCreatePlaylist = () => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    } else {
      navigate("/playlist/create");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
          <Music className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Sign in to see your profile</h2>
        <p className="text-muted-foreground text-center">Create and manage your playlists</p>
        <Button variant="accent" onClick={() => navigate("/sign-in")}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <h1 className="font-semibold">@{user?.username}</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleShareProfile}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSettings}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-accent">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="font-semibold">{playlists.length}</div>
                <div className="text-xs text-muted-foreground">playlists</div>
              </div>
              <button 
                className="text-center hover:opacity-70 transition-opacity"
                onClick={() => console.log("Show followers modal")}
              >
                <div className="font-semibold">{followers.length}</div>
                <div className="text-xs text-muted-foreground">followers</div>
              </button>
              <button 
                className="text-center hover:opacity-70 transition-opacity"
                onClick={() => console.log("Show following modal")}
              >
                <div className="font-semibold">{following.length}</div>
                <div className="text-xs text-muted-foreground">following</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold">{user?.username}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sharing my music taste with the world
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1" onClick={handleEditProfile}>
            Edit Profile
          </Button>
          <Button variant="accent" className="flex-1" onClick={handleCreatePlaylist}>
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => handleTabChange("playlists")}
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
            onClick={() => handleTabChange("saved")}
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
        {currentPlaylists.length === 0 ? (
          <div className="py-16 text-center">
            <Link2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {activeTab === "playlists" ? "No playlists yet" : "No saved playlists"}
            </p>
            {activeTab === "playlists" && (
              <Button variant="outline" className="mt-4" onClick={handleCreatePlaylist}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentPlaylists.map((playlist) => (
              <div 
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist)}
                className="cursor-pointer group"
              >
                <div className={`aspect-square rounded-xl bg-gradient-to-br ${playlist.coverGradient} mb-2 flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
                  <Link2 className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-sm font-medium truncate">{playlist.title}</p>
                <p className="text-xs text-muted-foreground">{playlist.songs.length} songs</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
