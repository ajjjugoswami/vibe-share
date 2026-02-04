import { Outlet } from "react-router-dom";
import FloatingNav from "./FloatingNav";
import WelcomeDrawer from "./WelcomeDrawer";
import TopNav from "./TopNav";
import { useWelcome } from "@/contexts/WelcomeContext";
import { useNotificationPolling } from "@/hooks/useNotificationPolling";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { message } from "antd";

const MainLayout = () => {
  const { isWelcomeOpen, closeWelcome } = useWelcome();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const { unreadCount, setUnreadCount, error, clearError } = useNotificationPolling(isAuthenticated);

  // Show error message when notification polling fails
  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="h-screen-mobile flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <TopNav />
      
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <Outlet />
      </div>
      
      {/* Floating Navigation with Notifications */}
      <FloatingNav 
        unreadCount={unreadCount}
        onUnreadCountChange={setUnreadCount}
      />
      
      {/* Welcome Drawer - Shows on first visit or when triggered */}
      <WelcomeDrawer isOpen={isWelcomeOpen} onClose={closeWelcome} />
    </div>
  );
};

export default MainLayout;
