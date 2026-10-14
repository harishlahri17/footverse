import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ShoppingBagOutlined } from '@mui/icons-material';

export default function EmptyState({ 
  icon = <ShoppingBagOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />, 
  title = 'No items found', 
  description = 'Looks like there are no items here right now.', 
  actionLabel, 
  onAction 
}) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 6,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 4,
        border: '1px dashed',
        borderColor: 'divider',
        minHeight: 300
      }}
    >
      {icon}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: actionLabel ? 4 : 0 }}>
        {description}
      </Typography>
      
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
