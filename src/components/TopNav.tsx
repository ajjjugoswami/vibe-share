import { Music2 } from "lucide-react";
import { Typography } from "antd";

const { Text } = Typography;

interface TopNavProps {
  onShareClick?: () => void;
  isLoggedIn?: boolean;
}

const TopNav = ({}: TopNavProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="flex items-center justify-center px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Music2 className="w-3.5 h-3.5 text-white" />
          </div>
          <Text className="text-base font-semibold">VibeShare</Text>
        </div>
      </div>
    </header>
  );
};

export default TopNav;