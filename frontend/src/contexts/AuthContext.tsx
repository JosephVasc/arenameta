'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BattleNetProfile {
  id: number;
  battletag: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  profile: BattleNetProfile | null;
  login: () => void;
  logout: () => void;
  handleCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<BattleNetProfile | null>(null);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('battlenet_token');
    const storedProfile = localStorage.getItem('battlenet_profile');
    if (token && storedProfile) {
      setAccessToken(token);
      setProfile(JSON.parse(storedProfile));
      setIsAuthenticated(true);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');

    if (code && state && storedState && state === storedState) {
      handleCallback(code, state);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = async () => {
    try {
      // Generate a random state parameter
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('oauth_state', state);

      // Get the OAuth URL from the backend
      const response = await fetch('http://localhost:8000/api/auth/battlenet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });

      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleCallback = async (code: string, state: string) => {
    try {
      console.log('Handling callback with code:', code);
      const response = await fetch('http://localhost:8000/api/auth/battlenet/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Authentication failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Authentication successful:', data);
      
      setAccessToken(data.access_token);
      setProfile(data.profile);
      setIsAuthenticated(true);

      // Store in localStorage
      localStorage.setItem('battlenet_token', data.access_token);
      localStorage.setItem('battlenet_profile', JSON.stringify(data.profile));
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('battlenet_token');
    localStorage.removeItem('battlenet_profile');
    localStorage.removeItem('oauth_state');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, profile, login, logout, handleCallback }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 