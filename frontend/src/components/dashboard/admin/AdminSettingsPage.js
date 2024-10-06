// AdminSettingsPage.js
import React, { useState } from 'react';
import {
  Container, Typography, Switch, FormControlLabel, Box, TextField, Button,
} from '@mui/material';

export default function AdminSettingsPage() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    username: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Save profile information logic here
    console.log('Profile saved', profileInfo);
  };

  const handleChangePassword = () => {
    // Change password logic here
    if (passwords.newPassword === passwords.confirmPassword) {
      console.log('Password changed', passwords);
    } else {
      console.error('Passwords do not match');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Settings
      </Typography>
      <Box mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationEnabled}
              onChange={() => setNotificationEnabled(!notificationEnabled)}
            />
          }
          label="Enable Notifications"
        />
      </Box>
      <Box mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={twoFactorAuthEnabled}
              onChange={() => setTwoFactorAuthEnabled(!twoFactorAuthEnabled)}
            />
          }
          label="Enable Two-Factor Authentication"
        />
      </Box>
      
    </Container>
  );
}
