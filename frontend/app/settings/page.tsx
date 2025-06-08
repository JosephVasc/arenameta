'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Switch, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

export default function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoRefresh: false,
    showTooltips: true
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
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
          Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Enable dark theme for the application"
            />
            <Switch
              edge="end"
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Notifications" 
              secondary="Receive notifications for important updates"
            />
            <Switch
              edge="end"
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Auto Refresh" 
              secondary="Automatically refresh data every 5 minutes"
            />
            <Switch
              edge="end"
              checked={settings.autoRefresh}
              onChange={() => handleToggle('autoRefresh')}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Show Tooltips" 
              secondary="Display helpful tooltips throughout the application"
            />
            <Switch
              edge="end"
              checked={settings.showTooltips}
              onChange={() => handleToggle('showTooltips')}
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
} 