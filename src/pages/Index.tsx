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
    if ((tab === "create" || tab === "profile") && !isLoggedIn) {
      setShowAuth(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "home" && <FeedPage onShareClick={() => !isLoggedIn && setShowAuth(true)} isLoggedIn={isLoggedIn} />}
      {activeTab === "explore" && <ExplorePage />}
      {activeTab === "activity" && <FeedPage onShareClick={() => !isLoggedIn && setShowAuth(true)} isLoggedIn={isLoggedIn} />}
      {activeTab === "profile" && <ProfilePage />}
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
