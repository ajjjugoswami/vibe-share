import { Home, Compass, User, Music, LogOut, Plus, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const DesktopSidebar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", icon: Home, label: "Feed" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleCreatePlaylist = () => {
    if (isLoggedIn) {
      navigate("/playlist/create");
    } else {
      navigate("/auth");
    }
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-background border-r border-border flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Music className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-lg">vibecheck</span>
      </div>

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
          <Button variant="accent" className="w-full justify-start gap-3" onClick={handleCreatePlaylist}>
            <Plus className="w-5 h-5" />
            Create Playlist
          </Button>
        </div>
      </nav>

      {/* Auth Section */}
      <div className="border-t border-border p-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-accent">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button variant="accent" className="w-full" onClick={handleLogin}>
            Sign in
          </Button>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
