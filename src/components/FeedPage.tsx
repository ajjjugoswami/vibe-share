import { useState } from "react";
import TopNav from "./TopNav";
import PlaylistCard, { PlaylistData } from "./PlaylistCard";
import PlaylistDetail from "./PlaylistDetail";
import { Plus } from "lucide-react";
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
  {
    id: "7",
    username: "acoustic.daily",
    userAvatar: "from-amber-600 to-yellow-600",
    verified: false,
    playlistName: "acoustic covers",
    playlistCover: "from-amber-700 to-yellow-900",
    description: "Stripped down versions of your favorites",
    songs: [
      { title: "Creep", artist: "Radiohead" },
      { title: "Hallelujah", artist: "Jeff Buckley" },
      { title: "Fast Car", artist: "Tracy Chapman" },
    ],
    totalSongs: 30,
    likes: 2156,
  },
  {
    id: "8",
    username: "edm.nation",
    userAvatar: "from-violet-600 to-blue-600",
    verified: true,
    playlistName: "festival bangers",
    playlistCover: "from-violet-800 to-blue-900",
    description: "Drop the bass",
    songs: [
      { title: "Titanium", artist: "David Guetta" },
      { title: "Levels", artist: "Avicii" },
      { title: "Clarity", artist: "Zedd" },
    ],
    totalSongs: 55,
    likes: 6789,
  },
];

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);

  const handlePlaylistClick = (playlist: PlaylistData) => {
    console.log("[PLAYLIST_OPENED]", { 
      playlistId: playlist.id, 
      playlistName: playlist.playlistName,
      username: playlist.username,
      timestamp: new Date().toISOString() 
    });
    setSelectedPlaylist(playlist);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopNav onShareClick={onShareClick} isLoggedIn={isLoggedIn} />
      
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Fresh Playlists</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              {...playlist} 
              onClick={() => handlePlaylistClick(playlist)}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => console.log("[LOAD_MORE_CLICKED]", { timestamp: new Date().toISOString() })}>
            Load more
          </Button>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={onShareClick}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform md:hidden"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

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
