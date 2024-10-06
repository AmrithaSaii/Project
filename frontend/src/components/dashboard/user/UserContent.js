import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import {
  Card,
  CardContent,
  Box,
  Divider,
  Snackbar,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const UserContent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [cardstatusOpen, setcardStatusOpen] = useState(false);
const [statusType, setStatusType] = useState("");
const [cardstatusType, setcardStatusType]=useState("");
const[Openmodal,setOpenModal]=useState("")
const [statusData, setStatusData] = useState(null);
const [cardstatusData, setcardStatusData] = useState(null);

  useEffect(() => {
    // Decode the JWT token to get the username from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  // State for loan form visibility
  const [applyLoanType, setApplyLoanType] = useState(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [aadharId, setAadharId] = useState("");
  const [panId, setPanId] = useState("");

  // State for form dialogs
  const [dialogOpen, setDialogOpen] = useState(false);

  const [content, setContent] = useState("default");
  const [homeLoanAmount, setHomeLoanAmount] = useState("");
  const [homeLoanTenure, setHomeLoanTenure] = useState("");
  const [homeLoanResult, setHomeLoanResult] = useState({
    monthlyPayment: 0,
    totalAmount: 0,
  });

  const [educationLoanAmount, setEducationLoanAmount] = useState("");
  const [educationLoanTenure, setEducationLoanTenure] = useState("");
  const [educationLoanResult, setEducationLoanResult] = useState({
    monthlyPayment: 0,
    totalAmount: 0,
  });

  const [businessLoanAmount, setBusinessLoanAmount] = useState("");
  const [businessLoanTenure, setBusinessLoanTenure] = useState("");
  const [businessLoanResult, setBusinessLoanResult] = useState({
    monthlyPayment: 0,
    totalAmount: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    type: "",
    monthlyPayment: 0,
    totalAmount: 0,
  });

  const calculateLoan = (amount, tenure) => {
    const interestRate = 0.05; // 5% annual interest rate
    const monthlyRate = interestRate / 12;
    const monthlyPayment =
      (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));
    const totalAmount = monthlyPayment * tenure;
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const handleCalculate = (type) => {
    let amount, tenure, result;
    if (type === "home") {
      amount = parseFloat(homeLoanAmount);
      tenure = parseInt(homeLoanTenure);
      result = calculateLoan(amount, tenure);
      setHomeLoanResult(result);
    } else if (type === "education") {
      amount = parseFloat(educationLoanAmount);
      tenure = parseInt(educationLoanTenure);
      result = calculateLoan(amount, tenure);
      setEducationLoanResult(result);
    } else if (type === "business") {
      amount = parseFloat(businessLoanAmount);
      tenure = parseInt(businessLoanTenure);
      result = calculateLoan(amount, tenure);
      setBusinessLoanResult(result);
    }
    setModalContent({
      type,
      monthlyPayment: result.monthlyPayment,
      totalAmount: result.totalAmount,
    });
    setModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleApplyClick = (type) => {
    setApplyLoanType(type);
    setDialogOpen(true);
  };
  const handleClose=()=>{
    setModalOpen(false);

  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setApplyLoanType(null);
    setLoanAmount("");
    setLoanTenure("");
    setAadharId("");
    setPanId("");
  };
  

  // Validation functions
  const validateAadharId = (id) => /^\d{12}$/.test(id);
  const validatePanId = (id) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(id);

  const handleApply = async () => {
    if (!validateAadharId(aadharId)) {
      alert("Invalid Aadhar ID. It must be 12 digits.");
      return;
    }

    if (!validatePanId(panId)) {
      alert("Invalid PAN ID. It must be 10 alphanumeric characters.");
      return;
    }
    const token = localStorage.getItem("token");
    try {



 // Fetch the user's loan history
 const loanHistoryResponse = await axios.get("http://localhost:8081/api/loan-history", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const loanHistory = loanHistoryResponse.data|| [];

// Check if the user already has a loan of the same type
const existingLoan = loanHistory.find(loan => loan.loanType === applyLoanType);

if (existingLoan) {
  alert(`You have already applied for a ${applyLoanType} loan.`);
  return;
}




      const response = await axios.post(
        "http://localhost:8081/api/loan-application",
        {
          loanType: applyLoanType,
          amount: loanAmount,
          tenure: loanTenure,
          aadharId,
          panId,
          username
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      alert("Loan application submitted successfully!");
      handleCloseDialog();
    } catch (error) {
      // Handle error
      console.error("There was an error applying for the loan!", error);
      alert("There was an error submitting your loan application. Please try again.");

    }
  };

  const fetchStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://localhost:8081/api/loan-status', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token to authenticate user
        },
      });
  
      // Check if there's any loan status data returned
      if (response.data && response.data.length > 0) {
        setStatusData(response.data); // Set the data in the statusData state
      } else {
        setStatusData({ error: "No loan status available for this user." });
      }
  
    } catch (error) {
      console.error("There was an error fetching the loan status!", error);
      setStatusData({ error: "Failed to fetch loan status. Please try again." });
    }
  };
    
  
  const handleOpenStatus = (type) => {
    setStatusType(type);
    fetchStatus(type);
    setStatusOpen(true);
  };
  
  const handleCloseStatus = () => {
    setStatusOpen(false);
    setStatusData(null);
  };

  const fetchCardStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://localhost:8081/api/card-status', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token to authenticate user
        },
      });
  
      // Check if there's any loan status data returned
      if (response.data && response.data.length > 0) {
        setcardStatusData(response.data); // Set the data in the statusData state
      } else {
        setcardStatusData({ error: "No card status available for this user." });
      }
  
    } catch (error) {
      console.error("There was an error fetching the card status!", error);
      setcardStatusData({ error: "Failed to fetch card status. Please try again." });
    }
  };
  
  const handleOpenCardStatus = (type) => {
    setcardStatusType(type);
    fetchCardStatus(type);
    setcardStatusOpen(true);
  };
  
  const handleCloseCardStatus = () => {
    setcardStatusOpen(false);
    setcardStatusData(null);
  };

  const [selectedCard, setSelectedCard] = useState(null);
  const [openmodal, setopenmodal]=useState(null);

  const cardDetails = {
    regular: {
      title: "Regular Card",
      description: "Regular cards are typically easy to obtain, often requiring only an average credit score for approval.They may come with low or no annual fees, making them a practical choice for managing routine expenses, although they generally offer limited or no rewards compared to more specialized credit card options.",
    },
    travel: {
      title: "Travel Card",
      description: "Travel credit cards are tailored for frequent travelers, offering benefits that enhance the travel experience and provide valuable rewards. These cards typically offer perks such as travel insurance, access to airport lounges, and rewards points or miles that can be redeemed for flights, hotel stays, and other travel-related expenses. Travel cards often include features like no foreign transaction fees, making them ideal for use abroad.",
    },
    shopping: {
      title: "Shopping Card",
      description: "Shopping credit cards provide benefits for frequent shoppers. These cards typically offer perks such as cashback, discounts, or rewards points on purchases made at specific retailers or categories, such as groceries or department stores.They may include promotional offers like introductory discounts or special financing options for large purchases.",
    }
  };

  const applyClick = (cardType) => {
    setSelectedCard(cardType);
    setopenmodal(true);
  };

  const confirmHandle = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
      setErrorMessage('');
    try {
      const token = localStorage.getItem("token");

       // Fetch user's credit card history to check for existing requests
    const historyResponse = await axios.get("http://localhost:8081/api/credit-card-history", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const creditCardHistory = historyResponse.data;

    // Check if the user already has a credit card of the same type
    const existingCard = creditCardHistory.find(card => card.cardtype === selectedCard);

    if (existingCard) {
      setErrorMessage(`You have already requested a ${selectedCard} credit card.`);
      return;
    }

      const response = await axios.post("http://localhost:8081/api/credit-card-request", {
        username,
        cardType: selectedCard
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      setSuccessMessage('Request sent successfully!');
      setErrorMessage('');
      
    } catch (error) {
      console.error('Request failed:', error);
      setErrorMessage('Failed to send request. Please try again.');
      setSuccessMessage('');
      // Handle error (e.g., show an error message)
    } finally {
      setopenmodal(false);
      setSelectedCard(null);
    }
  };
  

  const applyClose = () => {
    setopenmodal(false);
    setSelectedCard(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const renderCardInfo = () => {
    if (!selectedCard) return null;
    const { title, description } = cardDetails[selectedCard];
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </div>
    );
  };

  const renderLoanDetails = (type) => (
    <div>
      <Box display="flex" justifyContent="flex-end" className="mt-3">
      
    </Box>

      <Typography variant="h5" gutterBottom>
          Want a Loan?
          </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // Center the content within the Box
          mx: "auto", // Horizontally center the Box
          mb: 6,
          p: 2,
          width: "80%", // Adjust this value as needed
          maxWidth: 600, // Optional: sets a maximum width
          border: "2px solid #3f51b5",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f5f5f5",
          "&:hover": {
            backgroundColor: "#e3f2fd",
          },
        }}
      >
      
      <Button
  sx={{ borderRadius: 5, mr: 2 }} // Adds margin-right of 2 (default spacing is 8px * 2 = 16px)
  variant="contained"
  color="primary"
  onClick={() => handleApplyClick(type)}
>
  Apply Here
</Button>
<Button
  sx={{ borderRadius: 5 }}
  variant="contained"
  color="secondary"
  onClick={() => handleOpenStatus("loan")}
>
  Check Loan Status
</Button>

        
      </Box>
      <Grid container spacing={6} justifyContent="center">
        {/* Home Loan Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <img
              src="/images/homeloan.jpg"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Home Loan
              </Typography>
              <Typography variant="body2">
                Our home loan offers flexible terms to help you achieve your
                dream of home ownership.
              </Typography>
              {/* Home Loan Application Form */}
              <div className="mb-3">
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  value={homeLoanAmount}
                  onChange={(e) => setHomeLoanAmount(e.target.value)}
                  variant="outlined"
                />
              </div>
              <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tenure</InputLabel>
                  <Select
                    value={homeLoanTenure}
                    onChange={(e) => setHomeLoanTenure(e.target.value)}
                    label="Tenure"
                  >
                    <MenuItem value={12}>12 Months</MenuItem>
                    <MenuItem value={24}>24 Months</MenuItem>
                    <MenuItem value={36}>36 Months</MenuItem>
                    <MenuItem value={48}>48 Months</MenuItem>
                    <MenuItem value={60}>60 Months</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="mt-3"
                onClick={() => handleCalculate("home")}
              >
                Calculate
              </Button>
              <br />
            </CardContent>
          </Card>
        </Grid>

        {/* Education Loan Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <img
              src="/images/education.jpg"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Education Loan
              </Typography>
              <Typography variant="body2">
                We provide education loans with affordable interest rates to
                support your academic aspirations.
              </Typography>
              {/* Education Loan Application Form */}
              <div className="mb-3">
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  value={educationLoanAmount}
                  onChange={(e) => setEducationLoanAmount(e.target.value)}
                  variant="outlined"
                />
              </div>
              <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tenure</InputLabel>
                  <Select
                    value={educationLoanTenure}
                    onChange={(e) => setEducationLoanTenure(e.target.value)}
                    label="Tenure"
                  >
                    <MenuItem value={12}>12 Months</MenuItem>
                    <MenuItem value={24}>24 Months</MenuItem>
                    <MenuItem value={36}>36 Months</MenuItem>
                    <MenuItem value={48}>48 Months</MenuItem>
                    <MenuItem value={60}>60 Months</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="mt-3"
                onClick={() => handleCalculate("education")}
              >
                Calculate
              </Button>
              <br />
            </CardContent>
          </Card>
        </Grid>

        {/* Business Loan Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <img
              src="/images/businessloan.jpg"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Loan
              </Typography>
              <Typography variant="body2">
                Our business loan is designed to help you grow and expand your
                business with flexible financing options.
              </Typography>
              {/* Business Loan Application Form */}
              <div className="mb-3">
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  value={businessLoanAmount}
                  onChange={(e) => setBusinessLoanAmount(e.target.value)}
                  variant="outlined"
                />
              </div>
              <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tenure</InputLabel>
                  <Select
                    value={businessLoanTenure}
                    onChange={(e) => setBusinessLoanTenure(e.target.value)}
                    label="Tenure"
                  >
                    <MenuItem value={12}>12 Months</MenuItem>
                    <MenuItem value={24}>24 Months</MenuItem>
                    <MenuItem value={36}>36 Months</MenuItem>
                    <MenuItem value={48}>48 Months</MenuItem>
                    <MenuItem value={60}>60 Months</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="mt-3"
                onClick={() => handleCalculate("business")}
              >
                Calculate
              </Button>
              <br />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        className="mt-3"
        onClick={() => setContent("default")}
      >
        Back
      </Button>

      {/* Calculation Result Modal */}
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Loan Calculation Result</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For your {modalContent.type} loan:
          </DialogContentText>
          <DialogContentText>
            Monthly Payment: {formatCurrency(modalContent.monthlyPayment)}
          </DialogContentText>
          <DialogContentText>
            Total Amount: {formatCurrency(modalContent.totalAmount)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={handleCloseStatus}>
  <DialogTitle>Loan Status</DialogTitle>
  <DialogContent>
    {statusData ? (
      <div>
        {statusData.error ? (
          <Typography color="error">{statusData.error}</Typography>
        ) : (
          statusData.map((loan, index) => (
            <div key={index}>
              <Typography variant="h6">Loan Status Details:</Typography>
              <Typography>Request ID: {loan.username}</Typography>
              <Typography>Status: {loan.loanstatus}</Typography>
              <Typography>Amount: {formatCurrency(loan.amount)}</Typography>
              <Typography>Tenure: {loan.tenure} months</Typography>
              <Divider sx={{ my: 2 }} />
            </div>
          ))
        )}
      </div>
    ) : (
      <Typography>Loading...</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseStatus} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

      {/* Dialog for loan application */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Apply for {applyLoanType} Loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details to apply for the {applyLoanType} loan.
          </DialogContentText>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Loan Type</InputLabel>
              <Select
                value={applyLoanType}
                onChange={(e) => setApplyLoanType(e.target.value)}
                label="Loan Type"
              >
                <MenuItem value="HomeLoan">Home Loan</MenuItem>
                <MenuItem value="EducationLoan">Education Loan</MenuItem>
                <MenuItem value="BusinessLoan">Business Loan</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tenure</InputLabel>
              <Select
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                label="Tenure"
              >
                <MenuItem value={12}>12 Months</MenuItem>
                <MenuItem value={24}>24 Months</MenuItem>
                <MenuItem value={36}>36 Months</MenuItem>
                <MenuItem value={48}>48 Months</MenuItem>
                <MenuItem value={60}>60 Months</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Aadhar ID"
              type="text"
              fullWidth
              value={aadharId}
              onChange={(e) => setAadharId(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="PAN ID"
              type="text"
              fullWidth
              value={panId}
              onChange={(e) => setPanId(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApply} color="primary">
            Submit Application
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  const renderCreditCardDetails = () => (
    
    <div>
       <Button
  variant="contained"
  color="secondary"
  sx={{ mb: 4 }} // Adds margin-bottom of 16px (8px * 2) below the button
  className="mt-3"
  onClick={() => handleOpenCardStatus("card")}
>
  Check Status
</Button>
      <Typography variant="h5" gutterBottom>
        Credit Card Details
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Regular Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <img
              src="/images/regular.jpg"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Regular Card
              </Typography>
              <Typography variant="body2">
                The Regular Card provides essential features and benefits for
                everyday transactions. It’s perfect for daily use and simple
                rewards.
              </Typography>
              <Button variant="contained" color="primary" className="mt-3"
                onClick={() => applyClick('regular')}>
                Apply
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Travel Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <img
              src="/images/travel.jpg"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Travel Card
              </Typography>
              <Typography variant="body2">
                The Travel Card offers benefits tailored for frequent travelers,
                including travel insurance, airport lounge access, and more.
              </Typography>
              <Button variant="contained" color="primary" className="mt-3"
                onClick={() => applyClick('travel')}>
                Apply
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Shopping Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <img
              src="/images/shopping.jpg"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shopping Card
              </Typography>
              <Typography variant="body2">
                The Shopping Card comes with rewards and discounts on various
                retail purchases, making it ideal for avid shoppers.
              </Typography>
              <Button variant="contained" color="primary" className="mt-3"
                onClick={() => applyClick('shopping')}>
                Apply
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={cardstatusOpen} onClose={handleCloseCardStatus}>
  <DialogTitle>Card Status</DialogTitle>
  <DialogContent>
    {cardstatusData ? (
      <div>
        {cardstatusData.error ? (
          <Typography color="error">{cardstatusData.error}</Typography>
        ) : (
          cardstatusData.map((card, index) => (
            <div key={index}>
              <Typography variant="h6">Card Status Details:</Typography>
              <Typography>Request ID: {card.username}</Typography>
              <Typography>Status: {card.status}</Typography>
              <Typography>Type: {card.cardtype}</Typography>
              <Typography>Date: {card.requestdate}</Typography>
              <Divider sx={{ my: 2 }} />
            </div>
          ))
        )}
      </div>
    ) : (
      <Typography>Loading...</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseCardStatus} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

       {/* Calculation Result Modal */}
       <Dialog open={openmodal} onClose={applyClose}>
        <DialogContent>
          {renderCardInfo()}
        </DialogContent>
        <DialogActions>
          <Button onClick={applyClose} color="primary" >
            Close
          </Button>
          <Button onClick={confirmHandle} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="primary"
        className="mt-3"
        onClick={() => setContent("default")}
      >
        Back
      </Button>
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
    </div>
  );

  const renderContent = () => {
    switch (content) {
      case "loan":
        return renderLoanDetails();
      case "credit-card":
        return renderCreditCardDetails();
      default:
        return (
          <Grid container spacing={3} justifyContent="center">
            {/* Loan Details Card */}
            <Grid item xs={12} sm={10}>
              <Card>
                <img
                  src="/images/creditcard.jpg"
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Loan
                  </Typography>
                  <Typography variant="body1">
                    Our loan offerings cater to a variety of needs, ensuring
                    flexibility and support for our customers.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-3"
                    onClick={() => setContent("loan")}
                  >
                    View Loan Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Credit Card Details Card */}
            <Grid item xs={12} sm={10}>
              <Card>
                <img
                  src="/images/cardmapr.jpg"
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Credit Card
                  </Typography>
                  <Typography variant="body1">
                    We offer a diverse selection of credit cards designed to
                    suit different lifestyles and preferences.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-3"
                    onClick={() => setContent("credit-card")}
                  >
                    View Credit Card Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
    }
  };

  return <div className="container mt-5">{renderContent()}</div>;
};

export default UserContent;
