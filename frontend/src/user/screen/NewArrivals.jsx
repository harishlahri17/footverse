import React from 'react';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { Box, Typography, Container } from '@mui/material';

export default function NewArrivals() {
  const TopContent = () => (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 4, borderRadius: '0 0 24px 24px' }}>
      <Container maxWidth="xl">
        <Typography variant="h2" fontWeight={800} mb={2}>
          New Arrivals
        </Typography>
        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9 }}>
          Be the first to step out in the latest trends and freshest styles of the season.
        </Typography>
      </Container>
    </Box>
  );

  return (
    <ProductListingLayout 
      title="Fresh Drops"
      breadcrumbItems={[{ label: 'New Arrivals' }]}
      baseFilters={{ sort: 'newest' }}
      topContent={<TopContent />}
    />
  );
}
