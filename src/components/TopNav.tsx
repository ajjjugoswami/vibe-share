import { Music, Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const TopNav = ({ onShareClick, isLoggedIn }: TopNavProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold neon-text-pink">
            vibecheck
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm font-medium text-foreground">Feed</button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discover</button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trending</button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:flex">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 relative hover:bg-muted rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full" />
          </button>
          <Button variant="neon" size="sm" onClick={onShareClick} className="hidden md:flex">
            <Plus className="w-4 h-4" />
            Share Playlist
          </Button>
          {!isLoggedIn && (
            <Button variant="ghost" size="sm" onClick={onShareClick} className="hidden md:flex">
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
