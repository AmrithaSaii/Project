import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, InputBase, Badge, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, AccountCircle, Notifications, Search as SearchIcon } from '@mui/icons-material';
import './StaffHeader.css';

const StaffHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Call search function when input changes
    search(event.target.value);
  };

  const search = (query) => {
    // Implement your search logic here
    // For example, search through the DOM or specific content
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const elements = document.getElementsByTagName('body')[0].getElementsByTagName('*');
    const matches = [];

    for (let element of elements) {
      if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
        matches.push(element);
      }
    }

    setSearchResults(matches);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
       
        <Typography variant="h6" noWrap>
         Welcome to UniCredit Bank
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <div className="header-search">
          <div className="search-icon-wrapper">
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: 'search-input',
            }}
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={0} color="secondary">
            <Notifications />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationsClose}
        >
          <MenuItem onClick={handleNotificationsClose}>Check Feedbacks</MenuItem>
          <MenuItem onClick={handleNotificationsClose}>Add security</MenuItem>
          <MenuItem onClick={handleNotificationsClose}>List Users</MenuItem>
        </Menu>
        
      </Toolbar>
    </AppBar>
  );
};

export default StaffHeader;
