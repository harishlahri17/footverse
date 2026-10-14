import React from 'react';
import { Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import { Menu as MenuIcon, ShoppingBagOutlined, FavoriteBorder, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function MobileHeader() {
  const navigate = useNavigate();

  return (
    <Toolbar sx={{ height: 64, justifyContent: 'space-between', px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ fontWeight: 800, cursor: 'pointer', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          onClick={() => navigate('/home')}
        >
          FootVerse
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton color="inherit" size="small" onClick={() => navigate('/shop')}>
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={() => navigate('/wishlist')}>
          <FavoriteBorder />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={() => navigate('/shop-cart')}>
          <Badge badgeContent={3} color="error">
            <ShoppingBagOutlined />
          </Badge>
        </IconButton>
      </Box>
    </Toolbar>
  );
}
