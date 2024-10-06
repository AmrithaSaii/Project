import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar, Collapse } from '@mui/material';
import { Dashboard,CreditCard, People,Approval, SupervisedUserCircle, AccountBox, Settings, Logout, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = ({ setCurrentView }) => {
  const drawerWidth = 240;
  const [openLoan, setOpenLoan] = useState(false);

  const handleListItemClick = (view) => {
    setCurrentView(view);
  };

  const handleLoanClick = () => {
    setOpenLoan(!openLoan);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem button onClick={() => handleListItemClick('dashboard')}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('users')}>
            <ListItemIcon><People /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('staff')}>
            <ListItemIcon><SupervisedUserCircle /></ListItemIcon>
            <ListItemText primary="Staff" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('loan')}>
            <ListItemIcon><CreditCard /></ListItemIcon>
            <ListItemText primary="Loan" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('creditcard')}>
            <ListItemIcon><CreditCard /></ListItemIcon>
            <ListItemText primary="Credit Card" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('profile')}>
            <ListItemIcon><AccountBox /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('settings')}>
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button component={Link} to="/">
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
