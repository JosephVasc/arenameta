'use client';

import { Box, Typography, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { use } from 'react';

interface TierListPageProps {
  params: Promise<{
    tierList: string;
  }>;
}

const TierListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
}));

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StatChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const tiers = [
  { name: 'S', color: '#FFD700', description: 'Overpowered' },
  { name: 'A', color: '#FF6B6B', description: 'Strong' },
  { name: 'B', color: '#4ECDC4', description: 'Balanced' },
  { name: 'C', color: '#45B7D1', description: 'Viable' },
  { name: 'D', color: '#96CEB4', description: 'Weak' },
  { name: 'F', color: '#FF9999', description: 'Underpowered' },
];

export default function TierListPage({ params }: TierListPageProps) {
  const resolvedParams = use(params);
  const tierList = resolvedParams.tierList;

  // Mock data - replace with actual data fetching
  const tierListData = {
    '3v3-tier-list': {
      title: '3v3 Arena Tier List',
      lastUpdated: '2024-03-20',
      tiers: {
        S: ['RMP', 'WLD', 'TSG'],
        A: ['MLS', 'RPS', 'KFC'],
        B: ['PHD', 'WLS', 'RMD'],
        C: ['WMD', 'PHD', 'MLD'],
        D: ['WLD', 'RPS', 'MLS'],
        F: ['WMD', 'PHD', 'MLD'],
      },
    },
    '2v2-tier-list': {
      title: '2v2 Arena Tier List',
      lastUpdated: '2024-03-20',
      tiers: {
        S: ['RM', 'WD', 'TS'],
        A: ['ML', 'RP', 'KF'],
        B: ['PH', 'WL', 'RM'],
        C: ['WM', 'PH', 'ML'],
        D: ['WL', 'RP', 'ML'],
        F: ['WM', 'PH', 'ML'],
      },
    },
    'class-tier-list': {
      title: 'Class Tier List',
      lastUpdated: '2024-03-20',
      tiers: {
        S: ['Rogue', 'Mage', 'Priest'],
        A: ['Warlock', 'Druid', 'Shaman'],
        B: ['Paladin', 'Hunter', 'Death Knight'],
        C: ['Warrior', 'Monk', 'Demon Hunter'],
        D: ['Warlock', 'Druid', 'Shaman'],
        F: ['Warrior', 'Monk', 'Demon Hunter'],
      },
    },
  };

  const data = tierListData[tierList as keyof typeof tierListData];

  return (
    <TierListContainer>
      <Typography variant="h4" gutterBottom>
        {data.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last Updated: {data.lastUpdated}
      </Typography>

      {tiers.map((tier) => (
        <Section key={tier.name}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                color: tier.color,
                fontWeight: 'bold',
                mr: 2,
              }}
            >
              Tier {tier.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {tier.description}
            </Typography>
          </Box>
          <Box>
            {data.tiers[tier.name as keyof typeof data.tiers].map((item) => (
              <StatChip
                key={item}
                label={item}
                sx={{
                  backgroundColor: tier.color,
                  color: '#000',
                  '&:hover': {
                    backgroundColor: tier.color,
                    opacity: 0.9,
                  },
                }}
              />
            ))}
          </Box>
        </Section>
      ))}
    </TierListContainer>
  );
} 