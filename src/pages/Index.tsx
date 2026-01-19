import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomeFeed from "@/components/HomeFeed";
import ExplorePage from "@/components/ExplorePage";
import CreatePage from "@/components/CreatePage";
import ActivityPage from "@/components/ActivityPage";
import ProfilePage from "@/components/ProfilePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showCreate, setShowCreate] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === "create") {
      setShowCreate(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "home" && <HomeFeed />}
      {activeTab === "explore" && <ExplorePage />}
      {activeTab === "activity" && <ActivityPage />}
      {activeTab === "profile" && <ProfilePage />}
      
      {showCreate && <CreatePage onClose={() => setShowCreate(false)} />}
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
