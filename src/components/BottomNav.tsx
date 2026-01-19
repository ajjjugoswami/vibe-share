import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { useState } from "react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "explore", icon: Search, label: "Explore" },
    { id: "create", icon: PlusSquare, label: "Create" },
    { id: "activity", icon: Heart, label: "Activity" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCreate = tab.id === "create";
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                isCreate 
                  ? "" 
                  : isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isCreate ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <Icon 
                  className={`w-6 h-6 transition-all ${isActive ? "scale-110" : ""}`} 
                  fill={isActive && tab.id !== "explore" ? "currentColor" : "none"}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
