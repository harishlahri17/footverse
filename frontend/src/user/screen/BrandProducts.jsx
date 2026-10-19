import React from 'react';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Avatar } from '@mui/material';

export default function BrandProducts() {
  const { brandName = 'Nike' } = useParams();

  const TopContent = () => (
    <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 4, borderRadius: '0 0 24px 24px' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'white', color: 'text.primary', fontSize: '2rem', fontWeight: 800, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            {brandName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight={800} mb={1} sx={{ textTransform: 'capitalize' }}>
              {brandName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Shop the official {brandName} collection. Experience innovation, quality, and timeless design trusted by athletes worldwide.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );

  return (
    <ProductListingLayout 
      title={`All ${brandName} Products`}
      breadcrumbItems={[{ label: 'Brands' }, { label: brandName }]}
      baseFilters={{ brand: brandName }}
      topContent={<TopContent />}
      hideBrandFilter={true}
    />
  );
}
