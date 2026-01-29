import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./MainLayout";
import PageTransition from "./PageTransition";
import Feed from "@/pages/Feed";
import Discover from "@/pages/Discover";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import CreatePlaylist from "@/pages/CreatePlaylist";
import Settings from "@/pages/Settings";
import EditPlaylist from "@/pages/EditPlaylist";
import EditProfile from "@/pages/EditProfile";
import ViewPlaylist from "@/pages/ViewPlaylist";
import NotFound from "@/pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/sign-in"
          element={
            <PageTransition>
              <SignIn />
            </PageTransition>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PageTransition>
              <SignUp />
            </PageTransition>
          }
        />

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Feed />
              </PageTransition>
            }
          />
          <Route
            path="/discover"
            element={
              <PageTransition>
                <Discover />
              </PageTransition>
            }
          />
          <Route
            path="/search"
            element={
              <PageTransition>
                <Search />
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition>
                <Profile />
              </PageTransition>
            }
          />
          <Route
            path="/user/:username"
            element={
              <PageTransition>
                <UserProfile />
              </PageTransition>
            }
          />
          <Route
            path="/playlist/create"
            element={
              <PageTransition>
                <CreatePlaylist />
              </PageTransition>
            }
          />
          <Route
            path="/settings"
            element={
              <PageTransition>
                <Settings />
              </PageTransition>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PageTransition>
                <EditProfile />
              </PageTransition>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <PageTransition>
                <ViewPlaylist />
              </PageTransition>
            }
          />
          <Route
            path="/playlist/:id/edit"
            element={
              <PageTransition>
                <EditPlaylist />
              </PageTransition>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
