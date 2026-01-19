/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MoreHorizontal, Bookmark, ExternalLink, Edit, Link2 } from "lucide-react";
import { Button, Spin, Typography, Tag, App, Dropdown } from "antd";
import { usePlaylist, SongLink } from "@/contexts/PlaylistContext";
import { useAppSelector } from "@/store/hooks";
import { getPlatformColor, getPlatformIcon } from "@/lib/songUtils";

const { Title, Text, Paragraph } = Typography;

const ViewPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, savePlaylist, unsavePlaylist, savedPlaylists } = usePlaylist();
  const { user } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const { message } = App.useApp();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = savedPlaylists.some(p => p.id === id);
  const isOwn = playlist?.user?._id === user?.id;

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (id) {
        try {
          const fetchedPlaylist = await getPlaylist(id);
          setPlaylist(fetchedPlaylist);
        } catch (error) {
          console.error('Failed to fetch playlist:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPlaylist();
  }, [id, getPlaylist]);

  const handleOpenLink = (song: SongLink, index: number) => {
    window.open(song.url, "_blank", "noopener,noreferrer");
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }
    setIsLiked(!isLiked);
    message.success(isLiked ? "Removed like" : "Liked!");
  };

  const handleSave = () => {
    if (!playlist || !playlist.id) return;
    
    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }
    
    if (isSaved) {
      unsavePlaylist(playlist.id);
      message.success("Removed from saved");
    } else {
      savePlaylist(playlist.id);
      message.success("Saved to collection");
    }
  };

  const handleShare = () => {
    if (!playlist) return;
    
    const shareUrl = `${window.location.origin}/playlist/${id}`;
    
    if (navigator.share) {
      navigator.share({ title: playlist.title, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      message.success("Link copied to clipboard");
    }
  };

  const handleEdit = () => {
    navigate(`/playlist/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Link2 className="w-16 h-16 text-muted-foreground" />
        <Text type="secondary">Playlist not found</Text>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const menuItems = [
    { key: 'report', label: 'Report' },
    { key: 'copyLink', label: 'Copy Link' },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <Button type="text" onClick={() => navigate(-1)} icon={<ArrowLeft className="w-5 h-5" />} />
          <Text strong>Playlist</Text>
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" icon={<MoreHorizontal className="w-5 h-5" />} />
          </Dropdown>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Cover */}
          <div className={`w-full md:w-48 aspect-square rounded-xl bg-gradient-to-br ${playlist.coverGradient} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {playlist.songs[0]?.thumbnail ? (
              <img src={playlist.songs[0].thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
            ) : (
              <Link2 className="w-16 h-16 text-white/30" />
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <Text type="secondary" className="text-sm">Playlist</Text>
            <Title level={3} className="!mb-2">{playlist.title}</Title>
            <Paragraph type="secondary" className="!mb-3">
              {playlist.description || "A curated collection of song links"}
            </Paragraph>

            {playlist.tags && playlist.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {playlist.tags.map((tag: string) => (
                  <Tag key={tag} color="purple">#{tag}</Tag>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm mb-6">
              <Text type="secondary">{playlist.songs.length} songs</Text>
              <Text type="secondary">•</Text>
              <Text type="secondary">{playlist.likesCount?.toLocaleString() || 0} likes</Text>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {isOwn && (
                <Button type="primary" onClick={handleEdit} icon={<Edit className="w-4 h-4" />} className="btn-gradient !border-0">
                  Edit
                </Button>
              )}
              <Button 
                shape="circle"
                onClick={handleLike}
                className={isLiked ? "!text-red-500 !border-red-500/50" : ""}
                icon={<Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />}
              />
              {!isOwn && (
                <Button 
                  shape="circle"
                  onClick={handleSave}
                  icon={<Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />}
                />
              )}
              <Button shape="circle" onClick={handleShare} icon={<Share2 className="w-4 h-4" />} />
            </div>
          </div>
        </div>

        {/* Songs Grid - Masonry Layout */}
        {playlist.songs.length === 0 ? (
          <div className="py-16 text-center">
            <Link2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <Text type="secondary">No songs in this playlist yet</Text>
            {isOwn && (
              <Button className="mt-4" onClick={handleEdit}>
                Add Songs
              </Button>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {playlist.songs.map((song: SongLink, index: number) => (
              <div 
                key={song.id}
                onClick={() => handleOpenLink(song, index)}
                className="break-inside-avoid p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-card border border-border hover:border-primary/30"
              >
                {song.thumbnail ? (
                  <img 
                    src={song.thumbnail} 
                    alt={song.title}
                    className="w-full aspect-square rounded-lg object-cover mb-3"
                  />
                ) : (
                  <div className={`w-full aspect-square rounded-lg flex items-center justify-center mb-3 ${getPlatformColor(song.platform)}`}>
                    <span className="text-4xl">{getPlatformIcon(song.platform)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <Tag className="!text-xs"># {index + 1}</Tag>
                  <Tag color="purple" className="!text-xs">{song.platform}</Tag>
                </div>

                <Text strong className="text-sm block mb-1 group-hover:text-primary transition-colors">{song.title}</Text>
                <Text type="secondary" className="text-xs block mb-3">{song.artist}</Text>

                <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Link</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlaylist;