import { Music2, User } from "lucide-react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface TopNavProps {
  onShareClick?: () => void;
  isLoggedIn?: boolean;
}

const TopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
 
          <Text className="text-base font-semibold italic text-gradient">TuneTangle</Text>
        </div>
        <User
          className="w-5 h-5 cursor-pointer text-foreground hover:text-primary transition-colors"
          onClick={() => navigate('/profile')}
        />
      </div>
    </header>
  );
};

export default TopNav;