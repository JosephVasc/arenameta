'use client';

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { use } from 'react';

interface LadderPageProps {
  params: Promise<{
    bracket: string;
  }>;
}

const LadderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontWeight: 'bold',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function LadderPage({ params }: LadderPageProps) {
  const resolvedParams = use(params);
  const bracket = resolvedParams.bracket;

  // Mock data - replace with actual data fetching
  const ladderData = {
    title: `${bracket.toUpperCase()} Arena Ladder`,
    lastUpdated: '2024-03-20',
    rankings: [
      { rank: 1, team: 'Team Alpha', rating: 2800, wins: 150, losses: 20 },
      { rank: 2, team: 'Team Beta', rating: 2750, wins: 145, losses: 25 },
      { rank: 3, team: 'Team Gamma', rating: 2700, wins: 140, losses: 30 },
      // Add more mock data as needed
    ],
  };

  return (
    <LadderContainer>
      <Typography variant="h4" gutterBottom>
        {ladderData.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last Updated: {ladderData.lastUpdated}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell align="right">Rating</StyledTableCell>
              <StyledTableCell align="right">Wins</StyledTableCell>
              <StyledTableCell align="right">Losses</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ladderData.rankings.map((row) => (
              <StyledTableRow key={row.rank}>
                <StyledTableCell>{row.rank}</StyledTableCell>
                <StyledTableCell>{row.team}</StyledTableCell>
                <StyledTableCell align="right">{row.rating}</StyledTableCell>
                <StyledTableCell align="right">{row.wins}</StyledTableCell>
                <StyledTableCell align="right">{row.losses}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LadderContainer>
  );
} 