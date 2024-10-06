import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar } from '@mui/material';
import { Dashboard, People, SupervisedUserCircle, Settings,Person3, Logout,LiveHelp,CreditCard,AccountBalance,ReceiptLong,AddBusiness} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const UserSidebar = ({ setCurrentView }) => {
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
        <ListItem button onClick={() => handleListItemClick('profile')}>
            <ListItemIcon><Person3 /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('userdashboard')}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('cheque')}>
            <ListItemIcon><ReceiptLong /></ListItemIcon>
            <ListItemText primary="Online Cheque " />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('transaction')}>
            <ListItemIcon><AccountBalance /></ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('help')}>
            <ListItemIcon><LiveHelp /></ListItemIcon>
            <ListItemText primary="Helpdesk" />
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

export default UserSidebar;
