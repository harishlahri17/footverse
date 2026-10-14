import React from 'react';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { Box, Typography, Container } from '@mui/material';

export default function BestSellers() {
  const TopContent = () => (
    <Box sx={{ bgcolor: '#F59E0B', color: 'white', py: 6, mb: 4, borderRadius: '0 0 24px 24px' }}>
      <Container maxWidth="xl">
        <Typography variant="h2" fontWeight={800} mb={2}>
          Best Sellers
        </Typography>
        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9 }}>
          Our most loved and highly-rated footwear, chosen by thousands of happy customers.
        </Typography>
      </Container>
    </Box>
  );

  return (
    <ProductListingLayout 
      title="Top Rated Products"
      breadcrumbItems={[{ label: 'Best Sellers' }]}
      baseFilters={{ sort: 'rating' }}
      topContent={<TopContent />}
    />
  );
}
