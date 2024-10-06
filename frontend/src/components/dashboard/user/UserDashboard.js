import React, {useState} from "react";
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Link } from "react-router-dom";
import Userprofile from "./Userprofile";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import UserContent from "./UserContent";
                      import Cheque from "./Cheque";
import Loan from "./Loan";
import Helpdesk from "./Helpdesk";
import Transaction from "./Transaction";

const UserDashboard = () => {

  const drawerWidth = 240;
  const [currentView, setCurrentView] = useState('dashboard');

  const renderUserContent = () => {
    switch (currentView) {
      case 'userdashboard':
        return <UserContent />;
      case 'cheque':
        return <Cheque />
      
      case 'loan':
        return <Loan />;
        case 'help':
        return <Helpdesk />;
        case 'transaction':
        return <Transaction />;
        case 'profile':
          return <Userprofile/>
        
      default:
        return <UserContent />;
    }
  };
  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <UserHeader />
    <UserSidebar drawerWidth={drawerWidth} setCurrentView={setCurrentView} />
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
      {renderUserContent()}
    </Box>
  </Box>
  )
}
export default UserDashboard;
