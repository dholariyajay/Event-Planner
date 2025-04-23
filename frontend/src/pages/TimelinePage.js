import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import EventTimeline from '../components/EventTimeline';

const TimelinePage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Events Timeline
      </Typography>
      <Paper sx={{ p: 2 }}>
        <EventTimeline />
      </Paper>
    </Box>
  );
};

export default TimelinePage;
