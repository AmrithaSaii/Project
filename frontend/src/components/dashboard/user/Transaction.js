import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Transaction = () => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState(''); // Updated state for receiver ID
  const [error, setError] = useState('');
  const [receiverError, setReceiverError] = useState(''); // New state for receiver validation error
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  const validateReceiver = async () => {
    try {
      const response = await axios.get('http://localhost:8081/validateReceiver', {
        params: { receiverUsername: receiver }
      });
      return response.data.exists; // Expect the backend to return { exists: true/false }
    } catch (error) {
      console.error('Error validating receiver:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than ₹0');
      return;
    }

    // Validate receiver
    const isReceiverValid = await validateReceiver();
    if (!isReceiverValid) {
      setReceiverError("Receiver's ID does not exist.");
      return;
    }

    setReceiverError(''); // Clear receiver error if valid
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8081/normalTransaction', { username, amount, receiver }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Transaction successful');
      setAmount('');
      setReceiver('');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error submitting transaction:', error.response ? error.response.data : error.message);
      alert('Error submitting transaction');
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await axios.get('http://localhost:8081/transactionHistory', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  const handleViewTransactions = () => {
    fetchTransactions();
    setShowTransactions(true);
  };

  return (
    <Box p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Normal Transaction
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
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Receiver ID"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
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
            <Button type="submit" variant="contained" color="primary">
              Confirm Transaction
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="button" variant="contained" color="secondary" onClick={handleViewTransactions}>
              View Transaction History
            </Button>
          </Grid>
        </Grid>
      </form>
      {balance !== null && (
        <Box mt={3}>
          <Typography variant="h6">
            Current Balance: ₹{balance}
          </Typography>
        </Box>
      )}
      {showTransactions && (
        <Box mt={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Receiver ID</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionid}>
                  <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.receiver}</TableCell>
                  <TableCell>{transaction.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Transaction;
