import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

export default function ErrorState({ 
  title = 'Something went wrong', 
  description = 'We encountered an error while trying to load the data.', 
  onRetry 
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
        bgcolor: 'error.light',
        borderRadius: 4,
        color: 'error.dark'
      }}
    >
      <ErrorOutline sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 400, mb: 4 }}>
        {description}
      </Typography>
      
      {onRetry && (
        <Button 
          variant="contained" 
          color="error" 
          onClick={onRetry}
          sx={{ color: 'white' }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}
