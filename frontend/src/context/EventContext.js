import React, { createContext, useState, useEffect, useContext } from 'react';
import { EventService } from '../services/api';

// Create the Event context
const EventContext = createContext();

// Custom hook to use the Event context
export const useEvents = () => useContext(EventContext);

// Event provider component
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTypes, setEventTypes] = useState(['Merger', 'Dividends', 'New Capital', 'Hire']);

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await EventService.getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new event
  const createEvent = async (eventData) => {
    try {
      const newEvent = await EventService.createEvent(eventData);
      setEvents([...events, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      console.error(err);
      throw err;
    }
  };

  // Update an existing event
  const updateEvent = async (id, eventData) => {
    try {
      const updatedEvent = await EventService.updateEvent(id, eventData);
      setEvents(events.map(event => event.id === id ? updatedEvent : event));
      return updatedEvent;
    } catch (err) {
      setError('Failed to update event');
      console.error(err);
      throw err;
    }
  };

  // Delete an event
  const deleteEvent = async (id) => {
    try {
      await EventService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
      throw err;
    }
  };

  // Reorder events (for drag and drop)
  const reorderEvents = async (reorderedEvents) => {
    // Create a copy of events with updated order
    const updatedEvents = reorderedEvents.map((event, index) => ({
      ...event,
      order: index
    }));
    
    // Update state immediately for responsive UI
    setEvents(updatedEvents);
    
    // Prepare data for API
    const orderData = updatedEvents.map(event => ({
      id: event.id,
      order: event.order
    }));
    
    try {
      await EventService.reorderEvents(orderData);
    } catch (err) {
      // Revert to original order on error
      setError('Failed to reorder events');
      console.error(err);
      fetchEvents(); // Reload original order
      throw err;
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Context value
  const value = {
    events,
    loading,
    error,
    eventTypes,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    setEventTypes
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
