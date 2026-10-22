import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

export default function LoadingSkeleton({ type = 'product', count = 8 }) {
  if (type === 'product') {
    return (
      <Grid container spacing={2}>
        {Array.from(new Array(count)).map((_, index) => (
          <Grid 
            key={index} 
            size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} 
            sx={{ 
              display: 'flex', 
              width: {
                xs: '100%',
                sm: 'calc(50% - 8px)',
                md: 'calc(25% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: 'calc(25% - 12px)'
              } 
            }}
          >
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={28} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="30%" height={32} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={64} sx={{ mb: 2, borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
    </Box>
  );
}
