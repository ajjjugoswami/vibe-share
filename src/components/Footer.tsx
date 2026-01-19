import { Music, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold neon-text-pink">
                vibecheck
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share your music taste with the world. Discover what everyone's listening to.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-neon-pink transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Discover</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Playlists</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Charts</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 vibecheck. Made with 💜 for music lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
