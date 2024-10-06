import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Snackbar, Alert } from '@mui/material';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/admin/helpdesk', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setTickets(response.data.tickets);
        } else {
          setErrorMessage('Failed to fetch helpdesk tickets');
        }
      } catch (error) {
        console.error('Error fetching helpdesk tickets:', error);
        setErrorMessage('Failed to fetch helpdesk tickets. Please try again.');
      }
    };

    fetchTickets();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Helpdesk Tickets
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Issue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.username}</TableCell>
              <TableCell>{ticket.issue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

export default Support;
