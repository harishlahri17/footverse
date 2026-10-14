import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductListingLayout from '../../components/layout/ProductListingLayout';
import { Male, Female, ChildCare, ArrowForward, CategoryOutlined } from '@mui/icons-material';

const MAIN_CATEGORIES = [
  { 
    id: 'mens', 
    label: "Men's Footwear", 
    desc: 'Engineered for performance, comfort, and rugged everyday versatility.',
    icon: <Male sx={{ fontSize: 32 }} />,
    color: '#3B82F6',
    count: 'Top Picks'
  },
  { 
    id: 'womens', 
    label: "Women's Footwear", 
    desc: 'Chic silhouettes, active trainers, and stylish all-day casual wear.',
    icon: <Female sx={{ fontSize: 32 }} />,
    color: '#EC4899',
    count: 'Trending'
  },
  { 
    id: 'kids', 
    label: "Kids' Footwear", 
    desc: 'Durable, lightweight, and fun shoes built for growing, active feet.',
    icon: <ChildCare sx={{ fontSize: 32 }} />,
    color: '#10B981',
    count: 'Popular'
  }
];

const SUB_CATEGORIES = ['All', 'Running', 'Casual', 'Sports', 'Formal', 'Sneakers'];

export default function Categories() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category') || '';
  const [selectedCat, setSelectedCat] = useState(catParam ? catParam.toLowerCase() : 'all');

  const TopContent = () => (
    <Box sx={{ bgcolor: '#0B132B', color: 'white', pt: { xs: 5, md: 8 }, pb: { xs: 6, md: 9 }, mb: 4, borderRadius: '0 0 32px 32px' }}>
      <Container maxWidth="xl">
        <Box sx={{ maxWidth: 700, mb: 5 }}>
          <Chip 
            icon={<CategoryOutlined sx={{ fontSize: 16, color: '#6EE7B7 !important' }} />} 
            label="Shop by Department" 
            sx={{ bgcolor: 'rgba(110, 231, 183, 0.1)', color: '#6EE7B7', fontWeight: 700, mb: 2, px: 1 }} 
          />
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2, letterSpacing: '-0.02em' }}>
            Footwear Categories
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Explore specialized shoes built for every athlete, lifestyle, and age group. Select a category below to filter products instantly.
          </Typography>
        </Box>

        {/* 3 Main Department Cards */}
        <Grid container spacing={3}>
          {MAIN_CATEGORIES.map((c) => {
            const isSelected = selectedCat.toLowerCase() === c.id.toLowerCase();
            return (
              <Grid item xs={12} md={4} key={c.id}>
                <Card 
                  onClick={() => {
                    setSelectedCat(isSelected ? 'all' : c.id);
                  }}
                  sx={{ 
                    p: 3,
                    borderRadius: 4,
                    cursor: 'pointer',
                    bgcolor: isSelected ? 'rgba(79, 70, 229, 0.25)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'translateY(-6px)' : 'none',
                    boxShadow: isSelected ? '0 16px 32px rgba(79, 70, 229, 0.3)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'primary.light',
                      bgcolor: isSelected ? 'rgba(79, 70, 229, 0.3)' : 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: `${c.color}20`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.icon}
                    </Box>
                    <Chip label={c.count} size="small" sx={{ bgcolor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h5" fontWeight={800} mb={1}>
                    {c.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, mb: 3 }}>
                    {c.desc}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Button 
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                      {isSelected ? "Filtering Active" : "Filter Here"}
                    </Button>
                    <Button 
                      size="small"
                      color="inherit"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/category/${c.id}`);
                      }}
                      endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                      sx={{ textTransform: 'none', fontWeight: 600, color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}
                    >
                      Dedicated Page
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick pill filter */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 4, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mr: 1, fontWeight: 600 }}>Quick Filter:</Typography>
          <Chip 
            label="All Categories" 
            clickable 
            onClick={() => setSelectedCat('all')} 
            sx={{ 
              bgcolor: selectedCat === 'all' ? 'white' : 'rgba(255,255,255,0.1)', 
              color: selectedCat === 'all' ? 'text.primary' : 'white',
              fontWeight: 700
            }} 
          />
          {MAIN_CATEGORIES.map(c => (
            <Chip 
              key={c.id} 
              label={c.label.replace(' Footwear', '')} 
              clickable 
              onClick={() => setSelectedCat(c.id)}
              sx={{ 
                bgcolor: selectedCat.toLowerCase() === c.id.toLowerCase() ? 'primary.main' : 'rgba(255,255,255,0.1)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
          ))}
        </Box>
      </Container>
    </Box>
  );

  const activeCategoryObj = MAIN_CATEGORIES.find(c => c.id === selectedCat);

  return (
    <ProductListingLayout 
      title={selectedCat === 'all' ? "All Shoes by Category" : `${activeCategoryObj?.label || selectedCat} Collection`}
      breadcrumbItems={[{ label: 'Categories', path: '/categories' }, ...(selectedCat !== 'all' ? [{ label: activeCategoryObj?.label || selectedCat }] : [])]}
      baseFilters={selectedCat !== 'all' ? { category: selectedCat } : {}}
      topContent={<TopContent />}
    />
  );
}
