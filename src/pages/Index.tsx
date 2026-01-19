import { useState } from "react";
import FeedPage from "@/components/FeedPage";
import ExplorePage from "@/components/ExplorePage";
import ProfilePage from "@/components/ProfilePage";
import AuthModal from "@/components/AuthModal";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTabChange = (tab: string) => {
    console.log("[TAB_CHANGE]", {
      from: activeTab,
      to: tab,
      isLoggedIn,
      timestamp: new Date().toISOString()
    });

    if (tab === "profile" && !isLoggedIn) {
      setShowAuth(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleShareClick = () => {
    console.log("[SHARE_CLICK]", {
      isLoggedIn,
      timestamp: new Date().toISOString()
    });

    if (!isLoggedIn) {
      setShowAuth(true);
    } else {
      // TODO: Open create playlist modal
      console.log("[OPEN_CREATE_PLAYLIST]", {
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleLogin = () => {
    console.log("[USER_AUTHENTICATED]", {
      timestamp: new Date().toISOString()
    });
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleCloseAuth = () => {
    console.log("[AUTH_MODAL_CLOSED]", {
      timestamp: new Date().toISOString()
    });
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "home" && <FeedPage onShareClick={handleShareClick} isLoggedIn={isLoggedIn} />}
      {activeTab === "explore" && <ExplorePage />}
      {activeTab === "profile" && <ProfilePage />}
      
      {showAuth && <AuthModal onClose={handleCloseAuth} onLogin={handleLogin} />}
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
