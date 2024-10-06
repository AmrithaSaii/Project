import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { TextField, Button, Typography, Container, Snackbar, Alert } from '@mui/material';

const Helpdesk = () => {
  const [username, setUsername] = useState('');
  const [issue, setIssue] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Decode the JWT token to get the username from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  },
  []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
      setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:8081/helpdesk", {
        username,
        issue,
      },
    {
      headers: {
        Authorization: `Bearer ${token}`,
    },
    }
  );
      if (response.data.success) {
        setSuccessMessage('Feedback submitted successfully');
      } else {
        setErrorMessage('Failed to submit feedback');
      }
     
    } catch (error) {
      console.error('Error submitting helpdesk request:', error);
      setErrorMessage('Failed to submit helpdesk request. Please try again.');
      
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Helpdesk Request
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Issue"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          margin="normal"
        >
          Submit
        </Button>
      </form>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Helpdesk;
