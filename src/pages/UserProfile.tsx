import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Empty, Spin, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ArrowLeft, MoreHorizontal, Grid3X3, Link2, Users } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { usePlaylist, Playlist } from "@/contexts/PlaylistContext";
import { usersAPI } from "@/lib/api";

interface UserData {
  id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  playlistCount?: number;
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!currentUser;
  const { playlists, getUserPlaylists } = usePlaylist();
  
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOwnProfile = currentUser?.username?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      
      setLoadingUser(true);
      setError(null);
      try {
        const response = await usersAPI.getUserByUsername(username);
        const fetchedUser = response.data.user;
        // Normalize user shape: backend returns `_id`, frontend expects `id`
        setUserProfile({
          id: fetchedUser.id || fetchedUser._id,
          username: fetchedUser.username,
          bio: fetchedUser.bio,
          avatarUrl: fetchedUser.avatarUrl,
          playlistCount: fetchedUser.playlistCount || 0,
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('User not found');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!userProfile) return;
      
      setLoadingPlaylists(true);
      try {
        const fetchedPlaylists = await getUserPlaylists(userProfile.id, { limit: 20 });
        setUserPlaylists(fetchedPlaylists);
      } catch (error) {
        console.error('Failed to fetch user playlists:', error);
      } finally {
        setLoadingPlaylists(false);
      }
    };

    if (userProfile) {
      if (isOwnProfile) {
        setUserPlaylists(playlists);
      } else {
        fetchUserPlaylists();
      }
    }
  }, [userProfile, isOwnProfile, playlists, getUserPlaylists]);

  const moreMenuItems: MenuProps["items"] = [
    { key: "share", label: "Share Profile" },
    { key: "report", label: "Report User" },
  ];

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-muted-foreground mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || (!userProfile && !isOwnProfile)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Users className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">{error || "User not found"}</p>
        <Button onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const displayProfile = isOwnProfile 
    ? { 
        id: currentUser?.id || "1",
        username: currentUser?.username || "",
        bio: currentUser?.bio || "No bio yet",
        playlistCount: playlists.length,
      }
    : userProfile!;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-medium">@{displayProfile.username}</h1>
          <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]}>
            <button className="p-2 -mr-2 hover:bg-secondary rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </Dropdown>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-start gap-5 mb-6">
          <Avatar
            size={80}
            className="!bg-accent/20 !text-accent flex-shrink-0"
          >
            <span className="text-2xl font-bold">
              {displayProfile.username.charAt(0).toUpperCase()}
            </span>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="font-semibold">{displayProfile.playlistCount}</div>
                <div className="text-xs text-muted-foreground">playlists</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="font-semibold">{displayProfile.username}</h2>
          <p className="text-sm text-muted-foreground mt-1">{displayProfile.bio}</p>
        </div>

        {/* Actions */}

        {isOwnProfile && (
          <div className="flex gap-3 mb-6">
            <Button block onClick={() => navigate("/profile")}>
              Edit Profile
            </Button>
            <Button
              type="primary"
              block
              onClick={() => navigate("/playlist/create")}
              className="!bg-accent hover:!bg-accent/90 !border-0"
            >
              Create Playlist
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-foreground text-foreground text-sm">
            <Grid3X3 className="w-4 h-4" />
            Playlists
          </button>
        </div>

        {/* Playlists Grid */}
        {loadingPlaylists ? (
          <div className="py-16 text-center">
            <Spin />
          </div>
        ) : userPlaylists.length === 0 ? (
          <Empty
            image={<Link2 className="w-16 h-16 mx-auto text-muted-foreground" />}
            description="No playlists yet"
            className="py-16"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userPlaylists.map((playlist) => (
              <div 
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="cursor-pointer group"
              >
                <div className={`aspect-square rounded-xl bg-gradient-to-br ${playlist.coverGradient} mb-2 flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
                  <Link2 className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-sm font-medium truncate">{playlist.title}</p>
                <p className="text-xs text-muted-foreground">{playlist.songCount || playlist.songs.length} songs</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;