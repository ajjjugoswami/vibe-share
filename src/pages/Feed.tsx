import { useState } from "react";
import FeedPage from "@/components/FeedPage";
import AuthModal from "@/components/AuthModal";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";

const Feed = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleShareClick = () => {
    console.log("[SHARE_CLICK]", {
      isLoggedIn,
      timestamp: new Date().toISOString()
    });

    if (!isLoggedIn) {
      setShowAuth(true);
    } else {
      setShowCreatePlaylist(true);
    }
  };

  const handleLogin = () => {
    console.log("[USER_AUTHENTICATED]", {
      timestamp: new Date().toISOString()
    });
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleCreatePlaylist = (playlist: { title: string; description: string; songs: { id: string; title: string; artist: string }[] }) => {
    console.log("[PLAYLIST_SAVED]", {
      playlist,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      <FeedPage onShareClick={handleShareClick} isLoggedIn={isLoggedIn} />
      
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLogin={handleLogin} 
        />
      )}
      
      {showCreatePlaylist && (
        <CreatePlaylistModal
          onClose={() => setShowCreatePlaylist(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </>
  );
};

export default Feed;
