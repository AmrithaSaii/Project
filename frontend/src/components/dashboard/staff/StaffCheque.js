import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, TextField } from '@mui/material';

const AdminPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [usernameFilter, setUsernameFilter] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      const endpoint = showAll ? 'http://localhost:8081/allChequeTransactions' : 'http://localhost:8081/pendingChequeTransactions';
      
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let fetchedTransactions = response.data.transactions || response.data.pendingTransactions;

        // Filter transactions by username if a filter is applied
        if (usernameFilter) {
          fetchedTransactions = fetchedTransactions.filter(transaction =>
            transaction.username.toLowerCase().includes(usernameFilter.toLowerCase())
          );
        }

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [showAll, usernameFilter]);

  const handleApprove = async (chequeNumber) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8081/approveChequeTransaction', { chequenumber: chequeNumber }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.chequenumber !== chequeNumber)
      );
      alert('Transaction approved successfully');
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert('Error approving transaction');
    }
  };

  const handleDecline = async (chequeNumber) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8081/declineChequeTransaction', { chequenumber: chequeNumber }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.chequenumber !== chequeNumber)
      );
      alert('Transaction declined successfully');
    } catch (error) {
      console.error('Error declining transaction:', error);
      alert('Error declining transaction');
    }
  };

  const handleShowAllTransactions = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {showAll ? 'All Cheque Transactions' : 'Pending Cheque Transactions'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleShowAllTransactions}
        style={{ marginBottom: 20 }}
      >
        {showAll ? 'Show Pending Transactions' : 'Show All Transactions'}
      </Button><br/>
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
              <TableCell>Cheque Number</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Receiver's Username</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              {!showAll && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.chequenumber}>
                <TableCell>{transaction.chequenumber}</TableCell>
                <TableCell>{transaction.username}</TableCell>
                <TableCell>{transaction.receiver}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                {!showAll && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(transaction.chequenumber)}
                      style={{ marginRight: 8 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDecline(transaction.chequenumber)}
                    >
                      Decline
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminPage;
