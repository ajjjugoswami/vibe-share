import { Search, TrendingUp } from "lucide-react";

const categories = [
  { name: "Chill", gradient: "from-neon-cyan to-blue-600", emoji: "🌊" },
  { name: "Workout", gradient: "from-neon-pink to-red-600", emoji: "💪" },
  { name: "Party", gradient: "from-neon-purple to-pink-600", emoji: "🎉" },
  { name: "Focus", gradient: "from-neon-green to-emerald-600", emoji: "🧠" },
  { name: "Sad", gradient: "from-blue-600 to-indigo-900", emoji: "💔" },
  { name: "Romance", gradient: "from-pink-500 to-rose-600", emoji: "💕" },
];

const trendingPlaylists = [
  { cover: "from-purple-900 to-pink-900", name: "viral hits", likes: "12K" },
  { cover: "from-cyan-900 to-blue-900", name: "summer 24", likes: "8.5K" },
  { cover: "from-orange-900 to-red-900", name: "rap caviar", likes: "15K" },
  { cover: "from-green-900 to-teal-900", name: "indie mix", likes: "5.2K" },
  { cover: "from-pink-900 to-rose-900", name: "pop rising", likes: "9.1K" },
  { cover: "from-indigo-900 to-purple-900", name: "alt zone", likes: "6.7K" },
];

const topCurators = [
  { name: "luna.waves", followers: "12K", gradient: "from-neon-purple to-neon-pink" },
  { name: "beatdropper", followers: "8.2K", gradient: "from-neon-cyan to-neon-purple" },
  { name: "chill.hub", followers: "15K", gradient: "from-neon-green to-neon-cyan" },
  { name: "indie.soul", followers: "5.7K", gradient: "from-yellow-500 to-neon-pink" },
];

const ExplorePage = () => {
  return (
    <div className="pb-24">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search playlists, users, or songs..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple"
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
              className={`h-20 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center gap-2 font-display font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Curators */}
      <div className="px-4 pb-6">
        <h2 className="font-display font-semibold text-lg mb-4">Top curators</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {topCurators.map((curator, index) => (
            <button key={index} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${curator.gradient} p-[2px]`}>
                <div className="w-full h-full rounded-full bg-card" />
              </div>
              <span className="text-xs font-medium truncate w-16 text-center">{curator.name}</span>
              <span className="text-xs text-muted-foreground">{curator.followers}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Playlists */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-neon-pink" />
          <h2 className="font-display font-semibold text-lg">Trending playlists</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {trendingPlaylists.map((playlist, index) => (
            <button
              key={index}
              className="group"
            >
              <div className={`aspect-square bg-gradient-to-br ${playlist.cover} rounded-2xl overflow-hidden relative mb-2`}>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm font-medium truncate text-left">{playlist.name}</p>
              <p className="text-xs text-muted-foreground text-left">❤️ {playlist.likes}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
