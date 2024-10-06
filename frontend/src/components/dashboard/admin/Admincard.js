import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Container,
  Typography,TableSortLabel,TablePagination,TextField} from '@mui/material';

const AdminCard = () => {
  const [requests, setRequests] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('requestdate');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = showAll
          ? 'http://localhost:8081/api/credit-card-requests?status=all'
          : 'http://localhost:8081/api/credit-card-requests';
        
        const response = await axios.get(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching credit card requests:', error);
      }
    };

    fetchRequests();
  }, [showAll]);

  const handleApprove = async (cardId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/approve-credit-card-request', { cardId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRequests(requests.filter(request => request.cardid !== cardId));
      alert('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    }
  };

  const handleDecline = async (cardId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/decline-credit-card-request', { cardId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRequests(requests.filter(request => request.cardid !== cardId));
      alert('Request declined successfully');
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Error declining request');
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

  const filteredRequests = requests.filter((request) =>
    request.username.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedRequests = filteredRequests.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {showAll ? ' Credit Card Applications' : 'Pending Credit Card Requests'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAll(!showAll)}
        style={{ marginBottom: 20 }}
      >
        {showAll ? 'Show Pending Requests' : 'Show All '}
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
                  active={orderBy === 'cardid'}
                  direction={orderBy === 'cardid' ? sortDirection : 'asc'}
                  onClick={() => handleSort('cardid')}
                >
                  Card ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? sortDirection : 'asc'}
                  onClick={() => handleSort('username')}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'cardtype'}
                  direction={orderBy === 'cardtype' ? sortDirection : 'asc'}
                  onClick={() => handleSort('cardtype')}
                >
                  Card Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? sortDirection : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'requestdate'}
                  direction={orderBy === 'requestdate' ? sortDirection : 'asc'}
                  onClick={() => handleSort('requestdate')}
                >
                  Request Date
                </TableSortLabel>
              </TableCell>
              {!showAll && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
              <TableRow key={request.cardid}>
                <TableCell>{request.cardid}</TableCell>
                <TableCell>{request.username}</TableCell>
                <TableCell>{request.cardtype}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{new Date(request.requestdate).toLocaleDateString()}</TableCell>
                {!showAll && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(request.cardid)}
                      style={{ marginRight: 8 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDecline(request.cardid)}
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Container>
  );
};

export default AdminCard;
