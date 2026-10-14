import React from 'react';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Chip, Container } from '@mui/material';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const TopContent = () => (
    <Box sx={{ bgcolor: 'primary.light', color: 'white', py: 6, mb: 4, borderRadius: '0 0 24px 24px' }}>
      <Container maxWidth="xl">
        <Typography variant="h3" fontWeight={800} mb={2}>
          Search Results
        </Typography>
        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9 }}>
          Showing results for "{query}"
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Popular searches:</Typography>
          {['Nike Air Max', 'Running Shoes', 'Sneakers', 'Discounted'].map(term => (
            <Chip key={term} label={term} size="small" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }} clickable />
          ))}
        </Box>
      </Container>
    </Box>
  );

  return (
    <ProductListingLayout 
      title={`Results for "${query}"`}
      breadcrumbItems={[{ label: 'Search Results' }]}
      baseFilters={{ q: query }}
      topContent={<TopContent />}
      emptyStateTitle="No shoes found"
      emptyStateDesc="We couldn't find anything matching your search. Try adjusting your query or check out our popular products."
    />
  );
}
