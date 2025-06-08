'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Button, 
  Typography, 
  Box, 
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField as MuiTextField,
  Autocomplete,
  styled,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledAutocomplete = styled(Autocomplete<string, false, false, true>)(({ theme }) => ({
  '& .MuiAutocomplete-listbox': {
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.paper,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: '4px',
      '&:hover': {
        background: theme.palette.primary.dark,
      },
    },
  },
  '& .MuiAutocomplete-option': {
    padding: '8px 16px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const US_SERVERS = [
  'Whitemane',
  'Benediction',
  'Faerlina',
  'Grobbulus',
  'Mankrik',
  'Pagle',
  'Westfall',
  'Windseeker',
  'Atiesh',
  'Azuresong',
  'Bloodsail Buccaneers',
  'Deviate Delight',
  'Earthfury',
  'Heartseeker',
  'Incendius',
  'Kirtonos',
  'Kromcrush',
  'Kurinnaxx',
  'Loatheb',
  'Netherwind',
  'Old Blanchy',
  'Rattlegore',
  'Remulos',
  'Skeram',
  'Smolderweb',
  'Stalagg',
  'Sulfuras',
  'Thalnos',
  'Thunderfury',
  'Yojamba'
];

const EU_SERVERS = [
  'Firemaw',
  'Gehennas',
  'Mograine',
  'Pyrewood Village',
  'Razorgore',
  'Shazzrah',
  'Venoxis',
  'Zandalar Tribe',
  'Ashbringer',
  'Auberdine',
  'Bloodfang',
  'Dragonfang',
  'Earthshaker',
  'Everlook',
  'Finkle',
  'Flamegor',
  'Gandling',
  'Golemagg',
  'Hydraxian Waterlords',
  'Judgement',
  'Lakeshire',
  'Mandokir',
  'Nethergarde Keep',
  'Noggenfogger',
  'Patchwerk',
  'Razorfen',
  'Skullflame',
  'Stonespine',
  'Ten Storms',
  'Transcendence'
];

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

interface LeaderboardEntry {
  character: {
    id: number;
    name: string;
    realm: {
      name: string;
    };
  };
  rating: number;
  faction: {
    type: string;
  };
}

interface Leaderboard {
  entries: LeaderboardEntry[];
}

export default function Home() {
  const [realm, setRealm] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState<'2v2' | '3v3'>('3v3');
  const [region, setRegion] = useState<'US' | 'EU'>('US');
  const [realmOptions, setRealmOptions] = useState<string[]>(US_SERVERS);
  const [nameOptions, setNameOptions] = useState<string[]>([]);

  // Function to determine region based on country code
  const getRegionFromCountry = (countryCode: string): 'US' | 'EU' => {
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
      'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
      'GB', 'UK'
    ];
    return euCountries.includes(countryCode.toUpperCase()) ? 'EU' : 'US';
  };

  // Function to detect user's location
  const detectUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const detectedRegion = getRegionFromCountry(data.country_code);
      setRegion(detectedRegion);
      setRealmOptions(detectedRegion === 'US' ? US_SERVERS : EU_SERVERS);
    } catch (error) {
      console.error('Error detecting location:', error);
      // Fallback to US if location detection fails
      setRegion('US');
      setRealmOptions(US_SERVERS);
    }
  };

  useEffect(() => {
    detectUserLocation();
  }, []);

  useEffect(() => {
    setRealmOptions(region === 'US' ? US_SERVERS : EU_SERVERS);
    fetchLeaderboard();
  }, [selectedBracket, region]);

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/pvp-leaderboard/${selectedBracket}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!realm || !name) {
      setError('Please enter both realm and character name');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/api/character/${realm}/${name}`);
      if (!response.ok) {
        throw new Error('Character not found');
      }
      const data = await response.json();
      setCharacter(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      setShowError(true);
      setCharacter(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        width: '100%',
        maxWidth: '1400px !important',
        margin: '0 auto',
        padding: '0 24px',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={region}
              exclusive
              onChange={(event, newRegion) => {
                if (newRegion !== null) {
                  setRegion(newRegion);
                  setRealm(''); // Clear realm when changing region
                }
              }}
              aria-label="region selection"
              size="small"
            >
              <ToggleButton value="US" aria-label="US region">
                US
              </ToggleButton>
              <ToggleButton value="EU" aria-label="EU region">
                EU
              </ToggleButton>
            </ToggleButtonGroup>
            <StyledAutocomplete
              freeSolo
              options={realmOptions}
              value={realm}
              onChange={(event: any, value: string | null) => setRealm(value || '')}
              onInputChange={(event, newValue) => setRealm(newValue)}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  size="small"
                  placeholder="Realm"
                  sx={{ width: 200 }}
                />
              )}
            />
            <StyledAutocomplete
              freeSolo
              options={nameOptions}
              value={name}
              onChange={(event: any, value: string | null) => setName(value || '')}
              onInputChange={(event, newValue) => setName(newValue)}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  size="small"
                  placeholder="Character Name"
                  sx={{ width: 200 }}
                />
              )}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              size="small"
            >
              Search
            </Button>
          </Box>
        </Paper>

        {character && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {character.name} - {character.realm.name}
            </Typography>
            <Grid container spacing={2}>
              <Grid columns={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1">
                  Level {character.level} {character.character_class.name}
                </Typography>
                <Typography variant="subtitle1">
                  {character.active_spec.name}
                </Typography>
              </Grid>
              <Grid columns={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1">
                  Faction: {character.faction.name}
                </Typography>
                <Typography variant="subtitle1">
                  Race: {character.race.name}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">
              PvP Leaderboard
            </Typography>
            <ToggleButtonGroup
              value={selectedBracket}
              exclusive
              onChange={(event, newBracket) => {
                if (newBracket !== null) {
                  setSelectedBracket(newBracket);
                }
              }}
              aria-label="bracket selection"
            >
              <ToggleButton value="2v2" aria-label="2v2 bracket">
                2v2
              </ToggleButton>
              <ToggleButton value="3v3" aria-label="3v3 bracket">
                3v3
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {leaderboardLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : leaderboard && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Realm</TableCell>
                    <TableCell>Faction</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.entries?.slice(0, 100).map((entry, index) => (
                    <TableRow key={entry.character.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.rating}</TableCell>
                      <TableCell>{entry.character.name}</TableCell>
                      <TableCell>{entry.character.realm.name}</TableCell>
                      <TableCell>{entry.faction.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Snackbar 
        open={showError} 
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