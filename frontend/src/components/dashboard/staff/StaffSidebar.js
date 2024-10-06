import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar } from '@mui/material';
import { Dashboard, People,AccountBox, SupervisedUserCircle, Settings,AccessibilityNew, Logout,LiveHelp,CreditCard,AccountBalance,ReceiptLong,AddBusiness} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const StaffSidebar = ({ setCurrentView }) => {
  const drawerWidth = 240;

  const handleListItemClick = (view) => {
    setCurrentView(view);
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
          <ListItem button onClick={() => handleListItemClick('staffdashboard')}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('staffuser')}>
            <ListItemIcon><AccessibilityNew /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('staffcheque')}>
            <ListItemIcon><ReceiptLong /></ListItemIcon>
            <ListItemText primary="Online Cheque " />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('transactionhistory')}>
            <ListItemIcon><AccountBalance /></ListItemIcon>
            <ListItemText primary="Transaction History" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('support')}>
            <ListItemIcon><LiveHelp /></ListItemIcon>
            <ListItemText primary="Helpdesk" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('staffprofile')}>
            <ListItemIcon><AccountBox /></ListItemIcon>
            <ListItemText primary="Profile" />
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

export default StaffSidebar;
