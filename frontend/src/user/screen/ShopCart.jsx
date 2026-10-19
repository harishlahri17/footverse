import React, { useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Button, IconButton, 
  useTheme, useMediaQuery, Divider, Card, TextField,
  Paper, LinearProgress, Chip
} from '@mui/material';
import { 
  DeleteOutlined, FavoriteBorder, Add, Remove, 
  LocalShippingOutlined, SecurityOutlined, ShoppingCartOutlined,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/cartContext';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function ShopCart() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { cart, fetchCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const getPrice = (product) => {
    if (!product) return 0;
    if (product.discount?.isDiscount) {
      return product.discount.finalPrice || product.price;
    }
    return product.price || 0;
  };

  const subtotal = cart.reduce((acc, item) => acc + getPrice(item.productId) * item.qty, 0);
  const FREE_SHIPPING_THRESHOLD = 2000;
  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? 150 : 0;
  const discount = subtotal > 5000 ? 500 : 0; // Promotional discount logic
  const total = subtotal + shipping - discount;

  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  if (cart.length === 0) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ width: 120, height: 120, bgcolor: 'primary.light', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
            <ShoppingCartOutlined sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
          <Typography variant="h3" fontWeight={800} mb={2}>Your cart is empty</Typography>
          <Typography variant="h6" color="text.secondary" mb={4} sx={{ maxWidth: 500, mx: 'auto' }}>
            Looks like you haven't added anything to your cart yet. Let's change that!
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/shop')}
            sx={{ borderRadius: 8, px: 6, py: 1.5, fontSize: '1.1rem' }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>
    );
  }

  const OrderSummary = ({ isSticky = false }) => (
    <Card elevation={isSticky ? 0 : 2} sx={{ p: { xs: 2, md: 4 }, borderRadius: isSticky ? 0 : 4, border: isSticky ? 'none' : '1px solid #E5E7EB' }}>
      <Typography variant="h6" fontWeight={800} mb={3}>Order Summary</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography color="text.secondary">Subtotal</Typography>
        <Typography fontWeight={700}>₹ {subtotal.toLocaleString()}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography color="text.secondary">Discount</Typography>
        <Typography fontWeight={700} color="success.main">
          {discount > 0 ? `-₹ ${discount.toLocaleString()}` : '₹ 0'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography color="text.secondary">Shipping</Typography>
        <Typography fontWeight={700} color={shipping === 0 ? 'success.main' : 'text.primary'}>
          {shipping === 0 ? 'FREE' : `₹ ${shipping.toLocaleString()}`}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5" fontWeight={800}>Total</Typography>
        <Typography variant="h5" fontWeight={800} color="primary.main">₹ {total.toLocaleString()}</Typography>
      </Box>

      {/* Coupon */}
      {!isSticky && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Enter coupon code</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" placeholder="FOOTVERSE10" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Button variant="outlined" sx={{ borderRadius: 2, px: 3 }}>Apply</Button>
          </Box>
        </Box>
      )}

      <Button 
        variant="contained" 
        fullWidth 
        size="large" 
        onClick={() => navigate('/checkout')}
        endIcon={<ArrowForward />}
        sx={{ borderRadius: 8, py: 1.5, fontSize: '1.1rem', mb: 2 }}
      >
        Proceed to Checkout
      </Button>

      {!isSticky && (
        <Button 
          variant="text" 
          fullWidth 
          onClick={() => navigate('/shop')}
          sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
        >
          Continue Shopping
        </Button>
      )}

      {/* Secure Checkout Indicator */}
      {!isSticky && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 3, color: 'success.main' }}>
          <SecurityOutlined fontSize="small" />
          <Typography variant="caption" fontWeight={700}>SECURE CHECKOUT</Typography>
        </Box>
      )}
    </Card>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', pb: isMobile ? 32 : 10 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Breadcrumb items={[{ label: 'My Cart' }]} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, mt: 2 }}>
          <Typography variant="h3" fontWeight={800}>My Cart</Typography>
          <Chip label={`${cart.length} items`} color="primary" sx={{ fontWeight: 'bold' }} />
        </Box>

        <Grid container spacing={4}>
          {/* LEFT: CART ITEMS */}
          <Grid item xs={12} lg={8}>
            
            {/* Free Shipping Progress */}
            <Card sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #E5E7EB', bgcolor: 'primary.light', color: 'primary.dark' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocalShippingOutlined />
                {amountToFreeShipping > 0 ? (
                  <Typography variant="subtitle1" fontWeight={700}>
                    Add <Typography component="span" fontWeight={800} color="error.main">₹{amountToFreeShipping}</Typography> more for FREE Shipping!
                  </Typography>
                ) : (
                  <Typography variant="subtitle1" fontWeight={700} color="success.dark">
                    Congratulations! You've unlocked FREE Shipping.
                  </Typography>
                )}
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressToFreeShipping} 
                sx={{ 
                  height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.5)',
                  '& .MuiLinearProgress-bar': { bgcolor: progressToFreeShipping === 100 ? 'success.main' : 'primary.main' }
                }} 
              />
            </Card>

            {/* Cart List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cart.map((item, index) => {
                const product = item.productId;
                if (!product) return null;
                
                const imgUrl = product.productImage?.[0]?.url 
                  ? `http://localhost:5000/media/products/${product.productImage[0].url}` 
                  : '/placeholder-shoe.png';
                
                const currentPrice = getPrice(product);

                return (
                  <Card key={`${product._id}-${item.size}-${index}`} sx={{ display: 'flex', flexDirection: 'row', p: { xs: 1.5, sm: 3 }, borderRadius: 4, border: '1px solid #E5E7EB', position: 'relative', alignItems: 'center' }}>
                    
                    {/* Image */}
                    <Box 
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      sx={{ 
                        width: { xs: 80, sm: 160 }, height: { xs: 80, sm: 160 }, flexShrink: 0,
                        bgcolor: 'grey.50', borderRadius: 3, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mr: { xs: 1.5, sm: 3 }
                      }}
                    >
                      <img src={imgUrl} alt={product.productName} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    </Box>

                    {/* Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box onClick={() => navigate(`/product-details/${product._id}`)} sx={{ cursor: 'pointer' }}>
                          <Typography variant="subtitle2" color="primary.main" fontWeight={800} sx={{ textTransform: 'uppercase', mb: 0.5 }}>{product.brand || 'FootVerse'}</Typography>
                          <Typography variant="h6" fontWeight={800} sx={{ mb: 1, lineHeight: 1.2 }}>{product.productName}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">₹{currentPrice}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Size: <Typography component="span" fontWeight={700} color="text.primary">{item.size}</Typography>
                        </Typography>
                        {product.color && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">Color:</Typography>
                            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: product.color, border: '1px solid #E5E7EB' }} />
                          </Box>
                        )}
                      </Box>

                      {/* Controls */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: 8, p: 0.5 }}>
                          <IconButton onClick={() => decreaseQty(product._id, item.size)} size="small" sx={{ p: {xs: 0.25, sm: 0.5} }}><Remove fontSize="small" /></IconButton>
                          <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold', fontSize: {xs: '0.875rem', sm: '1rem'} }}>{item.qty}</Typography>
                          <IconButton onClick={() => increaseQty(product._id, item.size)} size="small" sx={{ p: {xs: 0.25, sm: 0.5} }}><Add fontSize="small" /></IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', gap: {xs: 0.5, sm: 1} }}>
                          <IconButton size="small" sx={{ color: 'text.secondary' }}><FavoriteBorder fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => removeFromCart(product._id, item.size)}><DeleteOutlined fontSize="small" /></IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Grid>

          {/* RIGHT: ORDER SUMMARY (DESKTOP) */}
          {!isMobile && (
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 120 }}>
                <OrderSummary />

                <Card sx={{ mt: 3, p: 3, borderRadius: 4, bgcolor: 'grey.50', border: '1px solid #E5E7EB' }}>
                  <Typography variant="subtitle2" fontWeight={700} mb={1}>Estimated Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get it by <Typography component="span" fontWeight={700} color="text.primary">{(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Typography>
                  </Typography>
                </Card>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* MOBILE STICKY BOTTOM SUMMARY */}
      {isMobile && (
        <Paper elevation={16} sx={{ position: 'fixed', bottom: { xs: 56, md: 0 }, left: 0, right: 0, zIndex: 100, borderTopRadius: 16 }}>
          <OrderSummary isSticky={true} />
        </Paper>
      )}
    </Box>
  );
}
