'use client';

import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function GuidesPage() {
  const theme = useTheme();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const classes = [
    'Death Knight',
    'Druid',
    'Hunter',
    'Mage',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior'
  ];

  // Prefetch all class guide routes
  useEffect(() => {
    classes.forEach(className => {
      router.prefetch(`/guides/${encodeURIComponent(className)}`);
    });
  }, [router]);

  const handleClassClick = async (className: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    try {
      await router.push(`/guides/${encodeURIComponent(className)}`);
    } finally {
      setIsNavigating(false);
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
        <Typography variant="h5" gutterBottom>
          Class Guides
        </Typography>
        <Grid container spacing={3}>
          {classes.map((className) => (
            <Grid key={className} component="div" xs={12} sm={6} md={4}>
              <Card 
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                  opacity: isNavigating ? 0.7 : 1,
                  transition: 'opacity 0.2s ease-in-out',
                  height: '200px', // Fixed height for all cards
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardActionArea 
                  onClick={() => handleClassClick(className)}
                  disabled={isNavigating}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3
                  }}
                >
                  <CardContent sx={{ 
                    width: '100%',
                    textAlign: 'center',
                    p: '0 !important' // Override default padding
                  }}>
                    <Typography 
                      variant="h5" 
                      component="div"
                      sx={{
                        mb: 2,
                        fontWeight: 'bold'
                      }}
                    >
                      {className}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{
                        fontSize: '1.1rem'
                      }}
                    >
                      View PvP Guide
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
} 