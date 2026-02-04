import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsAPI } from '@/lib/api';

const POLLING_INTERVAL = 30000; // 30 seconds

export const useNotificationPolling = (isAuthenticated: boolean) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasErroredRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || hasErroredRef.current) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
      setError(null);
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
      
      hasErroredRef.current = true; // Mark that an error occurred
      stopPolling(); // Stop polling immediately on any error
      
      // Check if it's an auth error (401)
      const isAuthError = error?.message?.includes('401') || error?.message?.includes('Invalid token');
      setError(isAuthError ? 'Session expired' : 'Failed to load notifications');
    }
  }, [isAuthenticated, stopPolling]);

  const startPolling = useCallback(() => {
    if (!isAuthenticated || isPolling || hasErroredRef.current) return;

    setIsPolling(true);
    
    // Fetch immediately
    fetchUnreadCount();

    // Then poll at intervals
    intervalRef.current = setInterval(fetchUnreadCount, POLLING_INTERVAL);
  }, [isAuthenticated, isPolling, fetchUnreadCount]);

  // Start/stop polling based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      hasErroredRef.current = false; // Reset error flag on auth change
      startPolling();
    } else {
      stopPolling();
      setUnreadCount(0);
      setError(null);
      hasErroredRef.current = false;
    }

    return () => {
      stopPolling();
    };
  }, [isAuthenticated, startPolling, stopPolling]);

  // Poll when page becomes visible again (only if not errored)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && !hasErroredRef.current) {
        fetchUnreadCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    unreadCount,
    setUnreadCount,
    refreshUnreadCount: fetchUnreadCount,
    error,
    clearError: () => setError(null),
  };
};
