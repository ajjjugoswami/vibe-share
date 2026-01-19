import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Grid3X3, Link2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSocial } from "@/contexts/SocialContext";
import { usePlaylist } from "@/contexts/PlaylistContext";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isLoggedIn } = useAuth();
  const { getUserByUsername, isFollowing, followUser, unfollowUser } = useSocial();
  const { playlists, savedPlaylists } = usePlaylist();
  
  const userProfile = username ? getUserByUsername(username) : undefined;
  const isOwnProfile = currentUser?.username?.toLowerCase() === username?.toLowerCase();
  const following = userProfile ? isFollowing(userProfile.id) : false;

  // Mock user playlists (in real app, fetch from API)
  const userPlaylists = isOwnProfile 
    ? playlists 
    : playlists.filter((_, i) => i < 2); // Mock: show some playlists for other users

  const handleFollow = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    
    if (!userProfile) return;
    
    if (following) {
      unfollowUser(userProfile.id);
    } else {
      followUser(userProfile.id);
    }
  };

  const handleMessage = () => {
    console.log("[MESSAGE_USER]", { username, timestamp: new Date().toISOString() });
    // Future: implement messaging
  };

  if (!userProfile && !isOwnProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Users className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">User not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const displayProfile = isOwnProfile 
    ? { 
        id: currentUser?.id || "1",
        username: currentUser?.username || "",
        bio: "Sharing my music taste with the world",
        playlistCount: playlists.length,
        followersCount: 0,
        followingCount: 0,
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
          <button className="p-2 -mr-2 hover:bg-secondary rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-accent">
              {displayProfile.username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="font-semibold">{displayProfile.playlistCount}</div>
                <div className="text-xs text-muted-foreground">playlists</div>
              </div>
              <button 
                className="text-center hover:opacity-70 transition-opacity"
                onClick={() => console.log("Show followers")}
              >
                <div className="font-semibold">{displayProfile.followersCount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">followers</div>
              </button>
              <button 
                className="text-center hover:opacity-70 transition-opacity"
                onClick={() => console.log("Show following")}
              >
                <div className="font-semibold">{displayProfile.followingCount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">following</div>
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="font-semibold">{displayProfile.username}</h2>
          <p className="text-sm text-muted-foreground mt-1">{displayProfile.bio}</p>
        </div>

        {/* Actions */}
        {!isOwnProfile && (
          <div className="flex gap-3 mb-6">
            <Button 
              variant={following ? "outline" : "accent"}
              className="flex-1"
              onClick={handleFollow}
            >
              {following ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleMessage}>
              Message
            </Button>
          </div>
        )}

        {isOwnProfile && (
          <div className="flex gap-3 mb-6">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/profile")}>
              Edit Profile
            </Button>
            <Button variant="accent" className="flex-1" onClick={() => navigate("/playlist/create")}>
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
        {userPlaylists.length === 0 ? (
          <div className="py-16 text-center">
            <Link2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No playlists yet</p>
          </div>
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
                <p className="text-xs text-muted-foreground">{playlist.songs.length} songs</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
