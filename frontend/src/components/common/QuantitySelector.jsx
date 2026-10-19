import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

export default function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1, max = 10 }) {
  return (
    <Box 
      sx={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <IconButton 
        onClick={onDecrease} 
        disabled={quantity <= min}
        size="small"
        sx={{ borderRadius: 2, p: 1 }}
      >
        <Remove fontSize="small" />
      </IconButton>
      
      <Typography variant="body2" sx={{ px: 2, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>
      
      <IconButton 
        onClick={onIncrease} 
        disabled={quantity >= max}
        size="small"
        sx={{ borderRadius: 2, p: 1 }}
      >
        <Add fontSize="small" />
      </IconButton>
    </Box>
  );
}
