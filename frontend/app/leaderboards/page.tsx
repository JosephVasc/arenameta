'use client';

import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

export default function LeaderboardsPage() {
  const theme = useTheme();
  const [bracket, setBracket] = useState<'2v2' | '3v3'>('3v3');

  // Mock data for the leaderboard
  const leaderboardData = {
    '2v2': [
      { rank: 1, name: 'Player1', rating: 2600, wins: 120, losses: 40, winRate: '75%' },
      { rank: 2, name: 'Player2', rating: 2550, wins: 115, losses: 45, winRate: '71.9%' },
      { rank: 3, name: 'Player3', rating: 2500, wins: 110, losses: 50, winRate: '68.8%' },
      { rank: 4, name: 'Player4', rating: 2450, wins: 105, losses: 55, winRate: '65.6%' },
      { rank: 5, name: 'Player5', rating: 2400, wins: 100, losses: 60, winRate: '62.5%' },
    ],
    '3v3': [
      { rank: 1, name: 'Player1', rating: 2800, wins: 150, losses: 50, winRate: '75%' },
      { rank: 2, name: 'Player2', rating: 2750, wins: 145, losses: 55, winRate: '72.5%' },
      { rank: 3, name: 'Player3', rating: 2700, wins: 140, losses: 60, winRate: '70%' },
      { rank: 4, name: 'Player4', rating: 2650, wins: 135, losses: 65, winRate: '67.5%' },
      { rank: 5, name: 'Player5', rating: 2600, wins: 130, losses: 70, winRate: '65%' },
    ]
  };

  const handleBracketChange = (
    event: React.MouseEvent<HTMLElement>,
    newBracket: '2v2' | '3v3' | null,
  ) => {
    if (newBracket !== null) {
      setBracket(newBracket);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Arena Leaderboard
          </Typography>
          <ToggleButtonGroup
            value={bracket}
            exclusive
            onChange={handleBracketChange}
            aria-label="arena bracket"
            size="small"
          >
            <ToggleButton value="2v2" aria-label="2v2">
              2v2
            </ToggleButton>
            <ToggleButton value="3v3" aria-label="3v3">
              3v3
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Wins</TableCell>
                <TableCell align="right">Losses</TableCell>
                <TableCell align="right">Win Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData[bracket].map((row) => (
                <TableRow key={row.rank}>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.rating}</TableCell>
                  <TableCell align="right">{row.wins}</TableCell>
                  <TableCell align="right">{row.losses}</TableCell>
                  <TableCell align="right">{row.winRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
} 