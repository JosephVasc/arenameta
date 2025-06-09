'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useGameVersion } from '@/contexts/GameVersionContext';

export default function StatisticsPage() {
  const theme = useTheme();
  const { gameVersion } = useGameVersion();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'season'>('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder data - replace with actual data fetching
  const statsData = {
    totalPlayers: 12345,
    averageRating: 1850,
    topRating: 3200,
    classDistribution: [
      { class: 'Warrior', percentage: 15 },
      { class: 'Mage', percentage: 12 },
      { class: 'Priest', percentage: 10 },
      { class: 'Rogue', percentage: 9 },
      { class: 'Paladin', percentage: 8 },
    ],
  };

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRange: 'week' | 'month' | 'season' | null,
  ) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Arena Statistics
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Track and analyze arena performance metrics
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
          size="small"
        >
          <ToggleButton value="week">This Week</ToggleButton>
          <ToggleButton value="month">This Month</ToggleButton>
          <ToggleButton value="season">This Season</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Overview Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Total Players</Typography>
                </Box>
                <Typography variant="h4">{statsData.totalPlayers.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Average Rating</Typography>
                </Box>
                <Typography variant="h4">{statsData.averageRating}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Top Rating</Typography>
                </Box>
                <Typography variant="h4">{statsData.topRating}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Class Distribution */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Class Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {statsData.classDistribution.map((item) => (
                  <Box
                    key={item.class}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Typography>{item.class}</Typography>
                    <Typography color="text.secondary">{item.percentage}%</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
} 