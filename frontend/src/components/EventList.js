import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip,
  Pagination,
  Stack
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Search,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEvents } from '../context/EventContext';
import EventForm from './EventForm';

const EventList = () => {
  const { events, loading, error, deleteEvent, reorderEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };
  
  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  // Filter events based on search term and selected type
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? event.event_type === selectedType : true;
    return matchesSearch && matchesType;
  });
  
  // Paginate events
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  
  // Get unique event types
  const uniqueEventTypes = [...new Set(events.map(event => event.event_type))];
  
  // Handle edit button click
  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };
  
  // Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };
  
  // Get color based on event type
  const getEventColor = (type) => {
    switch (type) {
      case 'Merger':
        return '#1976d2'; // Blue
      case 'Dividends':
        return '#2e7d32'; // Green
      case 'New Capital':
        return '#ffeb3b'; // Yellow
      case 'Hire':
        return '#d32f2f'; // Red
      default:
        return '#9c27b0'; // Purple for other types
    }
  };
  
  // Handle drag end
  const handleDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // Reorder events based on drag and drop
    const reorderedItems = Array.from(filteredEvents);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    // Update the order property
    const updatedEvents = reorderedItems.map((event, index) => ({
      ...event,
      order: index
    }));
    
    // Call the reorderEvents function from context
    reorderEvents(updatedEvents);
  };
  
  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Typography>Loading events...</Typography>
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box sx={{ my: 2, color: 'error.main' }}>
        <Typography>Error: {error}</Typography>
      </Box>
    );
  }
  
  // Mobile card view
  const renderMobileView = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="events">
          {(provided) => (
            <Box 
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 2
              }}
            >
              {paginatedEvents.map((event, index) => (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        borderLeft: `4px solid ${getEventColor(event.event_type)}`,
                        borderRadius: '8px',
                        boxShadow: snapshot.isDragging 
                          ? '0 8px 16px rgba(0,0,0,0.2)' 
                          : '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s ease',
                        transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {event.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label={event.event_type} 
                            size="small"
                            sx={{ 
                              backgroundColor: getEventColor(event.event_type),
                              color: event.event_type === 'New Capital' ? '#000' : '#fff',
                              fontWeight: 'medium',
                              mr: 1
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {event.track}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(event.start_date), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(event.start_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                          </Typography>
                        </Box>
                      </CardContent>
                      
                      <Divider />
                      
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(event)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(event.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  
  // Desktop table view
  const renderDesktopView = () => {
    return (
      <TableContainer component={Paper} sx={{ 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="events">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef}>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Track</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEvents.map((event, index) => (
                    <Draggable key={event.id} draggableId={event.id} index={index}>
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            backgroundColor: snapshot.isDragging ? '#f0f7ff' : 'inherit',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            },
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <TableCell sx={{ fontWeight: 'medium' }}>{event.title}</TableCell>
                          <TableCell>
                            <Chip 
                              label={event.event_type} 
                              size="small"
                              sx={{ 
                                backgroundColor: getEventColor(event.event_type),
                                color: event.event_type === 'New Capital' ? '#000' : '#fff',
                                fontWeight: 'medium'
                              }}
                            />
                          </TableCell>
                          <TableCell>{event.track}</TableCell>
                          <TableCell>{format(new Date(event.start_date), 'MMM d, yyyy h:mm a')}</TableCell>
                          <TableCell>{format(new Date(event.end_date), 'MMM d, yyyy h:mm a')}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleEdit(event)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDelete(event.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </TableContainer>
    );
  };
  
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
      
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h1" sx={{ 
          fontWeight: 'bold',
          color: 'primary.dark',
          letterSpacing: '-0.5px'
        }}>
          Events ({filteredEvents.length})
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            setEditingEvent(null);
            setIsFormOpen(true);
          }}
          sx={{ 
            borderRadius: '8px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Add Event
        </Button>
      </Box>
      
      {filteredEvents.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
          <Typography variant="body1" color="text.secondary">
            No events found. Try adjusting your search or filters.
          </Typography>
        </Paper>
      ) : (
        <>
          {isMobile ? renderMobileView() : renderDesktopView()}
          
          {/* Pagination */}
          {filteredEvents.length > rowsPerPage && (
            <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '8px',
                  },
                  '& .Mui-selected': {
                    fontWeight: 'bold',
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Showing {Math.min(paginatedEvents.length, rowsPerPage)} of {filteredEvents.length} events
              </Typography>
            </Stack>
          )}
        </>
      )}
      
      <EventForm 
        open={isFormOpen} 
        handleClose={handleFormClose} 
        event={editingEvent} 
        isEditing={!!editingEvent} 
      />
    </Container>
  );
};

export default EventList;
