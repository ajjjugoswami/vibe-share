import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usersAPI } from "../lib/api";
import { useAuth } from "./AuthContext";

export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  playlistCount: number;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

interface SocialContextType {
  users: UserProfile[];
  following: UserProfile[];
  followers: UserProfile[];
  isLoading: boolean;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  isFollowing: (userId: string) => boolean;
  getUserProfile: (userId: string) => UserProfile | undefined;
  getUserByUsername: (username: string) => UserProfile | undefined;
  getFollowers: (userId: string) => UserProfile[];
  getFollowing: (userId: string) => UserProfile[];
  updateUserStats: (userId: string, updates: Partial<UserProfile>) => void;
  refreshSocialData: () => Promise<void>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
};

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // Fetch social data when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      refreshSocialData();
    } else {
      setFollowing([]);
      setFollowers([]);
    }
  }, [isLoggedIn, user]);

  const refreshSocialData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [followingRes, followersRes] = await Promise.all([
        usersAPI.getUserFollowing(user.id),
        usersAPI.getUserFollowers(user.id)
      ]);

      setFollowing(followingRes.data.users);
      setFollowers(followersRes.data.users);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    try {
      await usersAPI.followUser(userId);
      // Refresh data to get updated counts
      await refreshSocialData();
      console.log("[USER_FOLLOWED]", { userId, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      await usersAPI.unfollowUser(userId);
      // Refresh data to get updated counts
      await refreshSocialData();
      console.log("[USER_UNFOLLOWED]", { userId, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const isFollowing = (userId: string) => following.some(u => u.id === userId);

  const getUserProfile = (userId: string) => users.find(u => u.id === userId);

  const getUserByUsername = (username: string) => 
    users.find(u => u.username.toLowerCase() === username.toLowerCase());

  const getFollowers = (userId: string) => followers;

  const getFollowing = (userId: string) => following;

  const updateUserStats = (userId: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
  };

  return (
    <SocialContext.Provider value={{
      users,
      following,
      followers,
      isLoading,
      followUser,
      unfollowUser,
      isFollowing,
      getUserProfile,
      getUserByUsername,
      getFollowers,
      getFollowing,
      updateUserStats,
      refreshSocialData,
    }}>
      {children}
    </SocialContext.Provider>
  );
};
