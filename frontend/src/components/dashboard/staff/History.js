import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, TextField } from '@mui/material';

const AdminTransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [usernameFilter, setUsernameFilter] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8081/allTransactionHistory', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.username.toLowerCase().includes(usernameFilter.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        User Transaction History
      </Typography>
      <TextField
        label="Filter by Username"
        variant="outlined"
        value={usernameFilter}
        onChange={(e) => setUsernameFilter(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Receiver's Username</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.transactionid}>
                <TableCell>{transaction.transactionid}</TableCell>
                <TableCell>{transaction.username}</TableCell>
                <TableCell>{transaction.receiver}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.transaction_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminTransactionHistoryPage;
