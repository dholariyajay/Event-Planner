import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import EventList from '../components/EventList';

const ListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Events List
      </Typography>
      <Paper sx={{ p: 2 }}>
        <EventList />
      </Paper>
    </Box>
  );
};

export default ListPage;
