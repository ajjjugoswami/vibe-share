import { useState } from "react";
import TopNav from "./TopNav";
import PlaylistCard, { PlaylistData } from "./PlaylistCard";
import PlaylistDetail from "./PlaylistDetail";
import SongCard from "./SongCard";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedPageProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const playlists: PlaylistData[] = [
  {
    id: "1",
    username: "luna.waves",
    userAvatar: "from-purple-600 to-pink-600",
    verified: false,
    playlistName: "late night drives",
    playlistCover: "from-indigo-800 to-purple-900",
    description: "Perfect for 2am drives when you're in your feels",
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
    userAvatar: "from-cyan-600 to-purple-600",
    verified: true,
    playlistName: "gym beast mode",
    playlistCover: "from-red-800 to-orange-900",
    description: "No skip zone. Let's get this bread.",
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
    userAvatar: "from-green-600 to-cyan-600",
    verified: true,
    playlistName: "lo-fi study session",
    playlistCover: "from-emerald-800 to-teal-900",
    description: "Finals week survival kit",
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
    userAvatar: "from-yellow-600 to-pink-600",
    verified: false,
    playlistName: "hidden gems",
    playlistCover: "from-amber-800 to-rose-900",
    description: "Songs that changed my life",
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
    userAvatar: "from-blue-600 to-purple-600",
    verified: true,
    playlistName: "summer roadtrip",
    playlistCover: "from-sky-700 to-indigo-900",
    description: "Windows down, music up",
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
    userAvatar: "from-pink-600 to-orange-600",
    verified: false,
    playlistName: "80s synth vibes",
    playlistCover: "from-fuchsia-800 to-orange-900",
    description: "Throwback to the classics",
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
  { title: "Espresso", artist: "Sabrina Carpenter", cover: "from-amber-700 to-orange-800", addedBy: 12400, rank: 1 },
  { title: "Not Like Us", artist: "Kendrick Lamar", cover: "from-gray-700 to-zinc-800", addedBy: 9800, rank: 2 },
  { title: "Please Please Please", artist: "Sabrina Carpenter", cover: "from-rose-700 to-pink-800", addedBy: 8200, rank: 3 },
  { title: "Lunch", artist: "Billie Eilish", cover: "from-blue-700 to-cyan-800", addedBy: 6500, rank: 4 },
  { title: "Birds of a Feather", artist: "Billie Eilish", cover: "from-teal-700 to-green-800", addedBy: 5100, rank: 5 },
];

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Fresh Playlists</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <PlaylistCard 
                  key={playlist.id} 
                  {...playlist} 
                  onClick={() => setSelectedPlaylist(playlist)}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline">
                Load more
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h2 className="font-semibold">Trending Songs</h2>
              </div>
              
              <div className="bg-card rounded-xl p-2">
                {trendingSongs.map((song, index) => (
                  <SongCard key={index} {...song} />
                ))}
              </div>
              
              {/* Share CTA */}
              <div className="bg-card rounded-xl p-4 mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Share your playlist with the community
                </p>
                <Button variant="accent" size="sm" onClick={onShareClick} className="w-full">
                  <Plus className="w-4 h-4" />
                  Share Playlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={onShareClick}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform md:hidden"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

      {/* Playlist Detail Modal */}
      {selectedPlaylist && (
        <PlaylistDetail 
          playlist={selectedPlaylist} 
          onClose={() => setSelectedPlaylist(null)} 
        />
      )}
    </div>
  );
};

export default FeedPage;
