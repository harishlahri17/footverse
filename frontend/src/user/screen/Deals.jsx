import React from 'react';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { Box, Typography, Container, Grid, Card } from '@mui/material';
import { LocalOfferOutlined, TimerOutlined } from '@mui/icons-material';

export default function Deals() {
  const TopContent = () => (
    <Box sx={{ bgcolor: 'error.main', color: 'white', py: 6, mb: 4, borderRadius: '0 0 24px 24px' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 4 }}>
          <Box>
            <Typography variant="h2" fontWeight={800} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalOfferOutlined fontSize="large" /> Flash Deals
            </Typography>
            <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9 }}>
              Incredible discounts on top brands. Hurry, these offers won't last long!
            </Typography>
          </Box>
          
          <Card sx={{ bgcolor: 'white', p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="error.main">24</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">HOURS</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} color="grey.300">:</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="error.main">59</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">MINUTES</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} color="grey.300">:</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="error.main">12</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">SECONDS</Typography>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );

  return (
    <ProductListingLayout 
      title="Discounted Items"
      breadcrumbItems={[{ label: 'Deals' }]}
      baseFilters={{ isDeal: true }}
      topContent={<TopContent />}
    />
  );
}
