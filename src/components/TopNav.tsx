import { Sparkles } from "lucide-react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface TopNavProps {
  onShareClick?: () => void;
  isLoggedIn?: boolean;
}

const TopNav = ({ isLoggedIn }: TopNavProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass-strong">
      <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <Text className="text-lg font-bold text-gradient">VibeShare</Text>
        </div>
        {!isLoggedIn && (
          <Button 
            type="primary" 
            onClick={() => navigate("/sign-in")}
            className="!h-10 !rounded-xl btn-gradient !border-0"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default TopNav;