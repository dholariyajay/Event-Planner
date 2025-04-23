import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Tabs, 
  Tab, 
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import EventForm from './EventForm';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Determine active tab based on current path
  const getTabValue = () => {
    if (location.pathname === '/list') return 1;
    return 0; // Default to timeline view
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              letterSpacing: '-0.5px'
            }}
          >
            Event Planner
          </Typography>
          <Button 
            color="inherit" 
            variant="outlined"
            onClick={() => setIsFormOpen(true)}
            sx={{
              borderRadius: '8px',
              fontWeight: 'medium',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            New Event
          </Button>
        </Toolbar>
        
        <Box sx={{ bgcolor: 'primary.dark' }}>
          <Container>
            <Tabs 
              value={getTabValue()} 
              indicatorColor="secondary"
              textColor="inherit"
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab 
                label="Timeline View" 
                component={Link} 
                to="/timeline" 
                sx={{ 
                  fontWeight: 'medium',
                  minHeight: 48,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              />
              <Tab 
                label="List View" 
                component={Link} 
                to="/list" 
                sx={{ 
                  fontWeight: 'medium',
                  minHeight: 48,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              />
            </Tabs>
          </Container>
        </Box>
      </AppBar>
      
      <Container sx={{ py: 4, flexGrow: 1 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Event Planner App by Jay Dholariya &copy; {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
      
      <EventForm 
        open={isFormOpen} 
        handleClose={() => setIsFormOpen(false)} 
      />
    </Box>
  );
};

export default Layout;
