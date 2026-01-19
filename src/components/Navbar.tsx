import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center glow-purple">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold neon-text-pink">
              vibecheck
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Discover
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Playlists
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Trending
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Community
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button variant="neon" size="sm">
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Discover
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Playlists
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Trending
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Community
              </a>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1">
                  Log in
                </Button>
                <Button variant="neon" className="flex-1">
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
