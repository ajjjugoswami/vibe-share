import { Home, Compass, User, Music, Settings, LogOut, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DesktopSidebar = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Feed" },
    { to: "/explore", icon: Compass, label: "Discover" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = () => {
    console.log("[LOGOUT_CLICKED]", {
      timestamp: new Date().toISOString()
    });
  };

  const handleSettings = () => {
    console.log("[SETTINGS_CLICKED]", {
      timestamp: new Date().toISOString()
    });
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
          <Button variant="accent" className="w-full justify-start gap-3">
            <Plus className="w-5 h-5" />
            Create Playlist
          </Button>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Music className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Your Name</p>
            <p className="text-xs text-muted-foreground truncate">@yourname</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around text-center mb-4 py-2">
          <div>
            <div className="font-semibold text-sm">4</div>
            <div className="text-[10px] text-muted-foreground">playlists</div>
          </div>
          <div>
            <div className="font-semibold text-sm">1.2K</div>
            <div className="text-[10px] text-muted-foreground">followers</div>
          </div>
          <div>
            <div className="font-semibold text-sm">342</div>
            <div className="text-[10px] text-muted-foreground">following</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1" onClick={handleSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
