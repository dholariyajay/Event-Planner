import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EventProvider } from './context/EventContext';
import Layout from './components/Layout';
import ListPage from './pages/ListPage';
import TimelinePage from './pages/TimelinePage';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EventProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/timeline" replace />} />
              <Route path="/list" element={<ListPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
            </Routes>
          </Layout>
        </Router>
      </EventProvider>
    </ThemeProvider>
  );
}

export default App;
