import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  IconButton, 
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
  Tooltip,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Today,
  ViewTimeline,
  DragIndicator,
  CalendarToday
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  format, 
  addDays, 
  subDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  addYears,
  subYears,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  isToday,
  getDay
} from 'date-fns';
import { useEvents } from '../context/EventContext';
import EventForm from './EventForm';

// View types
const VIEW_TYPES = {
  TIMELINE: 'timeline'
};

const EventTimeline = () => {
  const { events, loading, error, deleteEvent, reorderEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Calendar state
  const [viewType, setViewType] = useState(VIEW_TYPES.TIMELINE);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Theme and responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get unique tracks from events, or use default tracks if none have tracks yet
  const tracks = useMemo(() => {
    const trackSet = [...new Set(events.filter(e => e.track).map(e => e.track))];
    
    if (trackSet.length === 0) {
      // Default tracks if no events have tracks assigned
      for (let i = 1; i <= 6; i++) {
        trackSet.push(`Track ${i}`);
      }
    }
    
    // Sort tracks numerically
    return trackSet.sort((a, b) => {
      const aNum = parseInt(a.replace('Track ', ''));
      const bNum = parseInt(b.replace('Track ', ''));
      return aNum - bNum;
    });
  }, [events]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter events based on search term and selected type
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? event.event_type === selectedType : true;
      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, selectedType]);
  
  // Get unique event types for filtering
  const uniqueEventTypes = useMemo(() => {
    return [...new Set(events.map(event => event.event_type))];
  }, [events]);
  
  // Handle edit button click
  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };
  
  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
    }
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };
  
  // Format date for display
  const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    try {
      return format(new Date(dateString), formatStr);
    } catch (error) {
      return dateString;
    }
  };
  
  // Get event color based on type
  const getEventColor = (type) => {
    switch (type) {
      case 'Merger':
        return '#1976d2'; // blue
      case 'Dividends':
        return '#2e7d32'; // green
      case 'New Capital':
        return '#ffeb3b'; // yellow
      case 'Hire':
        return '#ed6c02'; // orange
      default:
        return '#757575'; // grey
    }
  };
  
  // Get quarters for a year
  const getQuarters = (year) => {
    return [
      { name: 'Q1 ' + year, start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
      { name: 'Q2 ' + year, start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
      { name: 'Q3 ' + year, start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
      { name: 'Q4 ' + year, start: new Date(year, 9, 1), end: new Date(year, 11, 31) }
    ];
  };
  
  // Get months for a year
  const getMonths = (year) => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(year, i, 1);
      return {
        name: format(date, 'MMM'),
        number: i
      };
    });
  };
  
  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear() - 1, 0, 1));
  
  const goToNext = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear() + 1, 0, 1));
  
  // Get events for a specific day
  const getEventsForDay = (day) => {
    return filteredEvents.filter(event => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  };
  
  // Handle drag end
  const handleDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // Reorder tracks
    const reorderedTracks = Array.from(tracks);
    const [removed] = reorderedTracks.splice(result.source.index, 1);
    reorderedTracks.splice(result.destination.index, 0, removed);
    
    // Update events with new track order
    const updatedEvents = events.map(event => {
      const trackIndex = reorderedTracks.indexOf(event.track);
      return {
        ...event,
        order: trackIndex
      };
    });
    
    // Call the reorderEvents function from context
    reorderEvents(updatedEvents);
  };
  
  // Calculate position for an event
  const calculateEventPosition = (event) => {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    // Get month indices
    const startMonthIndex = startDate.getMonth();
    const endMonthIndex = endDate.getMonth();
    
    // Calculate start position (percentage from left)
    const startPosition = (startMonthIndex * (isMobile ? 80 : 120)) + 
      ((startDate.getDate() / new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()) * (isMobile ? 80 : 120));
    
    // Calculate width
    let width;
    if (startMonthIndex === endMonthIndex) {
      // Same month
      const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
      width = ((endDate.getDate() - startDate.getDate() + 1) / daysInMonth) * (isMobile ? 80 : 120);
    } else {
      // Different months
      const startMonthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
      const startMonthRemaining = ((startMonthDays - startDate.getDate() + 1) / startMonthDays) * (isMobile ? 80 : 120);
      
      const endMonthPortion = (endDate.getDate() / new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()) * (isMobile ? 80 : 120);
      
      // Add middle months (if any)
      const middleMonths = endMonthIndex - startMonthIndex - 1;
      
      width = startMonthRemaining + (middleMonths * (isMobile ? 80 : 120)) + endMonthPortion;
    }
    
    // Ensure minimum width
    width = Math.max(width, isMobile ? 40 : 60);
    
    return {
      left: startPosition,
      width: width
    };
  };
  
  // Render calendar header
  const renderHeader = () => {
    const dateRangeText = `${currentDate.getFullYear()} Timeline`;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
        p: { xs: 1.5, sm: 2 },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup 
            variant="outlined" 
            size={isMobile ? "small" : "medium"} 
            sx={{ 
              mr: 2,
              '& .MuiButton-root': {
                borderColor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }
              }
            }}
          >
            <Button onClick={goToPrevious} sx={{ minWidth: '40px', p: 0.5 }}>
              <ChevronLeft />
            </Button>
            <Button onClick={goToToday} sx={{ minWidth: '40px', p: 0.5 }}>
              <CalendarToday fontSize="small" />
            </Button>
            <Button onClick={goToNext} sx={{ minWidth: '40px', p: 0.5 }}>
              <ChevronRight />
            </Button>
          </ButtonGroup>
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.dark',
              letterSpacing: '-0.5px'
            }}
          >
            {dateRangeText}
          </Typography>
        </Box>
      </Box>
    );
  };
  
  // Render timeline view (track-based)
  const renderTimelineView = () => {
    const year = currentDate.getFullYear();
    const quarters = getQuarters(year);
    const months = getMonths(year);
    
    // Get events for a specific track
    const getEventsForTrack = (track) => {
      return filteredEvents.filter(event => event.track === track);
    };
    
    // Calculate total width
    const totalWidth = months.length * (isMobile ? 80 : 120); // Adjust width for mobile
    
    return (
      <Box sx={{ 
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#bbb',
          borderRadius: '4px',
          '&:hover': {
            background: '#999'
          }
        }
      }}>
        <Box sx={{ minWidth: totalWidth + 100, position: 'relative' }}>
          {/* Quarters header */}
          <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0', ml: 10 }}>
            {quarters.map(quarter => (
              <Box 
                key={quarter.name} 
                sx={{ 
                  width: `${(quarter.end.getMonth() - quarter.start.getMonth() + 1) * (isMobile ? 80 : 120)}px`,
                  p: isMobile ? 0.5 : 1,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderRight: '1px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                  fontSize: isMobile ? '0.75rem' : 'inherit'
                }}
              >
                {quarter.name}
              </Box>
            ))}
          </Box>
          
          {/* Months header */}
          <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0', ml: 10 }}>
            {months.map(month => (
              <Box 
                key={month.name} 
                sx={{ 
                  width: isMobile ? '80px' : '120px',
                  p: isMobile ? 0.5 : 1,
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  fontSize: isMobile ? '0.75rem' : 'inherit'
                }}
              >
                {month.name}
              </Box>
            ))}
          </Box>
          
          {/* Today marker */}
          {(() => {
            const now = new Date();
            if (now.getFullYear() === year) {
              const monthIndex = now.getMonth();
              const dayPercentage = now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
              const position = (monthIndex * (isMobile ? 80 : 120)) + (dayPercentage * (isMobile ? 80 : 120));
              
              return (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: `${position + 100}px`, // Add 100px for the track labels
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: 'error.main',
                    zIndex: 2
                  }}
                />
              );
            }
            return null;
          })()}
          
          {/* Tracks and events */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tracks" type="TRACK">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {tracks.map((track, trackIndex) => {
                    const trackEvents = getEventsForTrack(track);
                    return (
                      <Draggable key={track} draggableId={`track-${track}`} index={trackIndex}>
                        {(provided, snapshot) => (
                          <Box 
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            sx={{ 
                              display: 'flex', 
                              borderBottom: '1px solid #e0e0e0', 
                              height: '50px', 
                              position: 'relative',
                              backgroundColor: snapshot.isDragging ? '#f0f7ff' : 'transparent'
                            }}
                          >
                            {/* Track label */}
                            <Box 
                              {...provided.dragHandleProps}
                              sx={{ 
                                width: '100px', 
                                borderRight: '1px solid #e0e0e0', 
                                display: 'flex', 
                                alignItems: 'center', 
                                px: 1,
                                cursor: 'grab',
                                '&:hover': {
                                  backgroundColor: '#f5f5f5'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box 
                                  sx={{ 
                                    width: isMobile ? 14 : 16, 
                                    height: isMobile ? 14 : 16, 
                                    borderRadius: '2px', 
                                    border: '1px solid #666',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                                    mr: 1
                                  }}
                                >
                                  {trackIndex + 1}
                                </Box>
                                <Typography 
                                  variant="body2" 
                                  fontWeight="bold"
                                  sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
                                >
                                  {track}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Timeline grid and events */}
                            <Box sx={{ position: 'relative', flexGrow: 1, height: '100%' }}>
                              {/* Month grid lines */}
                              {months.map((month, i) => (
                                <Box 
                                  key={i}
                                  sx={{ 
                                    position: 'absolute',
                                    left: `${i * (isMobile ? 80 : 120)}px`,
                                    top: 0,
                                    bottom: 0,
                                    width: '1px',
                                    backgroundColor: '#e0e0e0'
                                  }}
                                />
                              ))}
                              
                              {/* Events */}
                              {trackEvents.map((event) => {
                                const position = calculateEventPosition(event);
                                const eventColor = getEventColor(event.event_type);
                                
                                return (
                                  <Tooltip 
                                    key={event.id} 
                                    title={
                                      <Box>
                                        <Typography variant="subtitle2">{event.title}</Typography>
                                        <Typography variant="body2">
                                          {formatDate(event.start_date, 'MMM d, yyyy')} - {formatDate(event.end_date, 'MMM d, yyyy')}
                                        </Typography>
                                      </Box>
                                    }
                                  >
                                    <Box 
                                      sx={{
                                        position: 'absolute',
                                        left: `${position.left}px`,
                                        width: `${position.width}px`,
                                        top: '10px',
                                        height: isMobile ? '25px' : '30px',
                                        backgroundColor: event.event_type === 'New Capital' ? `${eventColor}` : eventColor,
                                        color: event.event_type === 'New Capital' ? '#000' : '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        pl: 1,
                                        pr: 1,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                        borderRadius: '2px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          opacity: 0.9,
                                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                          zIndex: 2,
                                          transform: 'translateY(-1px)'
                                        }
                                      }}
                                      onClick={() => handleEdit(event)}
                                    >
                                      <Typography variant="caption" fontWeight="bold" noWrap>
                                        {event.title}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                );
                              })}
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
    );
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 } }}>
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
        />
      </Box>
      
      <Box mb={3} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="body1" sx={{ mr: 2, fontWeight: 'medium', mb: { xs: 1, sm: 0 } }}>
          Filter by type:
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {uniqueEventTypes.map(type => (
            <Chip 
              key={type}
              label={type} 
              onClick={() => setSelectedType(type === selectedType ? '' : type)}
              variant={type === selectedType ? 'filled' : 'outlined'}
              sx={{ 
                backgroundColor: type === selectedType ? getEventColor(type) : 'transparent',
                color: type === selectedType ? (type === 'New Capital' ? '#000' : '#fff') : 'inherit',
                borderColor: getEventColor(type),
                borderRadius: '16px',
                fontWeight: 'medium',
                transition: 'all 0.2s ease',
                '&:hover': {
                  opacity: 0.9,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }
              }}
            />
          ))}
        </Box>
      </Box>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 0, 
          mb: 4, 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
          }
        }}
      >
        {renderHeader()}
        {renderTimelineView()}
      </Paper>
      
      <EventForm 
        open={isFormOpen} 
        handleClose={handleFormClose} 
        event={editingEvent} 
        isEditing={!!editingEvent} 
      />
    </Container>
  );
};

export default EventTimeline;
