'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import {
  SportsEsports as GameIcon,
  EmojiEvents as AchievementIcon,
  MilitaryTech as PvPIcon,
  Inventory as EquipmentIcon,
  Group as GuildIcon,
  Timeline as StatsIcon,
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
  const [tabValue, setTabValue] = useState(0);
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState<'retail' | 'classic'>('retail');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchCharacterData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get the account profile to get the character list
        const accountResponse = await fetch('http://localhost:8000/api/account/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!accountResponse.ok) {
          const errorData = await accountResponse.json();
          throw new Error(errorData.detail || 'Failed to fetch account profile');
        }

        const accountData = await accountResponse.json();
        console.log('Account data:', accountData); // Debug log
        
        // Get the first character from the account (you might want to add character selection later)
        const firstCharacter = accountData.retail?.wow_accounts?.[0]?.characters?.[0] || 
                             accountData.classic?.wow_accounts?.[0]?.characters?.[0];
        
        if (!firstCharacter) {
          throw new Error('No characters found on account');
        }

        console.log('Selected character:', firstCharacter); // Debug log

        // Format realm and character name according to API requirements
        const realmSlug = firstCharacter.realm.slug.toLowerCase();
        const characterName = firstCharacter.name.toLowerCase();

        // Now fetch detailed character data
        const response = await fetch('http://localhost:8000/api/character', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            realm: realmSlug,
            name: characterName,
            game_version: gameVersion
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Character fetch error:', errorData); // Debug log
          throw new Error(errorData.detail || 'Failed to fetch character data');
        }

        const data = await response.json();
        console.log('Character data:', data); // Debug log
        setCharacterData(data);
      } catch (err) {
        console.error('Error fetching character data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching character data');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [isAuthenticated, router, accessToken, gameVersion]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGameVersionChange = (version: 'retail' | 'classic') => {
    setGameVersion(version);
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
        </Grid>
      </Paper>

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