import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-muted-foreground">Share your vibe with the world</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Your music,</span>
            <br />
            <span className="neon-text-pink">your vibe,</span>
            <br />
            <span className="neon-text-cyan">shared.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover what's on everyone's playlist. Share your favorites, 
            find new bangers, and connect with music lovers worldwide. 🔥
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="neon" size="xl">
              <Play className="w-5 h-5" />
              Start Exploring
            </Button>
            <Button variant="neon-outline" size="xl">
              Share Your Playlist
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16">
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold neon-text-pink">10K+</div>
              <div className="text-sm text-muted-foreground">Playlists Shared</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold neon-text-cyan">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">1M+</div>
              <div className="text-sm text-muted-foreground">Songs Discovered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
