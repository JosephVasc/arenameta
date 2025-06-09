'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameVersion } from '@/contexts/GameVersionContext';
import { useRegion } from '@/contexts/RegionContext';
import { getLeaderboardEndpoint, getCharacterEndpoint } from '@/utils/blizzardApi';
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
  Alert,
  Link,
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { US_SERVERS, EU_SERVERS } from '@/constants/servers';
import { formatText } from '@/utils/textFormatting';
import { ListChildComponentProps, FixedSizeList } from 'react-window';
import React from 'react';

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

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

// Custom ListboxComponent for virtualization
function ListboxComponent(props: React.HTMLAttributes<HTMLElement>) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;
  const itemSize = 36;

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemCount * itemSize;
  };

  return (
    <div ref={other.ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
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

interface LeaderboardEntry {
  character: {
    id: number;
    name: string;
    realm: {
      key: {
        href: string;
      };
      id: number;
      slug: string;
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
  const { gameVersion } = useGameVersion();
  const { region } = useRegion();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBracket, setSelectedBracket] = useState('3v3');
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedWinRate, setSelectedWinRate] = useState<string | null>(null);
  const [selectedGamesPlayed, setSelectedGamesPlayed] = useState<string | null>(null);
  const [selectedWinStreak, setSelectedWinStreak] = useState<string | null>(null);
  const [selectedLossStreak, setSelectedLossStreak] = useState<string | null>(null);
  const [selectedHonorKills, setSelectedHonorKills] = useState<string | null>(null);
  const [selectedHonorLevel, setSelectedHonorLevel] = useState<string | null>(null);
  const [selectedAchievementPoints, setSelectedAchievementPoints] = useState<string | null>(null);
  const [selectedMounts, setSelectedMounts] = useState<string | null>(null);
  const [selectedPets, setSelectedPets] = useState<string | null>(null);
  const [selectedTitles, setSelectedTitles] = useState<string | null>(null);
  const [selectedTransmog, setSelectedTransmog] = useState<string | null>(null);
  const [selectedReputation, setSelectedReputation] = useState<string | null>(null);
  const [selectedProfessions, setSelectedProfessions] = useState<string | null>(null);
  const [selectedQuests, setSelectedQuests] = useState<string | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<string | null>(null);
  const [selectedDungeons, setSelectedDungeons] = useState<string | null>(null);
  const [selectedRaids, setSelectedRaids] = useState<string | null>(null);
  const [selectedBattlegrounds, setSelectedBattlegrounds] = useState<string | null>(null);
  const [selectedArenas, setSelectedArenas] = useState<string | null>(null);
  const [selectedWorldPvP, setSelectedWorldPvP] = useState<string | null>(null);
  const [selectedPetBattles, setSelectedPetBattles] = useState<string | null>(null);
  const [selectedArchaeology, setSelectedArchaeology] = useState<string | null>(null);
  const [selectedFishing, setSelectedFishing] = useState<string | null>(null);
  const [selectedCooking, setSelectedCooking] = useState<string | null>(null);
  const [selectedFirstAid, setSelectedFirstAid] = useState<string | null>(null);
  const [selectedHerbalism, setSelectedHerbalism] = useState<string | null>(null);
  const [selectedMining, setSelectedMining] = useState<string | null>(null);
  const [selectedSkinning, setSelectedSkinning] = useState<string | null>(null);
  const [selectedTailoring, setSelectedTailoring] = useState<string | null>(null);
  const [selectedLeatherworking, setSelectedLeatherworking] = useState<string | null>(null);
  const [selectedEngineering, setSelectedEngineering] = useState<string | null>(null);
  const [selectedEnchanting, setSelectedEnchanting] = useState<string | null>(null);
  const [selectedJewelcrafting, setSelectedJewelcrafting] = useState<string | null>(null);
  const [selectedInscription, setSelectedInscription] = useState<string | null>(null);
  const [selectedAlchemy, setSelectedAlchemy] = useState<string | null>(null);
  const [selectedBlacksmithing, setSelectedBlacksmithing] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [gameVersion, selectedBracket]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/pvp-leaderboard/${selectedBracket}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedRealm || !selectedClass) {
      setError('Please enter both realm and character class');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/character/${selectedRealm}/${selectedClass}`);
      if (!response.ok) {
        throw new Error('Character not found');
      }
      const data = await response.json();
      setSelectedClass(data.character_class.name);
      setSelectedSpec(data.active_spec.name);
      setSelectedFaction(data.faction.name);
      setSelectedRealm(data.realm.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      setSelectedClass(null);
      setSelectedSpec(null);
      setSelectedFaction(null);
      setSelectedRealm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const filteredServers = gameVersion === 'retail' 
    ? US_SERVERS.filter(server => !server.toLowerCase().includes('classic') && !server.toLowerCase().includes('season') && !server.toLowerCase().includes('era'))
    : US_SERVERS.filter(server => server.toLowerCase().includes('classic') || server.toLowerCase().includes('season') || server.toLowerCase().includes('era'));

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
              value={selectedBracket}
              exclusive
              onChange={(event, newBracket) => {
                if (newBracket !== null) {
                  setSelectedBracket(newBracket);
                }
              }}
              aria-label="bracket selection"
              size="small"
            >
              <ToggleButton value="2v2" aria-label="2v2 bracket">
                2v2
              </ToggleButton>
              <ToggleButton value="3v3" aria-label="3v3 bracket">
                3v3
              </ToggleButton>
            </ToggleButtonGroup>
            <StyledAutocomplete
              freeSolo
              options={filteredServers}
              value={selectedRealm}
              onChange={(event: any, value: string | null) => setSelectedRealm(value || '')}
              onInputChange={(event, newValue) => setSelectedRealm(newValue)}
              ListboxComponent={ListboxComponent}
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
              options={['Warrior', 'Mage', 'Hunter', 'Rogue', 'Priest', 'Paladin', 'Shaman', 'Druid', 'Warlock', 'Melee', 'Ranged', 'Healer', 'Tank', 'Healer', 'DPS']}
              value={selectedClass}
              onChange={(event: any, value: string | null) => setSelectedClass(value || '')}
              onInputChange={(event, newValue) => setSelectedClass(newValue)}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  size="small"
                  placeholder="Class"
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

        {selectedClass && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {selectedClass} - {selectedRealm}
            </Typography>
            <Grid container spacing={2}>
              <Grid columns={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1">
                  {selectedClass}
                </Typography>
                <Typography variant="subtitle1">
                  {selectedSpec}
                </Typography>
              </Grid>
              <Grid columns={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1">
                  Faction: {selectedFaction}
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
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : leaderboard && (
            <>
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
                    {leaderboard.map((entry, index) => (
                      <TableRow key={entry.character.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{entry.rating}</TableCell>
                        <TableCell>
                          <Link
                            href={`/player/${entry.character.realm.slug}/${entry.character.name}?game_version=${gameVersion}&region=${region}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {formatText(entry.character.name)}
                          </Link>
                        </TableCell>
                        <TableCell>{formatText(entry.character.realm.slug)}</TableCell>
                        <TableCell>{formatText(entry.faction.type)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Box>

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