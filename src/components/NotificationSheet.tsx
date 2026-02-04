import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notificationsAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';

interface Notification {
  _id: string;
  type: 'playlist_like' | 'playlist_save';
  actorId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  playlistId: {
    _id: string;
    title: string;
    coverImage?: string;
    coverGradient?: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface NotificationSheetProps {
  unreadCount: number;
  onUnreadCountChange: (count: number) => void;
}

const NotificationSheet = ({ unreadCount, onUnreadCountChange }: NotificationSheetProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsAPI.getNotifications({ limit: 50 });
      setNotifications(data.notifications || []);
      onUnreadCountChange(data.unreadCount || 0);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      const isAuthError = error?.message?.includes('401') || error?.message?.includes('Invalid token');
      setError(isAuthError ? 'Session expired. Please log in again.' : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      onUnreadCountChange(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await notificationsAPI.markAsRead(notification._id);
        setNotifications(prev =>
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
        onUnreadCountChange(Math.max(0, unreadCount - 1));
      }
      setOpen(false);
      navigate(`/playlist/${notification.playlistId._id}`);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'playlist_like':
        return 'liked your playlist';
      case 'playlist_save':
        return 'saved your playlist';
      default:
        return 'interacted with your playlist';
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-[1.5rem] transition-all duration-300 active:scale-95 hover:bg-foreground/5 flex-shrink-0">
          <div className="relative">
            <Bell className={`w-5 h-5 transition-all duration-300 ${ unreadCount > 0 ? 'text-primary animate-in zoom-in-50 duration-200' : 'text-muted-foreground' }`} 
              strokeWidth={unreadCount > 0 ? 2.5 : 2}
              fill={unreadCount > 0 ? "currentColor" : "none"}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium transition-all duration-300 whitespace-nowrap ${unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Alerts
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-destructive mb-3">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadNotifications}
              >
                Retry
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors ${
                    !notification.isRead ? 'bg-secondary/30' : ''
                  }`}
                >
                  <UserAvatar
                    avatarUrl={notification.actorId.avatarUrl}
                    size={40}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification.actorId.username}
                      </span>{' '}
                      {getNotificationText(notification)}{' '}
                      <span className="font-semibold">
                        "{notification.playlistId.title}"
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;
