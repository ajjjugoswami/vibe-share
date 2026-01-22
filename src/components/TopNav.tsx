import { Music2 } from "lucide-react";
import { Typography } from "antd";

const { Text } = Typography;

interface TopNavProps {
  onShareClick?: () => void;
  isLoggedIn?: boolean;
}

const TopNav = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="flex items-center justify-center px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
 
          <Text className="text-base font-semibold italic text-gradient">TuneTangle</Text>
        </div>
      </div>
    </header>
  );
};

export default TopNav;