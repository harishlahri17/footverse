import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Card, Grid, Divider, Button, 
  Stepper, Step, StepLabel, CircularProgress, Chip, useTheme, useMediaQuery
} from '@mui/material';
import { 
  LocalShippingOutlined, AssignmentReturnOutlined, 
  ReceiptOutlined, ReplayOutlined, CancelOutlined 
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/common/Breadcrumb';

const STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderDetails() {
  const { orderId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await BaseUrl.get(`/track-order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.Success) {
        setOrder(data.order);
      } else {
        toast.error("Failed to fetch order details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Order not found");
      navigate('/track-order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
    if (token) fetchOrder();
  }, [token, orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) return null;

  // Calculate active step
  const activeStep = STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const isReturned = order.orderStatus === 'returned';

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await BaseUrl.put('/order-status', { orderId: order._id, status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.Success) {
        toast.success("Order cancelled successfully");
        fetchOrder();
      }
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  const handleReturnOrder = async () => {
    if (!window.confirm("Are you sure you want to return this order?")) return;
    try {
      const res = await BaseUrl.put('/order-status', { orderId: order._id, status: 'returned' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.Success) {
        toast.success("Return request initiated");
        fetchOrder();
      }
    } catch (err) {
      toast.error("Failed to return order");
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', pb: 10 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Breadcrumb items={[{ label: 'My Orders', path: '/track-order' }, { label: `Order #${order._id.slice(0,8).toUpperCase()}` }]} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mt: 2, mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight={800}>Order Details</Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Order #{order._id.toUpperCase()} • Placed on {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {['placed', 'pending'].includes(order.orderStatus) && (
              <Button variant="outlined" color="error" startIcon={<CancelOutlined />} onClick={handleCancelOrder}>Cancel Order</Button>
            )}
            {order.orderStatus === 'delivered' && (
              <Button variant="outlined" color="primary" startIcon={<AssignmentReturnOutlined />} onClick={handleReturnOrder}>Return Product</Button>
            )}
            <Button variant="outlined" startIcon={<ReceiptOutlined />}>Invoice</Button>
          </Box>
        </Box>

        {/* TRACKING TIMELINE */}
        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, border: '1px solid #E5E7EB' }}>
          <Typography variant="h5" fontWeight={800} mb={4}>Track Order</Typography>
          
          {isCancelled || isReturned ? (
             <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'error.light', color: 'error.dark', borderRadius: 2 }}>
               <Typography variant="h6" fontWeight={800}>This order has been {order.orderStatus}.</Typography>
             </Box>
          ) : (
            <Stepper 
              activeStep={activeStep !== -1 ? activeStep : STEPS.length} 
              alternativeLabel={!isMobile} 
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{ mb: 2 }}
            >
              {STEPS.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography fontWeight={index <= activeStep ? 800 : 500} sx={{ textTransform: 'capitalize' }}>
                      {label.replace('_', ' ')}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* Tracking History Log */}
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #E5E7EB' }}>
            <Typography variant="subtitle1" fontWeight={800} mb={2}>Tracking History</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[...order.trackingHistory].reverse().map((hist, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: idx === 0 ? 'primary.main' : 'grey.400', mt: 0.5 }} />
                    {idx !== order.trackingHistory.length - 1 && <Box sx={{ width: 2, height: 40, bgcolor: 'grey.300', mt: 0.5 }} />}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>{hist.status.replace('_', ' ')}</Typography>
                    <Typography variant="body2" color="text.secondary">{hist.location}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(hist.updatedAt).toLocaleString()}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        <Grid container spacing={4}>
          {/* ITEMS */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: '1px solid #E5E7EB' }}>
              <Typography variant="h5" fontWeight={800} mb={3}>Items in this Order</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {order.items.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, pb: 3, borderBottom: idx !== order.items.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                    <Box sx={{ width: { xs: '100%', sm: 120 }, height: 120, bgcolor: 'grey.50', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.productId?.productImage?.[0]?.url ? (
                        <img src={`http://localhost:5000/media/products/${item.productId.productImage[0].url}`} alt="product" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                      ) : (
                        <img src="/placeholder-shoe.png" alt="product" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={800}>{item.productId?.productName || "Product Unavailable"}</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main">₹{item.price}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Size: {item.size} | Color: <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', bgcolor: item.color || 'black', ml: 0.5, border: '1px solid #ccc' }}/>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>Qty: {item.qty}</Typography>
                      <Button variant="text" startIcon={<ReplayOutlined />} sx={{ mt: 2, p: 0, fontWeight: 700 }} onClick={() => navigate(`/product-details/${item.productId?._id}`)}>
                        Buy Again
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* SUMMARY & ADDRESS */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #E5E7EB' }}>
                <Typography variant="h6" fontWeight={800} mb={3}>Order Summary</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={700}>₹ {order.subtotal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Discount</Typography>
                  <Typography fontWeight={700} color="success.main">-₹ {order.discount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={700}>₹ {order.shipping}</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={800}>Total</Typography>
                  <Typography variant="h6" fontWeight={800} color="primary.main">₹ {order.total}</Typography>
                </Box>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>{order.paymentMode}</Typography>
                </Box>
              </Card>

              <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #E5E7EB' }}>
                <Typography variant="h6" fontWeight={800} mb={3}>Shipping Address</Typography>
                <Typography variant="subtitle2" fontWeight={800}>{order.fullName || order.address?.fullName || "User"}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {order.address?.area}, {order.address?.postOffice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.address?.city}, {order.address?.district}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.address?.state} - {order.address?.pinCode}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Phone: {order.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {order.email}
                </Typography>
              </Card>

            </Box>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
