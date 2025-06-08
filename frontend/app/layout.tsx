'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { Box } from '@mui/material';
import { useState } from 'react';
import { Inter } from 'next/font/google';

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
          <TopBar isSidebarOpen={isSidebarOpen} onSidebarToggle={handleSidebarToggle} />
          <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              ml: isSidebarOpen ? '280px' : 0,
              transition: theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
} 