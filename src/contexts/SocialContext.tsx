import { createContext, useContext, useState, ReactNode } from "react";

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
  following: string[]; // User IDs the current user follows
  followers: string[]; // User IDs that follow the current user
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  getUserProfile: (userId: string) => UserProfile | undefined;
  getUserByUsername: (username: string) => UserProfile | undefined;
  getFollowers: (userId: string) => UserProfile[];
  getFollowing: (userId: string) => UserProfile[];
  updateUserStats: (userId: string, updates: Partial<UserProfile>) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
};

// Mock users data
const initialUsers: UserProfile[] = [
  {
    id: "1",
    username: "musiclover",
    bio: "Sharing my music taste with the world 🎵",
    playlistCount: 5,
    followersCount: 1234,
    followingCount: 89,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    username: "djmax",
    bio: "DJ | Producer | Music Curator 🎧",
    playlistCount: 12,
    followersCount: 5432,
    followingCount: 234,
    createdAt: "2023-12-15",
  },
  {
    id: "3",
    username: "indievibes",
    bio: "Discovering indie gems since 2020 ✨",
    playlistCount: 8,
    followersCount: 876,
    followingCount: 156,
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    username: "hiphophead",
    bio: "Hip-hop culture enthusiast 🔥",
    playlistCount: 15,
    followersCount: 2341,
    followingCount: 312,
    createdAt: "2023-11-20",
  },
  {
    id: "5",
    username: "chillbeats",
    bio: "Lo-fi & chill vibes only 🌙",
    playlistCount: 6,
    followersCount: 3456,
    followingCount: 78,
    createdAt: "2024-02-01",
  },
];

// Mock relationships
const initialFollowing: string[] = ["2", "3"];
const initialFollowers: string[] = ["4", "5"];

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [following, setFollowing] = useState<string[]>(initialFollowing);
  const [followers] = useState<string[]>(initialFollowers);

  const followUser = (userId: string) => {
    if (!following.includes(userId)) {
      setFollowing(prev => [...prev, userId]);
      // Update follower count for target user
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, followersCount: u.followersCount + 1 }
          : u
      ));
      console.log("[USER_FOLLOWED]", { userId, timestamp: new Date().toISOString() });
    }
  };

  const unfollowUser = (userId: string) => {
    setFollowing(prev => prev.filter(id => id !== userId));
    // Update follower count for target user
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, followersCount: Math.max(0, u.followersCount - 1) }
        : u
    ));
    console.log("[USER_UNFOLLOWED]", { userId, timestamp: new Date().toISOString() });
  };

  const isFollowing = (userId: string) => following.includes(userId);

  const getUserProfile = (userId: string) => users.find(u => u.id === userId);

  const getUserByUsername = (username: string) => 
    users.find(u => u.username.toLowerCase() === username.toLowerCase());

  const getFollowers = (userId: string) => 
    users.filter(u => following.includes(u.id)); // Simplified mock

  const getFollowing = (userId: string) => 
    users.filter(u => following.includes(u.id));

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
      followUser,
      unfollowUser,
      isFollowing,
      getUserProfile,
      getUserByUsername,
      getFollowers,
      getFollowing,
      updateUserStats,
    }}>
      {children}
    </SocialContext.Provider>
  );
};
