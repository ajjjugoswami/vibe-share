import { Outlet } from "react-router-dom";
import FloatingNav from "./FloatingNav";
import WelcomeDrawer from "./WelcomeDrawer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-24">
        <Outlet />
      </div>
      
      {/* Floating Navigation - Both Mobile & Desktop */}
      <FloatingNav />
      
      {/* Welcome Drawer - Shows on first visit */}
      <WelcomeDrawer />
    </div>
  );
};

export default MainLayout;
