import { Search } from "lucide-react";
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

const discoverPlaylists: PlaylistData[] = [
  {
    id: "d1",
    username: "charts.daily",
    userAvatar: "from-purple-600 to-pink-600",
    verified: true,
    playlistName: "viral hits 2024",
    playlistCover: "from-purple-800 to-pink-900",
    description: "This week's most viral songs",
    songs: [{ title: "Espresso", artist: "Sabrina Carpenter" }],
    totalSongs: 50,
    likes: 12400,
  },
  {
    id: "d2",
    username: "summer.vibes",
    userAvatar: "from-cyan-600 to-blue-600",
    verified: false,
    playlistName: "summer hits",
    playlistCover: "from-cyan-800 to-blue-900",
    description: "Your summer soundtrack",
    songs: [{ title: "Heat Waves", artist: "Glass Animals" }],
    totalSongs: 35,
    likes: 8500,
  },
  {
    id: "d3",
    username: "rap.daily",
    userAvatar: "from-orange-600 to-red-600",
    verified: true,
    playlistName: "rap caviar",
    playlistCover: "from-orange-800 to-red-900",
    description: "The hottest hip-hop right now",
    songs: [{ title: "Not Like Us", artist: "Kendrick Lamar" }],
    totalSongs: 60,
    likes: 15200,
  },
  {
    id: "d4",
    username: "indie.picks",
    userAvatar: "from-green-600 to-teal-600",
    verified: false,
    playlistName: "indie mix",
    playlistCover: "from-green-800 to-teal-900",
    description: "Fresh indie discoveries",
    songs: [{ title: "Motion Sickness", artist: "Phoebe Bridgers" }],
    totalSongs: 40,
    likes: 5200,
  },
  {
    id: "d5",
    username: "lofi.beats",
    userAvatar: "from-slate-600 to-gray-600",
    verified: true,
    playlistName: "lofi hip hop",
    playlistCover: "from-slate-800 to-gray-900",
    description: "Beats to relax/study to",
    songs: [{ title: "Snowman", artist: "WYS" }],
    totalSongs: 100,
    likes: 25000,
  },
  {
    id: "d6",
    username: "throwback",
    userAvatar: "from-amber-600 to-yellow-600",
    verified: false,
    playlistName: "2010s hits",
    playlistCover: "from-amber-800 to-yellow-900",
    description: "Nostalgia trip",
    songs: [{ title: "Somebody That I Used To Know", artist: "Gotye" }],
    totalSongs: 80,
    likes: 9800,
  },
  {
    id: "d7",
    username: "pop.central",
    userAvatar: "from-pink-600 to-rose-600",
    verified: true,
    playlistName: "pop rising",
    playlistCover: "from-pink-800 to-rose-900",
    description: "Tomorrow's hits today",
    songs: [{ title: "Flowers", artist: "Miley Cyrus" }],
    totalSongs: 45,
    likes: 7600,
  },
  {
    id: "d8",
    username: "rock.nation",
    userAvatar: "from-red-600 to-orange-600",
    verified: false,
    playlistName: "rock classics",
    playlistCover: "from-red-800 to-orange-900",
    description: "Legends never die",
    songs: [{ title: "Bohemian Rhapsody", artist: "Queen" }],
    totalSongs: 70,
    likes: 18500,
  },
];

const ExplorePage = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[SEARCH]", {
      query: searchQuery,
      timestamp: new Date().toISOString()
    });
  };

  const handleCategoryClick = (category: string) => {
    console.log("[CATEGORY_CLICK]", {
      category,
      timestamp: new Date().toISOString()
    });
  };

  const handlePlaylistClick = (playlist: PlaylistData) => {
    console.log("[DISCOVER_PLAYLIST_OPENED]", {
      playlistId: playlist.id,
      playlistName: playlist.playlistName,
      timestamp: new Date().toISOString()
    });
    setSelectedPlaylist(playlist);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background p-4 border-b border-border">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playlists, users, or songs..."
            className="w-full h-11 pl-11 pr-4 rounded-lg bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </form>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="font-semibold mb-4">Browse by mood</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(cat.name)}
                className={`h-14 rounded-lg ${cat.color} flex items-center justify-center font-medium text-sm text-white hover:opacity-90 transition-opacity`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Discover Playlists */}
        <div>
          <h2 className="font-semibold mb-4">Discover Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {discoverPlaylists.map((playlist) => (
              <PlaylistCard 
                key={playlist.id} 
                {...playlist} 
                onClick={() => handlePlaylistClick(playlist)}
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
