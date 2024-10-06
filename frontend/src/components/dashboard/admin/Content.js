import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import axios from 'axios';
import { format } from 'date-fns'; // Import date-fns format function

const StaffContent = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [dashboardData, setDashboardData] = useState({
    transaction: 0,
    loan: 0,
    helpdesk: 0,
    users: 0, // Add users to the state
    staff: 0, // Add staff to the state
  });

  const [dailyTransactionData, setDailyTransactionData] = useState([]);

  useEffect(() => {
    // Fetch the total transactions, loans, and helpdesk feedbacks
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    // Fetch the daily transaction data
    const fetchDailyTransactionData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/dashboard/daily-transactions');
        const data = response.data;

        // Format the dates using date-fns
        const formattedData = data.map(item => ({
          day: format(new Date(item.day), 'dd-MM-yyyy'), // Format date as day-month-year
          transactions: item.transactions
        }));

        console.log('Formatted Daily Transaction Data:', formattedData); // Check the formatted data
        setDailyTransactionData(formattedData);
      } catch (error) {
        console.error('Error fetching daily transaction data:', error);
      }
    };

    fetchDashboardData();
    fetchDailyTransactionData();

    const interval = setInterval(() => {
      fetchDashboardData();
      fetchDailyTransactionData();
    }, 300000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  const transactionData = [
    { name: 'Transactions', value: dashboardData.transaction },
    { name: 'Loans', value: dashboardData.loan },
    { name: 'Feedbacks', value: dashboardData.helpdesk },
    { name: 'Users', value: dashboardData.users },
    { name: 'Staffs', value: dashboardData.staff },

  ];

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Cards displaying total counts */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#5a85e7', color: '#000000' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">{dashboardData.transaction}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#3de5b6', color: '#000000' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Loans
              </Typography>
              <Typography variant="h4">{dashboardData.loan}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#e7d15a', color: '#000000' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Feedbacks
              </Typography>
              <Typography variant="h4">{dashboardData.helpdesk}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Add a card for Total Users */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#f56476', color: '#000000' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{dashboardData.users}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Add a card for Total Staff */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#6a4c93', color: '#ffffff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Staff
              </Typography>
              <Typography variant="h4">{dashboardData.staff}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart displaying Transaction Summary */}
        <Grid item xs={12} md={6}>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Transaction Summary
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={transactionData}
                  cx="53%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Chart displaying Daily Transactions */}
        <Grid item xs={12} md={6}>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Daily Transactions
            </Typography>
            <ResponsiveContainer width="100%" height={370}>
              <BarChart
                data={dailyTransactionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="transactions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffContent;
