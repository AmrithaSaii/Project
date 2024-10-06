import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import AdminProfile from './profile.js';
import AdminDashboardPage from './Content.js'
import UserManagement from './UserDetails.js';
import StaffDetails from './StaffDetails.js';
import AdminCard from './Admincard.js';
import AdminSettingsPage from './AdminSettingsPage';
import LoanApp from './LoanApp.js';

const App = () => {
  const drawerWidth = 240;
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboardPage />;
      case 'users':
        return <UserManagement />
      case 'staff':
        return <StaffDetails />
      case 'settings':
        return <AdminSettingsPage />;
      case 'loan':
        return <LoanApp/>
        case 'creditcard':
          return <AdminCard/>
        case 'profile':
          return <AdminProfile/>
        
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
   
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        <Sidebar drawerWidth={drawerWidth} setCurrentView={setCurrentView} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            marginTop: '64px',
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          <Toolbar />
          
         
          {renderContent()}
        </Box>
      </Box>
    
  );
};

export default App;
