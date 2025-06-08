'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { useState } from 'react';

interface PartnerCard {
  id: number;
  name: string;
  class: string;
  spec: string;
  rating: number;
  experience: string;
  availability: string;
  goals: string[];
}

export default function FindPartnersPage() {
  const [selectedBracket, setSelectedBracket] = useState<'2v2' | '3v3'>('3v3');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  const handleContact = (partnerId: number) => {
    // TODO: Implement contact functionality
    console.log('Contact partner:', partnerId);
  };

  const handleViewProfile = (partnerId: number) => {
    // TODO: Implement view profile functionality
    console.log('View profile:', partnerId);
  };

  // Mock data - replace with actual data fetching
  const partners: PartnerCard[] = [
    {
      id: 1,
      name: 'Arthas',
      class: 'Death Knight',
      spec: 'Frost',
      rating: 2400,
      experience: 'Elite',
      availability: 'Weekends',
      goals: ['Gladiator', 'Arena Master']
    },
    {
      id: 2,
      name: 'Jaina',
      class: 'Mage',
      spec: 'Frost',
      rating: 2200,
      experience: 'Advanced',
      availability: 'Evenings',
      goals: ['Duelist', 'Arena Master']
    },
    // Add more mock data as needed
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Find Arena Partners
      </Typography>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={selectedBracket}
              exclusive
              onChange={(event, newBracket) => {
                if (newBracket !== null) {
                  setSelectedBracket(newBracket);
                }
              }}
              fullWidth
              sx={{ minWidth: 200 }}
            >
              <ToggleButton value="2v2">2v2</ToggleButton>
              <ToggleButton value="3v3">3v3</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                label="Class"
                onChange={(e) => setSelectedClass(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Death Knight">Death Knight</MenuItem>
                <MenuItem value="Druid">Druid</MenuItem>
                <MenuItem value="Hunter">Hunter</MenuItem>
                <MenuItem value="Mage">Mage</MenuItem>
                <MenuItem value="Paladin">Paladin</MenuItem>
                <MenuItem value="Priest">Priest</MenuItem>
                <MenuItem value="Rogue">Rogue</MenuItem>
                <MenuItem value="Shaman">Shaman</MenuItem>
                <MenuItem value="Warlock">Warlock</MenuItem>
                <MenuItem value="Warrior">Warrior</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Rating Range</InputLabel>
              <Select
                value={selectedRating}
                label="Rating Range"
                onChange={(e) => setSelectedRating(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="0-1000">0-1000</MenuItem>
                <MenuItem value="1000-1500">1000-1500</MenuItem>
                <MenuItem value="1500-2000">1500-2000</MenuItem>
                <MenuItem value="2000-2400">2000-2400</MenuItem>
                <MenuItem value="2400+">2400+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Partner Cards */}
      <Grid container spacing={3}>
        {partners.map((partner) => (
          <Grid item xs={12} md={6} lg={4} key={partner.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {partner.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{partner.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {partner.class} - {partner.spec}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {partner.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Experience: {partner.experience}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available: {partner.availability}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {partner.goals.map((goal) => (
                    <Chip key={goal} label={goal} size="small" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleContact(partner.id)}
                >
                  Contact
                </Button>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewProfile(partner.id)}
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 