import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CreatePlaylist from "./CreatePlaylist";
import { usePlaylist } from "@/contexts/PlaylistContext";
import { fetchFeedPlaylists } from "@/store/slices/playlistSlice";
import { useAppDispatch } from "@/store/hooks";
import { playlistsAPI } from "@/lib/api";
import { toast } from "sonner";

const EditPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, updatePlaylist, addSongToPlaylist, deletePlaylist } = usePlaylist();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [playlist, setPlaylist] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return navigate('/profile');

    const fetchPlaylist = async () => {
      setIsLoading(true);
      try {
        const data = await getPlaylist(id);
        setPlaylist(data);
      } catch (err) {
        console.error('Failed to load playlist:', err);
        toast.error('Failed to load playlist');
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, navigate, getPlaylist]);

  const handleSubmit = async (payload: any) => {
    if (!id) return;
    try {
      await updatePlaylist(id, {
        title: payload.title,
        description: payload.description,
        coverGradient: payload.coverGradient,
        tags: payload.tags,
      });

      // add new songs (those without an id)
      const newSongs = (payload.songs || []).filter((s: any) => !s.id);
      for (const song of newSongs) {
        await addSongToPlaylist(id, {
          title: song.title,
          artist: song.artist,
          url: song.url,
          platform: song.platform,
        });
      }

      // upload thumbnail if provided
      if (payload.thumbnailFile) {
        try {
          await playlistsAPI.uploadPlaylistThumbnail(id, payload.thumbnailFile);
        } catch (err) {
          console.error('Thumbnail upload failed:', err);
          toast.error('Playlist saved but thumbnail upload failed');
        }
      }

      // remove thumbnail if requested
      if (payload.removeThumbnail && playlist?.thumbnailUrl) {
        try {
          await playlistsAPI.removePlaylistThumbnail(id);
        } catch (err) {
          console.error('Thumbnail removal failed:', err);
          toast.error('Playlist saved but thumbnail removal failed');
        }
      }

      toast.success('Playlist saved');
      dispatch(fetchFeedPlaylists({ limit: 10, page: 1 }));
      navigate(`/playlist/${id}`);
    } catch (err) {
      console.error('Failed to save playlist:', err);
      toast.error('Failed to save playlist');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted');
      navigate('/profile');
    } catch (err) {
      console.error('Failed to delete playlist:', err);
      toast.error('Failed to delete playlist');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CreatePlaylist
        initialData={{
          id: playlist.id,
          title: playlist.title,
          description: playlist.description,
          coverGradient: playlist.coverGradient,
          tags: playlist.tags || [],
          songs: playlist.songs || [],
          thumbnailUrl: playlist.thumbnailUrl || null,
        }}
        onSubmit={handleSubmit}
      />

      {/* Delete action placed below the form so user can delete here as well */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        <div className="pt-6 border-t border-border">
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-destructive text-destructive-foreground rounded-lg"
          >
            Delete Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylist;

 