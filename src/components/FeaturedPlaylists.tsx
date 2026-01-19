import PlaylistCard from "./PlaylistCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const playlists = [
  {
    title: "late night drives 🌙",
    creator: "luna.waves",
    coverGradient: "bg-gradient-to-br from-neon-purple to-neon-pink",
    songCount: 24,
    likes: 1823,
  },
  {
    title: "main character energy",
    creator: "zoevibes",
    coverGradient: "bg-gradient-to-br from-neon-cyan to-neon-purple",
    songCount: 18,
    likes: 3421,
  },
  {
    title: "gym beast mode 💪",
    creator: "fitking99",
    coverGradient: "bg-gradient-to-br from-neon-pink to-orange-500",
    songCount: 32,
    likes: 892,
  },
  {
    title: "lo-fi chill beats",
    creator: "chillhop.daily",
    coverGradient: "bg-gradient-to-br from-neon-green to-neon-cyan",
    songCount: 45,
    likes: 5672,
  },
  {
    title: "heartbreak hotel 💔",
    creator: "sad.hours",
    coverGradient: "bg-gradient-to-br from-blue-600 to-neon-purple",
    songCount: 28,
    likes: 2341,
  },
  {
    title: "indie gems 2024",
    creator: "music.hunter",
    coverGradient: "bg-gradient-to-br from-yellow-500 to-neon-pink",
    songCount: 21,
    likes: 1456,
  },
];

const FeaturedPlaylists = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              <span className="neon-text-pink">Trending</span> Playlists
            </h2>
            <p className="text-muted-foreground">
              What everyone's vibing to rn 🔥
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex items-center gap-2 text-neon-cyan hover:text-neon-cyan">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {playlists.map((playlist, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PlaylistCard {...playlist} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="flex justify-center mt-8 md:hidden">
          <Button variant="neon-outline">
            View all playlists
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlaylists;
