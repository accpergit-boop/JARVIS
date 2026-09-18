import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // CRITICAL: Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.error('No session_id found in URL');
          navigate('/');
          return;
        }

        // Exchange session_id for session_token
        const response = await axios.post(
          `${API}/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        const { session_token, user } = response.data;

        // Set cookie
        document.cookie = `session_token=${session_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;

        // Update auth context
        setUser(user);

        // Clean URL and redirect to account
        window.history.replaceState(null, '', '/account');
        navigate('/account', { state: { user }, replace: true });
      } catch (error) {
        console.error('Auth callback failed:', error);
        navigate('/');
      }
    };

    processSession();
  }, [location.hash, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bone">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-muted">Completing sign in...</p>
      </div>
    </div>
  );
}