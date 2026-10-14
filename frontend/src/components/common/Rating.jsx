import React from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

export default function Rating({ rating, count, showReviewsText = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
      <Star sx={{ color: '#F59E0B', fontSize: 16 }} />
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {rating}
      </Typography>
      {count !== undefined && (
        <Typography variant="body2" color="text.secondary">
          ({count}{showReviewsText ? ' reviews' : ''})
        </Typography>
      )}
    </Box>
  );
}
