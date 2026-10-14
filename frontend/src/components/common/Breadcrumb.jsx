import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" sx={{ color: 'text.secondary' }} />} 
        aria-label="breadcrumb"
      >
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/home')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}
        >
          Home
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return isLast ? (
            <Typography key={item.label} variant="body2" color="text.primary" fontWeight={600}>
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.label}
              component="button"
              variant="body2"
              onClick={() => item.path && navigate(item.path)}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
