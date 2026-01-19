import { Search, TrendingUp } from "lucide-react";
import PlaylistCard, { PlaylistData } from "./PlaylistCard";
import { useState } from "react";
import PlaylistDetail from "./PlaylistDetail";

const categories = [
  { name: "Chill", color: "bg-blue-600" },
  { name: "Workout", color: "bg-red-600" },
  { name: "Focus", color: "bg-green-600" },
  { name: "Party", color: "bg-purple-600" },
  { name: "Sad", color: "bg-slate-600" },
  { name: "Romance", color: "bg-pink-600" },
];

const trendingPlaylists: PlaylistData[] = [
  {
    id: "t1",
    username: "charts.daily",
    userAvatar: "from-purple-600 to-pink-600",
    verified: true,
    playlistName: "viral hits 2024",
    playlistCover: "from-purple-800 to-pink-900",
    songs: [{ title: "Espresso", artist: "Sabrina Carpenter" }],
    totalSongs: 50,
    likes: 12400,
  },
  {
    id: "t2",
    username: "summer.vibes",
    userAvatar: "from-cyan-600 to-blue-600",
    verified: false,
    playlistName: "summer hits",
    playlistCover: "from-cyan-800 to-blue-900",
    songs: [{ title: "Heat Waves", artist: "Glass Animals" }],
    totalSongs: 35,
    likes: 8500,
  },
  {
    id: "t3",
    username: "rap.daily",
    userAvatar: "from-orange-600 to-red-600",
    verified: true,
    playlistName: "rap caviar",
    playlistCover: "from-orange-800 to-red-900",
    songs: [{ title: "Not Like Us", artist: "Kendrick Lamar" }],
    totalSongs: 60,
    likes: 15200,
  },
  {
    id: "t4",
    username: "indie.picks",
    userAvatar: "from-green-600 to-teal-600",
    verified: false,
    playlistName: "indie mix",
    playlistCover: "from-green-800 to-teal-900",
    songs: [{ title: "Motion Sickness", artist: "Phoebe Bridgers" }],
    totalSongs: 40,
    likes: 5200,
  },
];

const ExplorePage = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background p-4 border-b border-border">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search playlists, users, or songs..."
            className="w-full h-11 pl-11 pr-4 rounded-lg bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="font-semibold mb-4">Browse by mood</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`h-16 rounded-lg ${cat.color} flex items-center justify-center font-medium text-sm text-white hover:opacity-90 transition-opacity`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="font-semibold">Trending Playlists</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trendingPlaylists.map((playlist) => (
              <PlaylistCard 
                key={playlist.id} 
                {...playlist} 
                onClick={() => setSelectedPlaylist(playlist)}
              />
            ))}
          </div>
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

export default ExplorePage;
