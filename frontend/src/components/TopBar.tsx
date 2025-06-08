'use client';

import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  Stack
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { SiDiscord } from 'react-icons/si';
import WoWLogo from './WoWLogo';

interface TopBarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function TopBar({ isSidebarOpen, onSidebarToggle }: TopBarProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isLoggedIn = false; // Replace with actual auth state

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    // Implement sign in logic
    console.log('Sign in clicked');
  };

  const handleSignOut = () => {
    // Implement sign out logic
    console.log('Sign out clicked');
    handleClose();
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left section - Menu and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={onSidebarToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>
            <WoWLogo />
          </Box>
        </Box>

        {/* Center section - Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          MopMeta.io
        </Typography>

        {/* Right section - Social Links and Auth */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={() => handleSocialClick('https://discord.gg/lumberforged')}
              size="small"
              sx={{ color: '#5865F2' }}
            >
              <SiDiscord size={24} />
            </IconButton>
            <IconButton 
              onClick={() => handleSocialClick('https://twitter.com/lumberforged')}
              size="small"
              sx={{ color: '#1DA1F2' }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton 
              onClick={() => handleSocialClick('https://github.com/lumberforged')}
              size="small"
              sx={{ color: 'text.primary' }}
            >
              <GitHubIcon />
            </IconButton>
          </Stack>

          {isLoggedIn ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My Account</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 