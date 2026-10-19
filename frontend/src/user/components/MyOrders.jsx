import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Tabs, Tab, Card, Chip, 
  Button, Grid, Divider, CircularProgress, useTheme, useMediaQuery
} from '@mui/material';
import { LocalShippingOutlined, InfoOutlined, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function MyOrders() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await BaseUrl.get('/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.Success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
    if (token) fetchOrders();
  }, [token]);

  const getFilteredOrders = () => {
    if (tabValue === 0) return orders;
    const filterMap = {
      1: ['placed', 'confirmed', 'packed', 'assigned'],
      2: ['shipped', 'out_for_delivery'],
      3: ['delivered', 'reached_customer'],
      4: ['cancelled'],
      5: ['returned']
    };
    return orders.filter(o => filterMap[tabValue].includes(o.orderStatus));
  };

  const getStatusColor = (status) => {
    if (['delivered', 'reached_customer'].includes(status)) return 'success';
    if (['cancelled', 'returned'].includes(status)) return 'error';
    if (['shipped', 'out_for_delivery'].includes(status)) return 'info';
    return 'warning'; // placed, confirmed, packed
  };

  const filteredOrders = getFilteredOrders();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', pb: 10 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Breadcrumb items={[{ label: 'My Orders' }]} />
        <Typography variant="h3" fontWeight={800} mt={2} mb={4}>My Orders</Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, overflowX: 'auto' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, val) => setTabValue(val)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            {TABS.map((tab, idx) => <Tab key={idx} label={tab} sx={{ fontWeight: 700 }} />)}
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px solid #E5E7EB' }}>
            <Box sx={{ width: 80, height: 80, bgcolor: 'grey.100', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <InfoOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h5" fontWeight={800} mb={1}>No orders found</Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>You don't have any orders in this category yet.</Typography>
            <Button variant="contained" onClick={() => navigate('/shop')} sx={{ borderRadius: 8, px: 4 }}>Start Shopping</Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredOrders.map(order => (
              <Grid item xs={12} key={order._id}>
                <Card sx={{ p: 0, borderRadius: 4, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Header */}
                  <Box sx={{ bgcolor: 'grey.50', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, borderBottom: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, flexWrap: 'wrap', width: '100%' }}>
                      <Box sx={{ flex: { xs: '1 1 45%', md: 'none' } }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>ORDER PLACED</Typography>
                        <Typography variant="body2" fontWeight={700}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 45%', md: 'none' } }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL</Typography>
                        <Typography variant="body2" fontWeight={700}>₹{order.total}</Typography>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: 'none' }, mt: { xs: 1, md: 0 } }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>ORDER #</Typography>
                        <Typography variant="body2" fontWeight={700}>{order._id.toUpperCase()}</Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={order.orderStatus.replaceAll('_', ' ').toUpperCase()} 
                      color={getStatusColor(order.orderStatus)} 
                      sx={{ fontWeight: 'bold' }} 
                    />
                  </Box>

                  {/* Body */}
                  <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { xs: 'stretch', md: 'center' } }}>
                    
                    {/* Items List */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {order.items.slice(0, 2).map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Box sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, bgcolor: 'grey.100', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.productId?.productImage?.[0]?.url ? (
                               <img src={`http://localhost:5000/media/products/${item.productId.productImage[0].url}`} alt="product" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            ) : (
                               <img src="/placeholder-shoe.png" alt="product" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            )}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.5, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                              {item.productId?.productName || "Product Unavailable"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Size: {item.size} | Color: <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', bgcolor: item.color || 'black', ml: 0.5, border: '1px solid #ccc', verticalAlign: 'middle' }}/>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={0.5}>Qty: {item.qty}</Typography>
                          </Box>
                        </Box>
                      ))}
                      {order.items.length > 2 && (
                        <Typography variant="body2" color="primary.main" fontWeight={700}>+ {order.items.length - 2} more items</Typography>
                      )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', md: 'column' }, gap: 2, minWidth: { md: 200 } }}>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        startIcon={<LocalShippingOutlined />}
                        onClick={() => navigate(`/order-details/${order._id}`)}
                        sx={{ borderRadius: 8 }}
                      >
                        Track Order
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => navigate(`/order-details/${order._id}`)}
                        sx={{ borderRadius: 8 }}
                      >
                        View Details
                      </Button>
                    </Box>

                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}