'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthCallback() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');

    if (code && state && storedState && state === storedState) {
      auth.handleCallback(code, state)
        .then(() => {
          router.push('/'); // Redirect to home page after successful authentication
        })
        .catch((error) => {
          console.error('Authentication failed:', error);
          router.push('/'); // Redirect to home page even if there's an error
        });
    } else {
      router.push('/'); // Redirect to home page if no code or state mismatch
    }
  }, [router, auth]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="h6" color="text.secondary">
        Authenticating with Battle.net...
      </Typography>
    </Box>
  );
} 