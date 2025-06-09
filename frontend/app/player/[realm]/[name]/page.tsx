'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGameVersion } from '@/contexts/GameVersionContext';
import { useRegion } from '@/contexts/RegionContext';
import { getCharacterEndpoint } from '@/utils/blizzardApi';
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
  Snackbar,
  Link
} from '@mui/material';
import {
  SportsEsports as GameIcon,
  EmojiEvents as AchievementIcon,
  MilitaryTech as PvPIcon,
  Inventory as EquipmentIcon,
  Group as GuildIcon,
  Timeline as StatsIcon,
} from '@mui/icons-material';
import React from 'react';

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
      id={`player-tabpanel-${index}`}
      aria-labelledby={`player-tab-${index}`}
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

interface Character {
  name: string;
  realm: {
    name: string;
  };
  level: number;
  character_class: {
    name: string;
  };
  active_spec: {
    name: string;
  };
  faction: {
    name: string;
  };
  race: {
    name: string;
  };
}

function CharacterContent({ params }: { params: Promise<{ realm: string; name: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken } = useAuth();
  const { gameVersion } = useGameVersion();
  const { region } = useRegion();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Unwrap params outside of try/catch
  const unwrappedParams = React.use(params);
  const realmSlug = unwrappedParams.realm.toLowerCase();
  const characterName = unwrappedParams.name.toLowerCase();

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!isAuthenticated || !accessToken) {
        router.push('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch detailed character data from our backend
        const response = await fetch(
          `http://localhost:8000/api/character/${region}/${realmSlug}/${characterName}?game_version=${gameVersion}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch character data');
        }

        const data = await response.json();
        setCharacter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && accessToken) {
      fetchCharacterData();
    }
  }, [isAuthenticated, router, accessToken, gameVersion, realmSlug, characterName, region]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!character) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            Character not found
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={character?.profile?.character?.media?.avatar_url}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {character?.profile?.character?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {character?.profile?.character?.realm?.name} - Level {character?.profile?.character?.level}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="player tabs">
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
                      secondary={character?.profile?.character?.race?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Class"
                      secondary={character?.profile?.character?.character_class?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Faction"
                      secondary={character?.profile?.character?.faction?.name}
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
                {character?.pvp ? (
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="2v2 Rating"
                        secondary={character.pvp.brackets?.['2v2']?.rating || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="3v3 Rating"
                        secondary={character.pvp.brackets?.['3v3']?.rating || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="RBG Rating"
                        secondary={character.pvp.brackets?.['rbg']?.rating || 'N/A'}
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
          {character?.equipment?.equipped_items?.map((item: any) => (
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
                {character?.pvp ? (
                  <Grid container spacing={2}>
                    {Object.entries(character.pvp.brackets || {}).map(([bracket, data]: [string, any]) => (
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

      <Snackbar 
        open={error !== null} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default function PlayerPage({ params }: { params: Promise<{ realm: string; name: string }> }) {
  return (
    <Suspense fallback={
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    }>
      <CharacterContent params={params} />
    </Suspense>
  );
} 