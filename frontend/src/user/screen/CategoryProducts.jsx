import React from 'react';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card } from '@mui/material';

export default function CategoryProducts() {
  const { categoryName = 'Mens' } = useParams();

  const TopContent = () => (
    <Box sx={{ position: 'relative', bgcolor: '#1E293B', color: 'white', py: 8, mb: 4, borderRadius: '0 0 24px 24px', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', opacity: 0.3, backgroundImage: 'url(/img/hero/hero-shoe.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }} />
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" fontWeight={800} mb={2} sx={{ textTransform: 'capitalize' }}>
          {categoryName} Footwear
        </Typography>
        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9, maxWidth: 600, mb: 4 }}>
          Discover our latest collection of {categoryName.toLowerCase()} shoes, perfectly blending comfort and cutting-edge style.
        </Typography>
        
        <Grid container spacing={2} sx={{ maxWidth: 600 }}>
          {['Running', 'Casual', 'Sports', 'Formal'].map(sub => (
            <Grid item xs={6} sm={3} key={sub}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', '&:hover': { bgcolor: 'primary.main', borderColor: 'primary.main' } }}>
                <Typography variant="body2" fontWeight="bold">{sub}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  return (
    <ProductListingLayout 
      title={`${categoryName} Shoes`}
      breadcrumbItems={[{ label: 'Categories' }, { label: categoryName }]}
      baseFilters={{ category: categoryName }}
      topContent={<TopContent />}
      hideCategoryFilter={true}
    />
  );
}
