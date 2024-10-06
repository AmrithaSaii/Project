import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackArrow = ({ setCurrentView }) => {
  const handleBackClick = () => {
    setCurrentView('userdashboard'); // Always navigate to dashboard
  };

  return (
    <IconButton onClick={handleBackClick} sx={{ mb: 2 }}>
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackArrow;
