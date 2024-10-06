import React ,{useState} from "react";
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Link } from "react-router-dom";
import StaffHeader from "./StaffHeader";
import StaffSidebar from "./StaffSidebar";
import StaffContent from "./StaffContent";
import StaffProfile from "./StaffProfile";
import Support from "./Support";
import History from "./History";
import StaffCheque from "./StaffCheque";
import UserStaff from "./UserStaff";

const StaffDashboard = () => {
  const drawerWidth = 240;
  const [currentView, setCurrentView] = useState('dashboard');
  const renderStaffContent = () => {
    switch (currentView) {
      case 'staffdashboard':
        return <StaffContent />;
      case 'staffuser':
        return <UserStaff />
      case 'staffcheque':
        return <StaffCheque />
      case 'transactionhistory':
        return <History />;
        case 'support':
        return <Support />;
      case 'staffprofile':
        return <StaffProfile/> 
      default:
        return <StaffContent />;
    }
  };
  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <StaffHeader />
    <StaffSidebar drawerWidth={drawerWidth} setCurrentView={setCurrentView} />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 3,
        marginTop: '64px',
        width: `calc(100% - ${drawerWidth}px)`,
      }}
    >
      <Toolbar />
      {renderStaffContent()}
    </Box>
  </Box>
  )
}

export default StaffDashboard;
