import { Settings, Grid3X3, Bookmark, Share2, LogOut, Plus, Edit3, Instagram, Twitter, Youtube, Music, Link2, RefreshCw, Lock } from "lucide-react";
import { Button, Typography, Empty, App, Tabs } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout, refreshUser } from "@/store/slices/authSlice";
import { fetchUserPlaylists, fetchSavedPlaylists, isCacheValid, invalidateUserPlaylists, invalidateSavedPlaylists } from "@/store/slices/playlistSlice";
import { Music2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { PlaylistGridSkeleton } from "@/components/skeletons";

const { Text, Title } = Typography;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("playlists");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  
  const { user } = useAppSelector((state) => state.auth);
  const { 
    userPlaylists, 
    savedPlaylists, 
    isLoading,
    userPlaylistsLastFetched,
    savedPlaylistsLastFetched,
    currentUserId
  } = useAppSelector((state) => state.playlists);
  const isLoggedIn = !!user;

  const publicPlaylists = userPlaylists.filter(p => p.isPublic !== false);
  const privatePlaylists = userPlaylists.filter(p => p.isPublic === false);
  const currentPlaylists = activeTab === "playlists" ? publicPlaylists : activeTab === "private" ? privatePlaylists : savedPlaylists;

  // Only fetch if cache is invalid or user changed
  const fetchData = useCallback((force = false) => {
    if (!isLoggedIn || !user?.id) return;
    
    const userChanged = currentUserId !== user.id;
    
    if (force || userChanged || !isCacheValid(userPlaylistsLastFetched)) {
      dispatch(fetchUserPlaylists(user.id));
    }
    
    if (force || !isCacheValid(savedPlaylistsLastFetched)) {
      dispatch(fetchSavedPlaylists());
    }
  }, [isLoggedIn, user?.id, dispatch, userPlaylistsLastFetched, savedPlaylistsLastFetched, currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(refreshUser()).unwrap();
      // Force invalidate cache and refetch
      dispatch(invalidateUserPlaylists());
      dispatch(invalidateSavedPlaylists());
      fetchData(true);
      message.success("Profile refreshed!");
    } catch (error) {
      message.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/user/${user?.username}`;
    navigator.clipboard.writeText(shareUrl);
    message.success("Profile link copied!");
  };

  const handleLogout = async () => {
    await dispatch(logout());
    message.success("Logged out");
    navigate("/");
  };

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <UserAvatar avatarUrl={user?.avatarUrl} size={64} className="bg-secondary" />
        <Title level={5} className="!mb-0">Sign in to see your profile</Title>
        <Text type="secondary" className="text-sm">Create and manage your playlists</Text>
        <Button size="small" onClick={() => navigate("/sign-in")} className="!rounded-lg !h-8">
          Sign In
        </Button>
      </div>
    );
  }

  const tabItems = [
    { key: "playlists", label: <span className="flex items-center gap-1.5 text-sm"><Grid3X3 className="w-3.5 h-3.5" />Playlists</span> },
    { key: "saved", label: <span className="flex items-center gap-1.5 text-sm"><Bookmark className="w-3.5 h-3.5" />Saved</span> },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-12 max-w-lg mx-auto">
          <Text className="font-medium text-sm">@{user?.username}</Text>
          <div className="flex items-center gap-0.5">
            <Button 
              type="text" 
              size="small" 
              onClick={handleRefresh} 
              icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />} 
              className="!w-8 !h-8" 
              disabled={isRefreshing}
            />
            <Button type="text" size="small" onClick={handleShareProfile} icon={<Share2 className="w-4 h-4" />} className="!w-8 !h-8" />
            <Button type="text" size="small" onClick={() => navigate('/settings')} icon={<Settings className="w-4 h-4" />} className="!w-8 !h-8" />
            <Button type="text" size="small" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />} className="!w-8 !h-8" />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar avatarUrl={user?.avatarUrl} size={90} className="ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
          <div className="flex-1">
            <Title level={5} className="!mb-0">{user?.username}</Title>
            <Text type="secondary" className="text-[11px] leading-none">{user?.bio || 'No bio yet'}</Text>
            <div className="flex gap-4 mt-2">
              <Text className="text-sm"><span className="font-semibold">{publicPlaylists.length}</span> playlists</Text>
              {privatePlaylists.length > 0 && (
                <Text className="text-sm"><span className="font-semibold">{privatePlaylists.length}</span> private</Text>
              )}
              <Text className="text-sm"><span className="font-semibold">{savedPlaylists.length}</span> saved</Text>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {user?.socialLinks && Object.values(user.socialLinks).some(link => link) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {user.socialLinks.instagram && (
                <a 
                  href={user.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a 
                  href={user.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {user.socialLinks.youtube && (
                <a 
                  href={user.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
 
              {user.socialLinks.spotify && (
                <a 
                  href={user.socialLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  title="Spotify"
                >
                  <Music className="w-4 h-4" />
                </a>
              )}
              {user.socialLinks.website && (
                <a 
                  href={user.socialLinks.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  title="Website"
                >
                  <Link2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <Button size="small" onClick={() => navigate('/edit-profile')} icon={<Edit3 className="w-3.5 h-3.5" />} className="flex-1 !rounded-[10px] !h-8">
            Edit Profile
          </Button>
          <Button size="small" onClick={() => navigate('/playlist/create')} icon={<Plus className="w-3.5 h-3.5" />} className="flex-1 !rounded-[10px] !h-8">
            New Playlist
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-5 profile-tabs"
          items={[
            {
              key: 'playlists',
              label: (
                <span className="flex items-center gap-1.5">
                  <Grid3X3 className="w-4 h-4" />
                  Public
                </span>
              ),
            },
            {
              key: 'private',
              label: (
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Private {privatePlaylists.length > 0 && `(${privatePlaylists.length})`}
                </span>
              ),
            },
            {
              key: 'saved',
              label: (
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  Saved
                </span>
              ),
            },
          ]}
        />
        <style>{`
          .profile-tabs .ant-tabs-nav {
            margin-bottom: 0 !important;
          }
          .profile-tabs .ant-tabs-nav-list {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .profile-tabs .ant-tabs-tab {
            flex: 1;
            display: flex;
            justify-content: center;
            margin: 0 !important;
          }
        `}</style>

        {/* Content */}
        {isLoading ? (
          <PlaylistGridSkeleton count={4} />
        ) : currentPlaylists.length === 0 ? (
          <Empty
            className="py-12"
            image={<Music2 className="w-10 h-10 mx-auto text-muted-foreground" />}
            description={<Text type="secondary" className="text-sm">{activeTab === "playlists" ? "No public playlists yet" : activeTab === "private" ? "No private playlists yet" : "No saved playlists"}</Text>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currentPlaylists.map((playlist) => (
              <div 
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist.id)}
                className="cursor-pointer group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-secondary">
                  {playlist.thumbnailUrl ? (
                    <img src={playlist.thumbnailUrl} alt={playlist.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${playlist.coverGradient} flex items-center justify-center`}>
                      <Link2 className="w-6 h-6 text-white/30" />
                    </div>
                  )}
                </div>
                <Text strong className="text-xs block truncate">{playlist.title}</Text>
                <Text type="secondary" className="text-[10px]">{playlist.songCount || playlist.songs.length} songs</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;