import { Music, Bell, Search, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const TopNav = ({ onShareClick, isLoggedIn }: TopNavProps) => {
  const navigate = useNavigate();

  const handleNavClick = (section: string) => {
    console.log("[NAV_CLICK]", {
      section,
      timestamp: new Date().toISOString()
    });
  };

  const handleNotificationClick = () => {
    console.log("[NOTIFICATION_CLICK]", {
      timestamp: new Date().toISOString()
    });
  };

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border md:hidden">
      <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">vibecheck</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate("/search")}>
            <Search className="w-4 h-4" />
          </Button>
          {isLoggedIn ? (
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleLoginClick}>
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
