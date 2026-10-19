import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { CheckCircleOutlined, LocalShippingOutlined, ReceiptOutlined } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: 12, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 96, height: 96, borderRadius: '50%', bgcolor: 'success.light', color: 'success.dark', mb: 4 }}>
            <CheckCircleOutlined sx={{ fontSize: 48 }} />
          </Box>
          
          <Typography variant="h3" fontWeight={800} mb={2}>Order Confirmed!</Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Thank you for your purchase. We've received your order and are getting it ready to ship.
          </Typography>
          
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 3, mb: 4, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Order Number</Typography>
              <Typography variant="subtitle2" fontWeight={800}>#{orderId.substring(0, 8).toUpperCase()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Estimated Delivery</Typography>
              <Typography variant="subtitle2" fontWeight={800}>
                {(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              fullWidth 
              startIcon={<ReceiptOutlined />}
              onClick={() => navigate('/my-order')}
              sx={{ borderRadius: 8, py: 1.5 }}
            >
              View Order Details
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              fullWidth 
              startIcon={<LocalShippingOutlined />}
              onClick={() => navigate('/shop')}
              sx={{ borderRadius: 8, py: 1.5 }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
