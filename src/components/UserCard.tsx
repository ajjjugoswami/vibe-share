import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/contexts/SocialContext";

interface UserCardProps {
  user: UserProfile;
  showFollowButton?: boolean;
}

const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();

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
          {user.playlistCount} playlists
        </p>
      </div>
    </div>
  );
};

export default UserCard;