import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { 
  HomeOutlined, 
  CategoryOutlined, 
  ShoppingBagOutlined, 
  FavoriteBorder, 
  PersonOutlined 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getValue = () => {
    if (location.pathname.startsWith('/home')) return 0;
    if (location.pathname.startsWith('/shop')) return 1;
    if (location.pathname.startsWith('/shop-cart')) return 2;
    if (location.pathname.startsWith('/wishlist')) return 3;
    if (location.pathname.startsWith('/account')) return 4;
    return 0; // default
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100,
        display: { xs: 'block', md: 'none' },
        pb: 'env(safe-area-inset-bottom)' // support for iOS safe area
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={getValue()}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0: navigate('/home'); break;
            case 1: navigate('/shop'); break;
            case 2: navigate('/shop-cart'); break;
            case 3: navigate('/wishlist'); break;
            case 4: navigate('/account'); break;
            default: break;
          }
        }}
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeOutlined />} />
        <BottomNavigationAction label="Shop" icon={<CategoryOutlined />} />
        <BottomNavigationAction label="Cart" icon={<ShoppingBagOutlined />} />
        <BottomNavigationAction label="Wishlist" icon={<FavoriteBorder />} />
        <BottomNavigationAction label="Account" icon={<PersonOutlined />} />
      </BottomNavigation>
    </Paper>
  );
}
