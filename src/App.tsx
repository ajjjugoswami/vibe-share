import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { SocialProvider } from "./contexts/SocialContext";
import MainLayout from "./components/MainLayout";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Auth from "./pages/Auth";
import CreatePlaylist from "./pages/CreatePlaylist";
import EditPlaylist from "./pages/EditPlaylist";
import ViewPlaylist from "./pages/ViewPlaylist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PlaylistProvider>
            <SocialProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Feed />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/user/:username" element={<UserProfile />} />
                  <Route path="/playlist/create" element={<CreatePlaylist />} />
                  <Route path="/playlist/:id" element={<ViewPlaylist />} />
                  <Route path="/playlist/:id/edit" element={<EditPlaylist />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SocialProvider>
          </PlaylistProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
