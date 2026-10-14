import React from 'react';
import { Chip } from '@mui/material';

export default function DiscountBadge({ percent, label, color = 'success' }) {
  if (!percent && !label) return null;
  
  return (
    <Chip 
      label={label || `${percent}% OFF`} 
      size="small" 
      color={color}
      sx={{ 
        height: 20, 
        fontSize: '0.7rem', 
        fontWeight: 700,
        bgcolor: color === 'success' ? '#10B981' : undefined
      }} 
    />
  );
}
