'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/theme';
import { AuthProvider } from '../src/contexts/AuthContext';
import { GameVersionProvider } from '@/contexts/GameVersionContext';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { Box } from '@mui/material';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import { RegionProvider } from '@/contexts/RegionContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <GameVersionProvider>
              <RegionProvider>
                <Box sx={{ display: 'flex' }}>
                  <TopBar isSidebarOpen={isSidebarOpen} onSidebarToggle={handleSidebarToggle} />
                  <Sidebar open={isSidebarOpen} onClose={handleSidebarToggle} />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      width: { sm: `calc(100% - ${240}px)` },
                      mt: 8,
                    }}
                  >
                    {children}
                  </Box>
                </Box>
              </RegionProvider>
            </GameVersionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 