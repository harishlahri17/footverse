import React from 'react';
import { Box, Typography } from '@mui/material';
import DiscountBadge from './DiscountBadge';

export default function Price({ price, originalPrice, discountPercent, size = 'medium' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      <Typography 
        variant={size === 'large' ? 'h5' : 'h6'} 
        color="text.primary" 
        fontWeight={700}
      >
        ₹{price?.toLocaleString()}
      </Typography>
      
      {originalPrice && originalPrice > price && (
        <Typography 
          variant={size === 'large' ? 'body1' : 'body2'} 
          color="text.secondary" 
          sx={{ textDecoration: 'line-through' }}
        >
          ₹{originalPrice?.toLocaleString()}
        </Typography>
      )}
      
      {discountPercent && (
        <DiscountBadge percent={discountPercent} />
      )}
    </Box>
  );
}
