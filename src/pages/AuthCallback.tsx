import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      if (accessToken && refreshToken) {
        // Store tokens
        localStorage.setItem('vibe_token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Refresh user data
        try {
          await refreshUser();
          navigate('/feed');
        } catch (error) {
          console.error('Failed to refresh user after Google login:', error);
          navigate('/signin');
        }
      } else {
        // No tokens, redirect to sign in
        navigate('/signin');
      }
    };

    handleCallback();
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;