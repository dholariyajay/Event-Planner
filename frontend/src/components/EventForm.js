import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem, 
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Slide
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEvents } from '../context/EventContext';

// Transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EventForm = ({ open, handleClose, event, isEditing }) => {
  const { createEvent, updateEvent, deleteEvent } = useEvents();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [track, setTrack] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  
  // Event types
  const eventTypes = ['Merger', 'Dividends', 'New Capital', 'Hire'];
  
  // Track options
  const trackOptions = [];
  for (let i = 1; i <= 6; i++) {
    trackOptions.push(`Track ${i}`);
  }
  
  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setEventType(event.event_type || '');
      setTrack(event.track || 'Track 1');
      setStartDate(event.start_date ? new Date(event.start_date) : new Date());
      setEndDate(event.end_date ? new Date(event.end_date) : new Date());
    } else {
      // Default values for new event
      setTitle('');
      setEventType('');
      setTrack('Track 1');
      setStartDate(new Date());
      setEndDate(new Date());
    }
    setErrors({});
  }, [event]);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!eventType) {
      newErrors.eventType = 'Event type is required';
    }
    
    if (!track) {
      newErrors.track = 'Track is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    const eventData = {
      title,
      event_type: eventType,
      track,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };
    
    if (isEditing && event) {
      updateEvent(event.id, eventData);
    } else {
      createEvent(eventData);
    }
    
    handleClose();
  };
  
  // Handle delete event
  const handleDelete = () => {
    if (isEditing && event) {
      deleteEvent(event.id);
      handleClose();
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: '12px' },
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        p: { xs: 2, sm: 3 }
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleClose} 
          aria-label="close"
          sx={{ 
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,0.1)' 
            } 
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
            variant="outlined"
            autoFocus
            InputProps={{
              sx: {
                borderRadius: '8px'
              }
            }}
          />
          
          <TextField
            select
            label="Event Type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            fullWidth
            error={!!errors.eventType}
            helperText={errors.eventType}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: '8px'
              }
            }}
          >
            {eventTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Track"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            fullWidth
            error={!!errors.track}
            helperText={errors.track}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: '8px'
              }
            }}
          >
            {trackOptions.map((track) => (
              <MenuItem key={track} value={track}>
                {track}
              </MenuItem>
            ))}
          </TextField>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    InputProps: {
                      sx: {
                        borderRadius: '8px'
                      }
                    }
                  }
                }}
              />
              
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                    InputProps: {
                      sx: {
                        borderRadius: '8px'
                      }
                    }
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        pt: 0,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box>
          {isEditing && (
            <Button 
              onClick={handleDelete} 
              color="error" 
              startIcon={<Delete />}
              sx={{ 
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                }
              }}
            >
              Delete
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            onClick={handleClose} 
            color="inherit"
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: '8px',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;
