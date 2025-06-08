'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  width: isOpen ? 280 : 0,
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  overflowY: 'auto',
  paddingTop: theme.spacing(8), // Space for the header
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
}));

const SocialLinksContainer = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const classes = [
  'Death Knight',
  'Druid',
  'Hunter',
  'Mage',
  'Monk',
  'Paladin',
  'Priest',
  'Rogue',
  'Shaman',
  'Warlock',
  'Warrior'
];

const ladders = [
  { name: '2v2 Arena', path: '/ladder/2v2' },
  { name: '3v3 Arena', path: '/ladder/3v3' }
];

const metaTierLists = [
  { name: '3v3 Tier List', path: '/meta/3v3-tier-list' },
  { name: '2v2 Tier List', path: '/meta/2v2-tier-list' },
  { name: 'Class Tier List', path: '/meta/class-tier-list' }
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Leaderboards', icon: <EmojiEventsIcon />, path: '/leaderboards' },
    { text: 'Guides', icon: <MenuBookIcon />, path: '/guides' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Prefetch all routes on component mount
  useEffect(() => {
    menuItems.forEach(item => {
      router.prefetch(item.path);
    });
  }, [router]);

  const handleNavigation = async (path: string) => {
    setLoadingPath(path);
    try {
      await router.push(path);
    } finally {
      setLoadingPath(null);
      if (isMobile) {
        onClose();
      }
    }
  };

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
    >
      <DrawerHeader />
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(144, 202, 249, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(144, 202, 249, 0.12)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {loadingPath === item.path ? (
                    <CircularProgress size={24} />
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
} 