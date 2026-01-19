import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="md:ml-64">
        <Outlet />
      </div>
      
      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
