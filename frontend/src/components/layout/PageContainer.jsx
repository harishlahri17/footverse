import React from 'react';
import { Box, Container } from '@mui/material';

export default function PageContainer({ children, maxWidth = 'xl' }) {
  return (
    <Box sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 144px)' }}>
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
}
