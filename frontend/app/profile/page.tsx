'use client';

import { Container, Typography, Box, Paper, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function ProfilePage() {
  const theme = useTheme();

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
        <Grid container spacing={3}>
          <Grid component="div" item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Typography variant="h5" gutterBottom>
                Player Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level 80
              </Typography>
            </Box>
          </Grid>
          <Grid component="div" item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Character Information
            </Typography>
            <Grid container spacing={2}>
              <Grid component="div" item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
                <Typography variant="body1">
                  Death Knight
                </Typography>
              </Grid>
              <Grid component="div" item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Realm
                </Typography>
                <Typography variant="body1">
                  Whitemane
                </Typography>
              </Grid>
              <Grid component="div" item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Rating
                </Typography>
                <Typography variant="body1">
                  2,500
                </Typography>
              </Grid>
              <Grid component="div" item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="body1">
                  65%
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
} 