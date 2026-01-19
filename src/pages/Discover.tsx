import { useState } from "react";
import { Search, Users, Music2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSocial } from "@/contexts/SocialContext";
import { usePlaylist } from "@/contexts/PlaylistContext";
import UserCard from "@/components/UserCard";
import { useNavigate } from "react-router-dom";
import { Link2 } from "lucide-react";

const Discover = () => {
  const [activeTab, setActiveTab] = useState<"users" | "playlists">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const { users } = useSocial();
  const { playlists, savedPlaylists } = usePlaylist();
  const navigate = useNavigate();

  // Combine all playlists for discovery
  const allPlaylists = [...playlists, ...savedPlaylists];

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaylists = allPlaylists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-3">Discover</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users or playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors text-sm ${
              activeTab === "users" 
                ? "border-accent text-accent" 
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            People
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors text-sm ${
              activeTab === "playlists" 
                ? "border-accent text-accent" 
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Music2 className="w-4 h-4" />
            Playlists
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {activeTab === "users" ? (
          <>
            {/* Suggested Users */}
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold">Suggested for you</h2>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Trending Playlists */}
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold">Trending playlists</h2>
            </div>

            {filteredPlaylists.length === 0 ? (
              <div className="py-16 text-center">
                <Music2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No playlists found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPlaylists.map((playlist) => (
                  <div 
                    key={playlist.id}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className={`aspect-square rounded-xl bg-gradient-to-br ${playlist.coverGradient} mb-2 flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
                      <Link2 className="w-8 h-8 text-white/30" />
                    </div>
                    <p className="text-sm font-medium truncate">{playlist.title}</p>
                    <p className="text-xs text-muted-foreground">{playlist.songs.length} songs • {playlist.likes} likes</p>
                    {playlist.tags.length > 0 && (
                      <p className="text-xs text-accent mt-1">#{playlist.tags[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Discover;
