import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSocial, UserProfile } from "@/contexts/SocialContext";

interface UserCardProps {
  user: UserProfile;
  showFollowButton?: boolean;
}

const UserCard = ({ user, showFollowButton = true }: UserCardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, user: currentUser } = useAuth();
  const { isFollowing, followUser, unfollowUser } = useSocial();
  
  const isOwnProfile = currentUser?.id === user.id;
  const following = isFollowing(user.id);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }
    
    if (following) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  const handleClick = () => {
    navigate(`/user/${user.username}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-bold text-accent">
          {user.username.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">@{user.username}</p>
        <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {user.followersCount.toLocaleString()} followers • {user.playlistCount} playlists
        </p>
      </div>

      {/* Follow Button */}
      {showFollowButton && !isOwnProfile && (
        <Button 
          variant={following ? "outline" : "accent"}
          size="sm"
          onClick={handleFollow}
          className="flex-shrink-0"
        >
          {following ? "Following" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default UserCard;
