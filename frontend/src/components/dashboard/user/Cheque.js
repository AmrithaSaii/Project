import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Cheque = () => {
  const [username, setUsername] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [receiverError, setReceiverError] = useState(''); // New state for receiver validation error

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }

    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  const validateReceiver = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validateReceiver', {
        params: { receiverUsername },
      });
      return response.data.exists; // Expect the backend to return { exists: true/false }
    } catch (error) {
      console.error('Error validating receiver:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    if (parseFloat(amount) <= 40000) {
      setError('Amount must be more than ₹40,000');
      return;
    }

    setError('');

    // Validate receiver
    const isReceiverValid = await validateReceiver();
    if (!isReceiverValid) {
      setReceiverError("Receiver's username does not exist.");
      return;
    }

    setReceiverError(''); // Clear receiver error if valid

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:8081/chequeTransactionRequest',
        { username, receiverUsername, amount, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Transaction request submitted successfully');
      setReceiverUsername('');
      setAmount('');
    } catch (error) {
      console.error('Error submitting transaction request:', error);
      alert('Error submitting transaction request');
    }
  };

  const checkTransactionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await axios.get('http://localhost:8081/chequeStatus', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data.transactions || []); // Set transactions state with response data
    } catch (error) {
      console.error('Error fetching transaction status:', error);
    }
  };

  return (
    <Box p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Online Cheque Transaction
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={username}
              fullWidth
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Receiver's Username"
              value={receiverUsername}
              onChange={(e) => setReceiverUsername(e.target.value)}
              fullWidth
              variant="outlined"
              error={Boolean(receiverError)}
              helperText={receiverError}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              variant="outlined"
              error={Boolean(error)}
              helperText={error}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit Transaction Request
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={checkTransactionStatus}
            >
              Check Transaction Status
            </Button>
          </Grid>
          {transactions && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Transaction History
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Receiver Username</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.chequenumber}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.receiver}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
};

export default Cheque;
