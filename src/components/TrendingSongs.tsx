import { Play, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const songs = [
  { rank: 1, title: "Espresso", artist: "Sabrina Carpenter", plays: "2.3M", trend: "+12%" },
  { rank: 2, title: "Please Please Please", artist: "Sabrina Carpenter", plays: "1.8M", trend: "+8%" },
  { rank: 3, title: "Not Like Us", artist: "Kendrick Lamar", plays: "1.5M", trend: "+15%" },
  { rank: 4, title: "Lunch", artist: "Billie Eilish", plays: "1.2M", trend: "+5%" },
  { rank: 5, title: "A Bar Song (Tipsy)", artist: "Shaboozey", plays: "980K", trend: "+22%" },
];

const TrendingSongs = () => {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <TrendingUp className="w-4 h-4 text-neon-pink" />
            <span className="text-sm text-muted-foreground">Updated hourly</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Songs on <span className="neon-text-cyan">Fire</span> 🔥
          </h2>
          <p className="text-muted-foreground">
            Most shared songs this week
          </p>
        </div>

        {/* Songs List */}
        <div className="max-w-3xl mx-auto">
          {songs.map((song, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rank */}
              <div className={`w-8 text-center font-display font-bold text-xl ${
                song.rank === 1 ? 'neon-text-pink' : 
                song.rank === 2 ? 'neon-text-cyan' : 
                song.rank === 3 ? 'text-neon-purple' : 
                'text-muted-foreground'
              }`}>
                {song.rank}
              </div>

              {/* Cover placeholder */}
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${
                index % 3 === 0 ? 'from-neon-purple to-neon-pink' :
                index % 3 === 1 ? 'from-neon-cyan to-neon-purple' :
                'from-neon-pink to-orange-500'
              } flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{song.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6">
                <span className="text-sm text-muted-foreground">{song.plays}</span>
                <span className="text-sm text-neon-green">{song.trend}</span>
              </div>

              {/* Add Button */}
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="neon" size="lg">
            See Full Charts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSongs;
