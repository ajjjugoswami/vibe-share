import TopNav from "./TopNav";
import PlaylistCard from "./PlaylistCard";
import SongCard from "./SongCard";
import { Plus, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedPageProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const playlists = [
  {
    id: "1",
    username: "luna.waves",
    userAvatar: "from-neon-purple to-neon-pink",
    verified: false,
    playlistName: "late night drives 🌙",
    playlistCover: "from-indigo-900 via-purple-900 to-pink-900",
    songs: [
      { title: "Die For You", artist: "The Weeknd" },
      { title: "Blinding Lights", artist: "The Weeknd" },
      { title: "Save Your Tears", artist: "The Weeknd" },
    ],
    totalSongs: 24,
    likes: 1823,
  },
  {
    id: "2",
    username: "beatdropper",
    userAvatar: "from-neon-cyan to-neon-purple",
    verified: true,
    playlistName: "gym beast mode 💪",
    playlistCover: "from-red-900 via-orange-900 to-yellow-900",
    songs: [
      { title: "Lose Yourself", artist: "Eminem" },
      { title: "Stronger", artist: "Kanye West" },
      { title: "Till I Collapse", artist: "Eminem" },
    ],
    totalSongs: 32,
    likes: 3421,
  },
  {
    id: "3",
    username: "chill.hub",
    userAvatar: "from-neon-green to-neon-cyan",
    verified: true,
    playlistName: "lo-fi study session ☕",
    playlistCover: "from-emerald-900 via-teal-900 to-cyan-900",
    songs: [
      { title: "Snowman", artist: "WYS" },
      { title: "Coffee", artist: "beabadoobee" },
      { title: "Daylight", artist: "Joji" },
    ],
    totalSongs: 45,
    likes: 5672,
  },
  {
    id: "4",
    username: "indie.soul",
    userAvatar: "from-yellow-500 to-neon-pink",
    verified: false,
    playlistName: "hidden gems 💎",
    playlistCover: "from-amber-900 via-rose-900 to-fuchsia-900",
    songs: [
      { title: "Motion Sickness", artist: "Phoebe Bridgers" },
      { title: "Kyoto", artist: "Phoebe Bridgers" },
      { title: "Pink + White", artist: "Frank Ocean" },
    ],
    totalSongs: 28,
    likes: 2341,
  },
  {
    id: "5",
    username: "vibes.fm",
    userAvatar: "from-blue-500 to-purple-600",
    verified: true,
    playlistName: "summer roadtrip 🌴",
    playlistCover: "from-sky-800 via-blue-900 to-indigo-900",
    songs: [
      { title: "Heat Waves", artist: "Glass Animals" },
      { title: "Levitating", artist: "Dua Lipa" },
      { title: "Good 4 U", artist: "Olivia Rodrigo" },
    ],
    totalSongs: 35,
    likes: 4521,
  },
  {
    id: "6",
    username: "retro.wave",
    userAvatar: "from-pink-500 to-orange-500",
    verified: false,
    playlistName: "80s synth vibes",
    playlistCover: "from-fuchsia-900 via-pink-900 to-orange-900",
    songs: [
      { title: "Take On Me", artist: "a-ha" },
      { title: "Africa", artist: "Toto" },
      { title: "Sweet Dreams", artist: "Eurythmics" },
    ],
    totalSongs: 42,
    likes: 1892,
  },
];

const trendingSongs = [
  { title: "Espresso", artist: "Sabrina Carpenter", cover: "from-amber-800 to-orange-900", addedBy: 12400, rank: 1 },
  { title: "Not Like Us", artist: "Kendrick Lamar", cover: "from-gray-800 to-zinc-900", addedBy: 9800, rank: 2 },
  { title: "Please Please Please", artist: "Sabrina Carpenter", cover: "from-rose-800 to-pink-900", addedBy: 8200, rank: 3 },
  { title: "Lunch", artist: "Billie Eilish", cover: "from-blue-800 to-cyan-900", addedBy: 6500, rank: 4 },
];

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Layout: Grid on desktop, stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Feed - Playlists Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-neon-purple" />
              <h2 className="font-display font-semibold">Fresh Playlists</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} {...playlist} />
              ))}
            </div>
            
            {/* Load more */}
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="w-full md:w-auto">
                Load more playlists
              </Button>
            </div>
          </div>
          
          {/* Sidebar - Trending Songs */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-neon-pink" />
                <h2 className="font-display font-semibold">Trending Songs</h2>
              </div>
              
              <div className="space-y-2">
                {trendingSongs.map((song, index) => (
                  <SongCard key={index} {...song} />
                ))}
              </div>
              
              {/* Share CTA */}
              <div className="glass-card p-4 mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Got a fire playlist? Share it with the world 🔥
                </p>
                <Button variant="neon" size="sm" onClick={onShareClick} className="w-full">
                  <Plus className="w-4 h-4" />
                  Share Your Playlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={onShareClick}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg glow-purple z-40 hover:scale-110 active:scale-95 transition-transform md:hidden"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default FeedPage;
