import { Home, Search, Plus, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

const FloatingNav = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/40 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-5 h-5", isActive && "text-primary")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[9px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
        
        {/* Create Button */}
        <button
          onClick={() => navigate(isLoggedIn ? "/playlist/create" : "/sign-in")}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
};

export default FloatingNav;