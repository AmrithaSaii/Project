import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  TableSortLabel,
  TablePagination,
  TextField,
  Typography
} from '@mui/material';

const AdminLoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('loanNumber');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = showAll ? 'http://localhost:8081/api/all-loans' : 'http://localhost:8081/api/pending-loans';
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error.response ? error.response.data : error.message);
      }
    };

    fetchLoans();
  }, [showAll]);

  const handleUpdateStatus = async (loanNumber, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8081/api/update-loan-status',
        { loanNumber, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoans(loans.filter(loan => loan.loanNumber !== loanNumber)); // Update the UI
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && sortDirection === 'asc';
    setOrderBy(property);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredLoans = loans.filter((loan) =>
    loan.username.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedLoans = filteredLoans.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {showAll ? 'All Loan Applications' : 'Pending Loan Applications'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAll(!showAll)}
        style={{ marginBottom: 20 }}
      >
        {showAll ? 'Show Pending Loans' : 'Show All Loans'}
      </Button>
      <TextField
        label="Filter by Username"
        variant="outlined"
        size="small"
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: 20, width: '100%' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'loanNumber'}
                  direction={orderBy === 'loanNumber' ? sortDirection : 'asc'}
                  onClick={() => handleSort('loanNumber')}
                >
                  Loan ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'loanType'}
                  direction={orderBy === 'loanType' ? sortDirection : 'asc'}
                  onClick={() => handleSort('loanType')}
                >
                  Loan Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? sortDirection : 'asc'}
                  onClick={() => handleSort('username')}
                >
                  User ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? sortDirection : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'tenure'}
                  direction={orderBy === 'tenure' ? sortDirection : 'asc'}
                  onClick={() => handleSort('tenure')}
                >
                  Tenure
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'aadharid'}
                  direction={orderBy === 'aadharid' ? sortDirection : 'asc'}
                  onClick={() => handleSort('aadharid')}
                >
                  Aadhar ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'panid'}
                  direction={orderBy === 'panid' ? sortDirection : 'asc'}
                  onClick={() => handleSort('panid')}
                >
                  PAN ID
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((loan) => (
              <TableRow key={loan.loanNumber}>
                <TableCell>{loan.loanNumber}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell>{loan.username}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.tenure}</TableCell>
                <TableCell>{loan.aadharid}</TableCell>
                <TableCell>{loan.panid}</TableCell>
                <TableCell>
                  {!showAll && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateStatus(loan.loanNumber, 'approved')}
                        style={{ marginRight: 8 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleUpdateStatus(loan.loanNumber, 'rejected')}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLoans.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Container>
  );
};

export default AdminLoanPage;
