import { Music, Bell, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const TopNav = ({ onShareClick, isLoggedIn }: TopNavProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 h-14 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">
            vibecheck
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm">Feed</Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">Discover</Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">Trending</Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
          </Button>
          <Button variant="accent" size="sm" onClick={onShareClick} className="hidden md:flex">
            <Plus className="w-4 h-4" />
            Share
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
