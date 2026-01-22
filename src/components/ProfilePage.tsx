import { Settings, Grid3X3, Bookmark, Share2, LogOut, Plus, Edit3, Music2 } from "lucide-react";
import { Button, Tabs, Typography, Empty, Spin, App } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { fetchUserPlaylists, fetchSavedPlaylists } from "@/store/slices/playlistSlice";
import { Link2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

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
    navigate('/edit-profile');
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/user/${user?.username}`;
    navigator.clipboard.writeText(shareUrl);
    message.success("Profile link copied!");
  };

  const handleSettings = () => {
    navigate('/settings');
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl animate-pulse-slow" />
          <UserAvatar avatarUrl={user?.avatarUrl} size={100} className="relative bg-secondary" />
        </div>
        <div className="text-center">
          <Title level={3} className="!mb-2">Sign in to see your profile</Title>
          <Text type="secondary">Create and manage your playlists</Text>
        </div>
        <Button type="primary" size="large" onClick={() => navigate("/sign-in")} className="!h-12 !px-8 btn-gradient !border-0 !rounded-xl">
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
          Playlists
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
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
          <Title level={5} className="!mb-0 font-semibold">@{user?.username}</Title>
          <div className="flex items-center gap-1">
            <Button type="text" shape="circle" onClick={handleShareProfile} icon={<Share2 className="w-4 h-4" />} className="!w-10 !h-10" />
            <Button type="text" shape="circle" onClick={handleSettings} icon={<Settings className="w-4 h-4" />} className="!w-10 !h-10" />
            <Button type="text" shape="circle" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />} className="!w-10 !h-10 hover:!text-destructive" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse-slow" />
              <UserAvatar avatarUrl={user?.avatarUrl} size={100} className="relative avatar-ring" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <Title level={3} className="!mb-1">{user?.username}</Title>
              <Text type="secondary" className="block mb-4">{user?.bio || 'Share your music taste with the world ✨'}</Text>
              
              {/* Stats */}
              <div className="flex justify-center sm:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient">{userPlaylists.length}</div>
                  <Text type="secondary" className="text-xs uppercase tracking-wider">Playlists</Text>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient">{savedPlaylists.length}</div>
                  <Text type="secondary" className="text-xs uppercase tracking-wider">Saved</Text>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <Button 
                onClick={handleEditProfile}
                icon={<Edit3 className="w-4 h-4" />}
                className="!h-11 !rounded-xl !bg-secondary hover:!bg-secondary/70 !border-0"
              >
                Edit Profile
              </Button>
              <Button 
                type="primary"
                onClick={handleCreatePlaylist} 
                icon={<Plus className="w-4 h-4" />}
                className="!h-11 !rounded-xl btn-gradient !border-0"
              >
                New Playlist
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange} 
          items={tabItems}
          centered
          className="!mb-6"
        />

        {/* Content */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Spin size="large" />
            <Text type="secondary" className="mt-4">Loading your playlists...</Text>
          </div>
        ) : currentPlaylists.length === 0 ? (
          <Empty
            className="py-16"
            image={
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
                <Music2 className="w-10 h-10 text-primary" />
              </div>
            }
            description={
              <div className="mt-4">
                <Text strong className="block mb-2 text-lg">
                  {activeTab === "playlists" ? "No playlists yet" : "No saved playlists"}
                </Text>
                <Text type="secondary">
                  {activeTab === "playlists" 
                    ? "Create your first playlist and share it with the world!" 
                    : "Save playlists from other users to find them here."}
                </Text>
              </div>
            }
          >
            {activeTab === "playlists" && (
              <Button 
                type="primary"
                onClick={handleCreatePlaylist} 
                icon={<Plus className="w-4 h-4" />}
                className="!mt-4 !h-11 !rounded-xl btn-gradient !border-0"
              >
                Create Your First Playlist
              </Button>
            )}
          </Empty>
        ) : (
          <div className="masonry-grid">
            {currentPlaylists.map((playlist, index) => (
              <div 
                key={playlist.id}
                className="masonry-item card-interactive overflow-hidden cursor-pointer group shine animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  onClick={() => handlePlaylistClick(playlist.id)}
                  className="relative overflow-hidden"
                >
                  {/* Cover - Random aspect ratio */}
                  <div className={`${['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'][index % 3]}`}>
                    {playlist.songs[0]?.thumbnail ? (
                      <img 
                        src={playlist.songs[0].thumbnail} 
                        alt={playlist.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${playlist.coverGradient} flex items-center justify-center`}>
                        <Link2 className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Song count */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                    {playlist.songCount || playlist.songs.length} songs
                  </div>

                  {/* Edit button */}
                  {activeTab === "playlists" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPlaylist(playlist.id);
                      }}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg"
                    >
                      <Edit3 className="w-4 h-4 text-background" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <Text strong className="text-sm block truncate group-hover:text-primary transition-colors">
                    {playlist.title}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {playlist.likesCount} likes
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;