import React, { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { ThemeContextProvider } from '../../../theme/ThemeContextProvider';

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 280;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeContextProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            animation: 'fadeIn 0.3s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginTop: '64px', // height of AppBar
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeContextProvider>
  );
}
