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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 rounded-[2rem] bg-black/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-5 py-2 rounded-3xl transition-all duration-300",
                  isActive
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-white/70"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    fill={isActive ? "currentColor" : "none"}
                  />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-white" : "text-white/60"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
        
        {/* Create Button */}
        <button
          onClick={() => navigate(isLoggedIn ? "/playlist/create" : "/sign-in")}
          className="w-11 h-11 ml-1 rounded-full bg-primary flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
};

export default FloatingNav;