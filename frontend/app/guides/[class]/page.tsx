'use client';

import { Box, Typography, Paper, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ClassGuidePageProps {
  params: Promise<{
    class: string;
  }>;
}

const ClassGuideContainer = styled(Box)(({ theme }) => ({
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

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const StatsColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 300,
}));

const EnchantsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const EnchantItem = styled(Box)(({ theme }) => ({
  flex: '1 1 300px',
  maxWidth: 'calc(33.333% - 16px)',
  [theme.breakpoints.down('md')]: {
    maxWidth: 'calc(50% - 16px)',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const StatItem = styled(Box)(({ theme }) => ({
  flex: '1 1 200px',
  [theme.breakpoints.down('sm')]: {
    flex: '1 1 100%',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export default function ClassGuidePage({ params }: ClassGuidePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const className = decodeURIComponent(resolvedParams.class);

  const handleBack = () => {
    router.back();
  };

  // Mock data - replace with actual data fetching
  const classData = {
    name: className,
    role: 'DPS',
    primaryStats: ['Strength', 'Critical Strike'],
    secondaryStats: ['Haste', 'Mastery'],
    recommendedGems: ['Bold Primordial Ruby', 'Delicate Primordial Ruby'],
    recommendedEnchants: {
      head: 'Arcanum of the Dragonmaw',
      shoulder: 'Greater Inscription of Charged Lodestone',
      chest: 'Enchant Chest - Peerless Stats',
      wrist: 'Enchant Bracer - Major Strength',
      hands: 'Enchant Gloves - Greater Strength',
      legs: 'Enchant Legs - Dragonscale Leg Armor',
      feet: 'Enchant Boots - Major Agility',
      weapon: 'Enchant Weapon - Landslide',
    },
    pvpTalents: [
      'Adaptation',
      'Relentless',
      'Gladiator\'s Medallion',
    ],
    pvpStats: {
      resilience: 65,
      power: 4000,
      versatility: 8,
    },
  };

  return (
    <ClassGuideContainer>
      <HeaderContainer>
        <IconButton 
          onClick={handleBack}
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(144, 202, 249, 0.08)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {classData.name} PvP Guide
        </Typography>
      </HeaderContainer>

      <Section>
        <Typography variant="h6" gutterBottom>
          Role & Stats
        </Typography>
        <StatsContainer>
          <StatsColumn>
            <Typography variant="subtitle1" gutterBottom>
              Primary Stats
            </Typography>
            <Box>
              {classData.primaryStats.map((stat) => (
                <StatChip key={stat} label={stat} color="primary" />
              ))}
            </Box>
          </StatsColumn>
          <StatsColumn>
            <Typography variant="subtitle1" gutterBottom>
              Secondary Stats
            </Typography>
            <Box>
              {classData.secondaryStats.map((stat) => (
                <StatChip key={stat} label={stat} color="secondary" />
              ))}
            </Box>
          </StatsColumn>
        </StatsContainer>
      </Section>

      <Section>
        <Typography variant="h6" gutterBottom>
          Recommended Gems
        </Typography>
        <Box>
          {classData.recommendedGems.map((gem) => (
            <StatChip key={gem} label={gem} />
          ))}
        </Box>
      </Section>

      <Section>
        <Typography variant="h6" gutterBottom>
          Recommended Enchants
        </Typography>
        <EnchantsContainer>
          {Object.entries(classData.recommendedEnchants).map(([slot, enchant]) => (
            <EnchantItem key={slot}>
              <Typography variant="subtitle2" color="text.secondary">
                {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </Typography>
              <Typography>{enchant}</Typography>
            </EnchantItem>
          ))}
        </EnchantsContainer>
      </Section>

      <Section>
        <Typography variant="h6" gutterBottom>
          PvP Talents
        </Typography>
        <Box>
          {classData.pvpTalents.map((talent) => (
            <StatChip key={talent} label={talent} color="primary" />
          ))}
        </Box>
      </Section>

      <Section>
        <Typography variant="h6" gutterBottom>
          PvP Stats
        </Typography>
        <StatsGrid>
          {Object.entries(classData.pvpStats).map(([stat, value]) => (
            <StatItem key={stat}>
              <Typography variant="subtitle2" color="text.secondary">
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </Typography>
              <Typography>{value}</Typography>
            </StatItem>
          ))}
        </StatsGrid>
      </Section>
    </ClassGuideContainer>
  );
} 