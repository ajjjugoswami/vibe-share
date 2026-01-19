import { Music, MessageCircle } from "lucide-react";

const FeedHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold neon-text-pink">
            vibecheck
          </span>
        </div>
        <button className="p-2 relative">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default FeedHeader;
