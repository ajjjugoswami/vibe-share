import { Home, User, Music, LogOut, Plus, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Avatar, Typography, App } from "antd";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const { Text } = Typography;

const DesktopSidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { message } = App.useApp();

  const navItems = [
    { to: "/", icon: Home, label: "Feed" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    message.success("Logged out successfully");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/sign-in");
  };

  const handleCreatePlaylist = () => {
    if (isLoggedIn) {
      navigate("/playlist/create");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-background border-r border-border flex-col z-50">
 

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Create Playlist Button */}
        <div className="mt-6">
          <Button 
            type="primary" 
            block 
            size="large"
            onClick={handleCreatePlaylist}
            >
            Create Playlist
          </Button>
        </div>
      </nav>

      {/* Auth Section */}
      <div className="border-t border-border p-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Avatar 
              className="bg-accent/20 flex-shrink-0"
              size={40}
            >
              <span className="text-sm font-medium text-accent">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Text className="font-medium text-sm block truncate">{user?.username}</Text>
              <Text type="secondary" className="text-xs block truncate">{user?.email}</Text>
            </div>
            <Button 
              type="text" 
              shape="circle"
              onClick={handleLogout} 
              title="Logout"
              icon={<LogOut className="w-4 h-4" />}
            />
          </div>
        ) : (
          <Button type="primary" block onClick={handleLogin} className="btn-gradient !border-0">
            Sign in
          </Button>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;