import { Music, Bell, Search, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "antd";

interface TopNavProps {
  onShareClick: () => void;
  isLoggedIn: boolean;
}

const TopNav = ({ onShareClick, isLoggedIn }: TopNavProps) => {
  const navigate = useNavigate();

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
          <Button 
            type="text" 
            shape="circle"
            onClick={() => navigate("/search")}
            icon={<Search className="w-4 h-4" />}
          />
          {isLoggedIn ? (
            <Badge dot offset={[-2, 2]} color="#8b5cf6">
              <Button 
                type="text" 
                shape="circle"
                onClick={handleNotificationClick}
                icon={<Bell className="w-4 h-4" />}
              />
            </Badge>
          ) : (
            <Button 
              type="text" 
              size="small"
              onClick={handleLoginClick}
              icon={<LogIn className="w-4 h-4" />}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;