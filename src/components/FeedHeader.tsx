import { Music, Bell } from "lucide-react";

const FeedHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center glow-purple">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold neon-text-pink">
            vibecheck
          </span>
        </div>
        <button className="p-2 relative hover:bg-muted rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full" />
        </button>
      </div>
      
      {/* Tab Switcher */}
      <div className="flex px-4 gap-4 border-b border-border">
        <button className="py-3 px-1 text-sm font-semibold border-b-2 border-neon-purple text-foreground">
          For You
        </button>
        <button className="py-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Following
        </button>
        <button className="py-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Trending
        </button>
      </div>
    </header>
  );
};

export default FeedHeader;
