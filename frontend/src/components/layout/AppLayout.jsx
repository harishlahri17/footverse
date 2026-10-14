import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNavigation from './MobileBottomNavigation';
import { Outlet } from 'react-router-dom';
import { ThemeContextProvider } from '../../theme/ThemeContextProvider'; // Assuming this exists or will be moved

export default function AppLayout() {
  return (
    <ThemeContextProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        {/* pb 7 is needed on mobile to not hide content behind the fixed bottom navigation */}
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: { xs: 7, md: 0 } }}>
          <Outlet />
        </Box>
        
        <Footer />
        <MobileBottomNavigation />
      </Box>
    </ThemeContextProvider>
  );
}
