import FeedHeader from "./FeedHeader";
import Stories from "./Stories";
import PlaylistPost from "./PlaylistPost";

const posts = [
  {
    id: "1",
    username: "luna.waves",
    userAvatar: "bg-gradient-to-br from-neon-purple to-neon-pink",
    timeAgo: "2h",
    playlistName: "late night drives 🌙",
    playlistCover: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
    songs: [
      { title: "Die For You", artist: "The Weeknd" },
      { title: "Blinding Lights", artist: "The Weeknd" },
      { title: "After Hours", artist: "The Weeknd" },
    ],
    totalSongs: 24,
    likes: 1823,
    comments: 47,
    caption: "perfect for 2am drives when you're in your feels 💜",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    username: "beatdropper",
    userAvatar: "bg-gradient-to-br from-neon-cyan to-neon-purple",
    timeAgo: "5h",
    playlistName: "gym beast mode 💪",
    playlistCover: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900",
    songs: [
      { title: "Lose Yourself", artist: "Eminem" },
      { title: "Stronger", artist: "Kanye West" },
      { title: "Till I Collapse", artist: "Eminem" },
    ],
    totalSongs: 32,
    likes: 3421,
    comments: 89,
    caption: "no skip zone. let's get this bread 🔥",
    isLiked: true,
    isSaved: true,
  },
  {
    id: "3",
    username: "chill.hub",
    userAvatar: "bg-gradient-to-br from-neon-green to-neon-cyan",
    timeAgo: "8h",
    playlistName: "lo-fi study session ☕",
    playlistCover: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900",
    songs: [
      { title: "Snowman", artist: "WYS" },
      { title: "Coffee", artist: "beabadoobee" },
      { title: "Daylight", artist: "Joji" },
    ],
    totalSongs: 45,
    likes: 5672,
    comments: 124,
    caption: "finals week survival kit 📚✨",
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    username: "indie.soul",
    userAvatar: "bg-gradient-to-br from-yellow-500 to-neon-pink",
    timeAgo: "12h",
    playlistName: "hidden gems 💎",
    playlistCover: "bg-gradient-to-br from-amber-900 via-rose-900 to-fuchsia-900",
    songs: [
      { title: "Motion Sickness", artist: "Phoebe Bridgers" },
      { title: "Kyoto", artist: "Phoebe Bridgers" },
      { title: "Pink + White", artist: "Frank Ocean" },
    ],
    totalSongs: 28,
    likes: 2341,
    comments: 56,
    caption: "songs that changed my life no cap",
    isLiked: false,
    isSaved: false,
  },
];

const HomeFeed = () => {
  return (
    <div className="pb-20">
      <FeedHeader />
      <Stories />
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <PlaylistPost key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;
