import { Verified, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const users = [
  {
    name: "luna.waves",
    bio: "nocturnal vibes only 🌙",
    followers: "12.4K",
    playlists: 8,
    gradient: "from-neon-purple to-neon-pink",
  },
  {
    name: "beatdropper",
    bio: "producer & playlist curator",
    followers: "8.2K",
    playlists: 15,
    gradient: "from-neon-cyan to-neon-purple",
    verified: true,
  },
  {
    name: "indie.soul",
    bio: "finding hidden gems daily",
    followers: "5.7K",
    playlists: 22,
    gradient: "from-neon-pink to-orange-500",
  },
];

const UserSpotlight = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Top <span className="neon-text-pink">Curators</span> ✨
          </h2>
          <p className="text-muted-foreground">
            Follow the tastemakers
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {users.map((user, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Avatar */}
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${user.gradient} p-1 mb-4`}>
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="font-display font-semibold text-lg">@{user.name}</h3>
                {user.verified && (
                  <Verified className="w-4 h-4 text-neon-cyan" fill="currentColor" />
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div>
                  <div className="font-display font-semibold">{user.followers}</div>
                  <div className="text-xs text-muted-foreground">followers</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="font-display font-semibold">{user.playlists}</div>
                  <div className="text-xs text-muted-foreground">playlists</div>
                </div>
              </div>

              {/* Follow Button */}
              <Button variant="neon-outline" className="w-full">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserSpotlight;
