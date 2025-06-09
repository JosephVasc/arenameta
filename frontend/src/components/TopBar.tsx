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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  CircularProgress,
  ButtonGroup,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { SiDiscord } from 'react-icons/si';
import WoWLogo from './WoWLogo';
import { useAuth } from '../contexts/AuthContext';
import { useGameVersion } from '@/contexts/GameVersionContext';
import { useRegion } from '@/contexts/RegionContext';
import 'flag-icons/css/flag-icons.min.css';

interface TopBarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

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

const experienceLevels = [
  'Beginner (0-1000 rating)',
  'Intermediate (1000-2000 rating)',
  'Advanced (2000-2400 rating)',
  'Elite (2400+ rating)'
];

const steps = ['Battle.net Login', 'Character Info', 'Experience'];

export default function TopBar({ isSidebarOpen, onSidebarToggle }: TopBarProps) {
  const router = useRouter();
  const auth = useAuth();
  const { gameVersion, setGameVersion } = useGameVersion();
  const { region, setRegion } = useRegion();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    characterClass: '',
    experience: '',
    mainSpec: '',
    currentRating: '',
    yearsOfExperience: ''
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRegionChange = (newRegion: 'us' | 'eu') => {
    setRegion(newRegion);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    auth.login();
  };

  const handleSignOut = () => {
    auth.logout();
    handleClose();
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleBattleNetLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Battle.net OAuth flow
      // For now, just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveStep(1);
    } catch (error) {
      console.error('Battle.net login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSignupOpen(false);
      setActiveStep(0);
      setFormData({
        characterClass: '',
        experience: '',
        mainSpec: '',
        currentRating: '',
        yearsOfExperience: ''
      });
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Connect with Battle.net
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Sign in with your Battle.net account to get started
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBattleNetLogin}
              disabled={isLoading}
              sx={{
                backgroundColor: '#00A2FF',
                '&:hover': {
                  backgroundColor: '#0080CC',
                },
                minWidth: 200,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Connect with Battle.net'
              )}
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Character Class</InputLabel>
              <Select
                value={formData.characterClass}
                onChange={handleInputChange('characterClass')}
                label="Character Class"
              >
                {classes.map((className) => (
                  <MuiMenuItem key={className} value={className}>
                    {className}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Main Specialization</InputLabel>
              <Select
                value={formData.mainSpec}
                onChange={handleInputChange('mainSpec')}
                label="Main Specialization"
              >
                <MuiMenuItem value="DPS">DPS</MuiMenuItem>
                <MuiMenuItem value="Healer">Healer</MuiMenuItem>
                <MuiMenuItem value="Tank">Tank</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Current Rating"
              type="number"
              value={formData.currentRating}
              onChange={handleInputChange('currentRating')}
              sx={{ mb: 3 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={formData.experience}
                onChange={handleInputChange('experience')}
                label="Experience Level"
              >
                {experienceLevels.map((level) => (
                  <MuiMenuItem key={level} value={level}>
                    {level}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Years of Experience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleInputChange('yearsOfExperience')}
              sx={{ mb: 3 }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 2,
                backgroundColor: 'background.paper',
                padding: '4px 12px',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                fontSize: '0.875rem',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body2">
                <strong>1,234</strong> players online
              </Typography>
            </Box>
            {/* Game Version Selector */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 2,
                backgroundColor: 'background.paper',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <ButtonGroup size="small" variant="contained" color="primary">
                <Button
                  onClick={() => setGameVersion('retail')}
                  variant={gameVersion === 'retail' ? 'contained' : 'outlined'}
                  sx={{ 
                    minWidth: '80px',
                    backgroundColor: gameVersion === 'retail' ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: gameVersion === 'retail' ? 'primary.dark' : 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Retail
                </Button>
                <Button
                  onClick={() => setGameVersion('classic')}
                  variant={gameVersion === 'classic' ? 'contained' : 'outlined'}
                  sx={{ 
                    minWidth: '80px',
                    backgroundColor: gameVersion === 'classic' ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: gameVersion === 'classic' ? 'primary.dark' : 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Classic
                </Button>
              </ButtonGroup>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 2,
                backgroundColor: 'background.paper',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <ButtonGroup size="small" variant="contained" color="primary">
                <Button
                  onClick={() => handleRegionChange('us')}
                  variant={region === 'us' ? 'contained' : 'outlined'}
                  sx={{ 
                    minWidth: '60px',
                    backgroundColor: region === 'us' ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: region === 'us' ? 'primary.dark' : 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <span className="fi fi-us" style={{ marginRight: '4px' }}></span>
                  US
                </Button>
                <Button
                  onClick={() => handleRegionChange('eu')}
                  variant={region === 'eu' ? 'contained' : 'outlined'}
                  sx={{ 
                    minWidth: '60px',
                    backgroundColor: region === 'eu' ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: region === 'eu' ? 'primary.dark' : 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <span className="fi fi-eu" style={{ marginRight: '4px' }}></span>
                  EU
                </Button>
              </ButtonGroup>
            </Box>
          </Box>

          {/* Right section - Social Links and Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => handleSocialClick('https://github.com/your-repo')}
                sx={{ color: 'text.secondary' }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                onClick={() => handleSocialClick('https://twitter.com/your-handle')}
                sx={{ color: 'text.secondary' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                onClick={() => handleSocialClick('https://discord.gg/your-server')}
                sx={{ color: 'text.secondary' }}
              >
                <SiDiscord />
              </IconButton>
            </Stack>

            {auth?.isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    cursor: 'pointer'
                  }}
                  onClick={handleMenu}
                >
                  {auth.profile?.battletag?.[0] || 'U'}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {
                    router.push('/profile');
                    handleClose();
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSignIn}
                sx={{
                  backgroundColor: '#00A2FF',
                  '&:hover': {
                    backgroundColor: '#0080CC',
                  },
                }}
              >
                Sign In with Battle.net
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Signup Modal */}
      <Dialog 
        open={isSignupOpen} 
        onClose={() => !isLoading && setIsSignupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>
        <DialogContent>
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={isLoading || (activeStep === 1 && !formData.characterClass)}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleFormSubmit}
              disabled={isLoading || !formData.experience}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Complete'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
} 