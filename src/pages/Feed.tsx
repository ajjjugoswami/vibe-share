import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedPage from "@/components/FeedPage";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import { useAuth } from "@/contexts/AuthContext";

const Feed = () => {
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleShareClick = () => {
    console.log("[SHARE_CLICK]", {
      isLoggedIn,
      timestamp: new Date().toISOString()
    });

    if (!isLoggedIn) {
      navigate("/auth");
    } else {
      setShowCreatePlaylist(true);
    }
  };

  return (
    <>
      <FeedPage onShareClick={handleShareClick} isLoggedIn={isLoggedIn} />
      
      {showCreatePlaylist && (
        <CreatePlaylistModal
          onClose={() => setShowCreatePlaylist(false)}
        />
      )}
    </>
  );
};

export default Feed;
