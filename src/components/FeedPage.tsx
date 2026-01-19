import { Music, Plus } from "lucide-react";
import FeedHeader from "./FeedHeader";
import PlaylistFeedCard from "./PlaylistFeedCard";
import SongSuggestion from "./SongSuggestion";
import { Button } from "@/components/ui/button";

interface FeedPageProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const feedItems = [
  {
    type: "playlist" as const,
    id: "1",
    username: "luna.waves",
    userAvatar: "from-neon-purple to-neon-pink",
    verified: false,
    timeAgo: "2h",
    playlistName: "late night drives 🌙",
    playlistCover: "from-indigo-900 via-purple-900 to-pink-900",
    description: "perfect for 2am drives when you're in your feels",
    songs: [
      { title: "Die For You", artist: "The Weeknd", duration: "3:52" },
      { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
      { title: "Save Your Tears", artist: "The Weeknd", duration: "3:35" },
      { title: "After Hours", artist: "The Weeknd", duration: "6:01" },
    ],
    totalSongs: 24,
    likes: 1823,
    shares: 234,
  },
  {
    type: "suggestion" as const,
    id: "s1",
    title: "Espresso",
    artist: "Sabrina Carpenter",
    albumCover: "from-amber-800 to-orange-900",
    suggestedBy: 2341,
  },
  {
    type: "playlist" as const,
    id: "2",
    username: "beatdropper",
    userAvatar: "from-neon-cyan to-neon-purple",
    verified: true,
    timeAgo: "5h",
    playlistName: "gym beast mode 💪",
    playlistCover: "from-red-900 via-orange-900 to-yellow-900",
    description: "no skip zone. let's get this bread",
    songs: [
      { title: "Lose Yourself", artist: "Eminem", duration: "5:26" },
      { title: "Stronger", artist: "Kanye West", duration: "5:11" },
      { title: "Till I Collapse", artist: "Eminem", duration: "4:57" },
      { title: "Power", artist: "Kanye West", duration: "4:52" },
    ],
    totalSongs: 32,
    likes: 3421,
    shares: 567,
  },
  {
    type: "suggestion" as const,
    id: "s2",
    title: "Not Like Us",
    artist: "Kendrick Lamar",
    albumCover: "from-gray-800 to-zinc-900",
    suggestedBy: 5672,
  },
  {
    type: "playlist" as const,
    id: "3",
    username: "chill.hub",
    userAvatar: "from-neon-green to-neon-cyan",
    verified: true,
    timeAgo: "8h",
    playlistName: "lo-fi study session ☕",
    playlistCover: "from-emerald-900 via-teal-900 to-cyan-900",
    description: "finals week survival kit",
    songs: [
      { title: "Snowman", artist: "WYS", duration: "2:45" },
      { title: "Coffee", artist: "beabadoobee", duration: "3:28" },
      { title: "Daylight", artist: "Joji", duration: "2:44" },
      { title: "Glimpse of Us", artist: "Joji", duration: "3:53" },
    ],
    totalSongs: 45,
    likes: 5672,
    shares: 890,
  },
  {
    type: "playlist" as const,
    id: "4",
    username: "indie.soul",
    userAvatar: "from-yellow-500 to-neon-pink",
    verified: false,
    timeAgo: "12h",
    playlistName: "hidden gems 💎",
    playlistCover: "from-amber-900 via-rose-900 to-fuchsia-900",
    description: "songs that changed my life no cap",
    songs: [
      { title: "Motion Sickness", artist: "Phoebe Bridgers", duration: "3:50" },
      { title: "Kyoto", artist: "Phoebe Bridgers", duration: "2:53" },
      { title: "Pink + White", artist: "Frank Ocean", duration: "3:04" },
      { title: "Self Control", artist: "Frank Ocean", duration: "4:09" },
    ],
    totalSongs: 28,
    likes: 2341,
    shares: 345,
  },
];

const FeedPage = ({ onShareClick, isLoggedIn }: FeedPageProps) => {
  return (
    <div className="pb-24">
      <FeedHeader />
      
      {/* Feed Content */}
      <div className="space-y-4 px-4 pt-4">
        {feedItems.map((item) => (
          item.type === "playlist" ? (
            <PlaylistFeedCard key={item.id} {...item} />
          ) : (
            <SongSuggestion key={item.id} {...item} />
          )
        ))}
      </div>

      {/* Floating Share Button */}
      <button
        onClick={onShareClick}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg glow-purple z-40 hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default FeedPage;
