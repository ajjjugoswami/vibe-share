import { Settings, Grid3X3, Bookmark, Music, Share2, LogOut, Plus } from "lucide-react";
import { Button, Tabs, Avatar, Typography, Empty, Spin, App } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { fetchUserPlaylists, fetchSavedPlaylists } from "@/store/slices/playlistSlice";
import { Link2 } from "lucide-react";

const { Text, Title } = Typography;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("playlists");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  
  const { user } = useAppSelector((state) => state.auth);
  const { userPlaylists, savedPlaylists, isLoading } = useAppSelector((state) => state.playlists);
  const isLoggedIn = !!user;

  const currentPlaylists = activeTab === "playlists" ? userPlaylists : savedPlaylists;

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(fetchUserPlaylists(user.id));
      dispatch(fetchSavedPlaylists());
    }
  }, [isLoggedIn, user, dispatch]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleEditProfile = () => {
    message.info("Edit profile coming soon!");
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/user/${user?.username}`;
    navigator.clipboard.writeText(shareUrl);
    message.success("Profile link copied!");
  };

  const handleSettings = () => {
    message.info("Settings coming soon!");
  };

  const handleLogout = async () => {
    await dispatch(logout());
    message.success("Logged out successfully");
    navigate("/");
  };

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleCreatePlaylist = () => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    } else {
      navigate("/playlist/create");
    }
  };

  const handleEditPlaylist = (playlistId: string) => {
    navigate(`/playlist/${playlistId}/edit`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <Avatar size={80} className="bg-secondary">
          <Music className="w-10 h-10 text-muted-foreground" />
        </Avatar>
        <Title level={4}>Sign in to see your profile</Title>
        <Text type="secondary">Create and manage your playlists</Text>
        <Button type="primary" size="large" onClick={() => navigate("/sign-in")} className="btn-gradient !border-0">
          Sign In
        </Button>
      </div>
    );
  }

  const tabItems = [
    {
      key: "playlists",
      label: (
        <span className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4" />
          My Playlists
        </span>
      ),
    },
    {
      key: "saved",
      label: (
        <span className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Saved
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <Title level={5} className="!mb-0">@{user?.username}</Title>
          <div className="flex items-center gap-1">
            <Button type="text" shape="circle" onClick={handleShareProfile} icon={<Share2 className="w-4 h-4" />} />
            <Button type="text" shape="circle" onClick={handleSettings} icon={<Settings className="w-4 h-4" />} />
            <Button type="text" shape="circle" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />} />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <div className="flex items-start gap-5 mb-6">
          <Avatar size={80} className="bg-primary/20 flex-shrink-0">
            <span className="text-2xl font-bold text-primary">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <Text strong className="block">{userPlaylists.length}</Text>
                <Text type="secondary" className="text-xs">playlists</Text>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Title level={5} className="!mb-1">{user?.username}</Title>
          <Text type="secondary">Sharing my music taste with the world</Text>
        </div>

        <div className="flex gap-3 mb-6">
          <Button block onClick={handleEditProfile}>
            Edit Profile
          </Button>
          <Button type="primary" block onClick={handleCreatePlaylist} icon={<Plus className="w-4 h-4" />} className="btn-gradient !border-0">
            Create Playlist
          </Button>
        </div>

        {/* Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange} 
          items={tabItems}
          centered
          className="!mb-6"
        />

        {/* Grid */}
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <Spin size="large" />
          </div>
        ) : currentPlaylists.length === 0 ? (
          <Empty
            image={<Link2 className="w-16 h-16 mx-auto text-muted-foreground" />}
            description={activeTab === "playlists" ? "No playlists yet" : "No saved playlists"}
          >
            {activeTab === "playlists" && (
              <Button onClick={handleCreatePlaylist} icon={<Plus className="w-4 h-4" />}>
                Create Your First Playlist
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentPlaylists.map((playlist) => (
              <div 
                key={playlist.id}
                className="cursor-pointer group relative"
              >
                <div 
                  onClick={() => handlePlaylistClick(playlist.id)}
                  className="aspect-square rounded-xl mb-2 flex items-center justify-center transition-transform group-hover:scale-[1.02] overflow-hidden"
                >
                  {playlist.songs[0]?.thumbnail ? (
                    <img 
                      src={playlist.songs[0].thumbnail} 
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${playlist.coverGradient} flex items-center justify-center`}>
                      <Link2 className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                </div>
                <Text strong className="text-sm block truncate">{playlist.title}</Text>
                <Text type="secondary" className="text-xs">{playlist.songs.length} songs</Text>
                
                {activeTab === "playlists" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPlaylist(playlist.id);
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;