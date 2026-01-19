import { Search } from "lucide-react";

const categories = [
  { name: "Chill", gradient: "from-neon-cyan to-blue-600", emoji: "🌊" },
  { name: "Workout", gradient: "from-neon-pink to-red-600", emoji: "💪" },
  { name: "Party", gradient: "from-neon-purple to-pink-600", emoji: "🎉" },
  { name: "Focus", gradient: "from-neon-green to-emerald-600", emoji: "🧠" },
  { name: "Sad", gradient: "from-blue-600 to-indigo-900", emoji: "💔" },
  { name: "Romance", gradient: "from-pink-500 to-rose-600", emoji: "💕" },
];

const trendingPlaylists = [
  { cover: "from-purple-900 to-pink-900", name: "viral hits" },
  { cover: "from-cyan-900 to-blue-900", name: "summer 24" },
  { cover: "from-orange-900 to-red-900", name: "rap caviar" },
  { cover: "from-green-900 to-teal-900", name: "indie mix" },
  { cover: "from-pink-900 to-rose-900", name: "pop rising" },
  { cover: "from-indigo-900 to-purple-900", name: "alt zone" },
  { cover: "from-yellow-900 to-orange-900", name: "hot hits" },
  { cover: "from-teal-900 to-cyan-900", name: "chill vibes" },
  { cover: "from-red-900 to-pink-900", name: "throwbacks" },
];

const ExplorePage = () => {
  return (
    <div className="pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search playlists, users, or songs..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-6">
        <h2 className="font-display font-semibold text-lg mb-4">Browse by mood</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`h-20 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center gap-2 font-display font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Grid */}
      <div className="px-4">
        <h2 className="font-display font-semibold text-lg mb-4">Trending now</h2>
        <div className="grid grid-cols-3 gap-1">
          {trendingPlaylists.map((playlist, index) => (
            <button
              key={index}
              className={`aspect-square bg-gradient-to-br ${playlist.cover} rounded-lg overflow-hidden relative group`}
            >
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium px-2 text-center">{playlist.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
