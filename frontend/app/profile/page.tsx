'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import {
  SportsEsports as GameIcon,
  EmojiEvents as AchievementIcon,
  MilitaryTech as PvPIcon,
  Inventory as EquipmentIcon,
  Group as GuildIcon,
  Timeline as StatsIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Chat as DiscordIcon,
  LiveTv as TwitchIcon,
  Share as TwitterIcon,
  VideoLibrary as YouTubeIcon,
  PhotoCamera as InstagramIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Profile() {
  const { isAuthenticated, profile, accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState<'retail' | 'classic'>('retail');
  const [accountData, setAccountData] = useState<any>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [settingMain, setSettingMain] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const [editSocialLinks, setEditSocialLinks] = useState(false);
  const [socialForm, setSocialForm] = useState({
    discord: '',
    twitch: '',
    twitter: '',
    youtube: '',
    instagram: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get the main character from our database
        const mainCharResponse = await fetch('http://localhost:8000/api/character/main', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        let mainChar = null;
        if (mainCharResponse.ok) {
          const mainCharData = await mainCharResponse.json();
          if (mainCharData.realm && mainCharData.name) {
            mainChar = {
              realm: { slug: mainCharData.realm },
              name: mainCharData.name
            };
          }
        }

        // Then get the account profile
        const response = await fetch('http://localhost:8000/api/account/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }

        const data = await response.json();
        setAccountData(data);

        // Get characters for the current game version
        const characters = gameVersion === 'retail' ? data.retail?.wow_accounts?.[0]?.characters : data.classic?.wow_accounts?.[0]?.characters;
        
        if (characters && characters.length > 0) {
          // Filter characters above level 70
          const highLevelChars = characters.filter((char: any) => char.level >= 70);
          
          if (highLevelChars.length > 0) {
            // If we have a main character from our database, use it
            let selectedChar;
            if (mainChar) {
              selectedChar = highLevelChars.find(
                (char: any) => 
                  char.realm.slug.toLowerCase() === mainChar.realm.slug.toLowerCase() && 
                  char.name.toLowerCase() === mainChar.name.toLowerCase()
              );
            }
            
            // If main character not found or not set, use the highest level character
            if (!selectedChar) {
              selectedChar = highLevelChars[0];
            }

            setSelectedCharacter(`${selectedChar.realm.slug}-${selectedChar.name}`);
            fetchCharacterData(selectedChar.realm.slug, selectedChar.name);
          } else {
            setError('No characters found above level 70');
          }
        } else {
          setError('No characters found');
        }

        // Fetch social links
        const socialResponse = await fetch(`http://localhost:8000/api/social-links/${profile?.battletag}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          if (socialData.discord || socialData.twitch || socialData.twitter || socialData.youtube || socialData.instagram) {
            setSocialLinks(socialData);
            setSocialForm(socialData);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isAuthenticated, router, accessToken, gameVersion, profile?.battletag]);

  const fetchCharacterData = async (realm: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/character', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          realm,
          name,
          game_version: gameVersion
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch character data');
      }

      const data = await response.json();
      setCharacterData(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGameVersionChange = (version: 'retail' | 'classic') => {
    setGameVersion(version);
  };

  const handleCharacterChange = (event: any) => {
    const [realm, name] = event.target.value.split('-');
    setSelectedCharacter(event.target.value);
    fetchCharacterData(realm, name);
  };

  const handleSetMainCharacter = async () => {
    try {
      setSettingMain(true);
      const [realm, name] = selectedCharacter.split('-');
      
      const response = await fetch('http://localhost:8000/api/character/set-main', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          realm,
          name,
          game_version: gameVersion
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set main character');
      }

      // Refresh the page to update the character list
      window.location.reload();
    } catch (err) {
      console.error('Error setting main character:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while setting main character');
    } finally {
      setSettingMain(false);
    }
  };

  const handleSocialFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSocialForm({
      ...socialForm,
      [event.target.name]: event.target.value
    });
  };

  const handleSaveSocialLinks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/social-links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(socialForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update social links');
      }

      setSocialLinks(socialForm);
      setEditSocialLinks(false);
    } catch (err) {
      console.error('Error updating social links:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating social links');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={characterData?.profile?.character?.media?.avatar_url}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {characterData?.profile?.character?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {characterData?.profile?.character?.realm?.name} - Level {characterData?.profile?.character?.level}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant={gameVersion === 'retail' ? 'contained' : 'outlined'}
                onClick={() => handleGameVersionChange('retail')}
                size="small"
              >
                Retail
              </Button>
              <Button
                variant={gameVersion === 'classic' ? 'contained' : 'outlined'}
                onClick={() => handleGameVersionChange('classic')}
                size="small"
              >
                Classic
              </Button>
            </Stack>
          </Grid>
          <Grid item>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Character</InputLabel>
              <Select
                value={selectedCharacter}
                onChange={handleCharacterChange}
                label="Select Character"
              >
                {accountData?.[gameVersion]?.wow_accounts?.[0]?.characters
                  ?.filter((char: any) => char.level >= 70)
                  .map((char: any) => (
                    <MenuItem 
                      key={`${char.realm.slug}-${char.name}`} 
                      value={`${char.realm.slug}-${char.name}`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography>
                          {char.name} ({char.realm.name})
                        </Typography>
                        {char.is_main && (
                          <StarIcon color="primary" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Tooltip title="Set as main character">
              <IconButton 
                onClick={handleSetMainCharacter}
                disabled={settingMain}
                sx={{ ml: 1 }}
              >
                <StarIcon color={characterData?.profile?.character?.is_main ? "primary" : "action"} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditSocialLinks(true)}
              >
                Edit Social Links
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Social Links Dialog */}
      <Dialog open={editSocialLinks} onClose={() => setEditSocialLinks(false)}>
        <DialogTitle>Edit Social Links</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              name="discord"
              label="Discord Username"
              value={socialForm.discord}
              onChange={handleSocialFormChange}
              fullWidth
            />
            <TextField
              name="twitch"
              label="Twitch Channel"
              value={socialForm.twitch}
              onChange={handleSocialFormChange}
              fullWidth
            />
            <TextField
              name="twitter"
              label="Twitter Handle"
              value={socialForm.twitter}
              onChange={handleSocialFormChange}
              fullWidth
            />
            <TextField
              name="youtube"
              label="YouTube Channel"
              value={socialForm.youtube}
              onChange={handleSocialFormChange}
              fullWidth
            />
            <TextField
              name="instagram"
              label="Instagram Handle"
              value={socialForm.instagram}
              onChange={handleSocialFormChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSocialLinks(false)}>Cancel</Button>
          <Button onClick={handleSaveSocialLinks} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Social Links Display */}
      {socialLinks && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Social Links
          </Typography>
          <Stack direction="row" spacing={2}>
            {socialLinks.discord && (
              <Link
                href={`https://discord.com/users/${socialLinks.discord}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Chip
                  icon={<DiscordIcon />}
                  label={socialLinks.discord}
                  clickable
                />
              </Link>
            )}
            {socialLinks.twitch && (
              <Link
                href={`https://twitch.tv/${socialLinks.twitch}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Chip
                  icon={<TwitchIcon />}
                  label={socialLinks.twitch}
                  clickable
                />
              </Link>
            )}
            {socialLinks.twitter && (
              <Link
                href={`https://twitter.com/${socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Chip
                  icon={<TwitterIcon />}
                  label={socialLinks.twitter}
                  clickable
                />
              </Link>
            )}
            {socialLinks.youtube && (
              <Link
                href={`https://youtube.com/${socialLinks.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Chip
                  icon={<YouTubeIcon />}
                  label={socialLinks.youtube}
                  clickable
                />
              </Link>
            )}
            {socialLinks.instagram && (
              <Link
                href={`https://instagram.com/${socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Chip
                  icon={<InstagramIcon />}
                  label={socialLinks.instagram}
                  clickable
                />
              </Link>
            )}
          </Stack>
        </Paper>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab icon={<GameIcon />} label="Overview" />
          <Tab icon={<EquipmentIcon />} label="Equipment" />
          <Tab icon={<PvPIcon />} label="PvP" />
          <Tab icon={<AchievementIcon />} label="Achievements" />
          <Tab icon={<StatsIcon />} label="Statistics" />
          <Tab icon={<GuildIcon />} label="Guild" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Character Info
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Race"
                      secondary={characterData?.profile?.character?.race?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Class"
                      secondary={characterData?.profile?.character?.character_class?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Faction"
                      secondary={characterData?.profile?.character?.faction?.name}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  PvP Stats
                </Typography>
                {characterData?.pvp ? (
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="2v2 Rating"
                        secondary={characterData.pvp.brackets?.['2v2']?.rating || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="3v3 Rating"
                        secondary={characterData.pvp.brackets?.['3v3']?.rating || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="RBG Rating"
                        secondary={characterData.pvp.brackets?.['rbg']?.rating || 'N/A'}
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Typography color="text.secondary">No PvP data available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          {characterData?.equipment?.equipped_items?.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} key={item.slot.type}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.slot.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.name}
                  </Typography>
                  {item.level?.value && (
                    <Chip
                      size="small"
                      label={`Item Level ${item.level.value}`}
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  PvP Statistics
                </Typography>
                {characterData?.pvp ? (
                  <Grid container spacing={2}>
                    {Object.entries(characterData.pvp.brackets || {}).map(([bracket, data]: [string, any]) => (
                      <Grid item xs={12} sm={6} md={4} key={bracket}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {bracket.toUpperCase()}
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText
                                primary="Rating"
                                secondary={data.rating || 'N/A'}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Won"
                                secondary={data.season_match_statistics?.won || 'N/A'}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Lost"
                                secondary={data.season_match_statistics?.lost || 'N/A'}
                              />
                            </ListItem>
                          </List>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">No PvP data available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Achievements
        </Typography>
        <Typography color="text.secondary">
          Achievement data will be available soon
        </Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        <Typography color="text.secondary">
          Character statistics will be available soon
        </Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Typography variant="h6" gutterBottom>
          Guild Information
        </Typography>
        <Typography color="text.secondary">
          Guild data will be available soon
        </Typography>
      </TabPanel>
    </Container>
  );
} 