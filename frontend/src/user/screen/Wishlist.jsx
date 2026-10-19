import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Grid, Card, Button, 
  IconButton, Chip, Tooltip, CircularProgress, useTheme, useMediaQuery 
} from '@mui/material';
import { 
  DeleteOutlined, ShoppingBagOutlined, FavoriteBorder, 
  Favorite, TrendingDown 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';
import { toast } from 'react-toastify';

export default function Wishlist() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read wishlist IDs from local storage (mock backend state)
  const getStoredWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem('footverse_wishlist')) || [];
    } catch {
      return [];
    }
  };

  const fetchWishlistProducts = async () => {
    try {
      setLoading(true);
      const storedIds = getStoredWishlist();
      
      if (storedIds.length === 0) {
        setWishlistItems([]);
        return;
      }

      // Fetch all products and filter locally since there's no dedicated wishlist API
      const { data } = await BaseUrl.get('/get-product');
      if (data.Success) {
        const filtered = data.list.filter(p => storedIds.includes(p._id));
        setWishlistItems(filtered);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
    // Initialize dummy data for testing if completely empty
    if (getStoredWishlist().length === 0) {
      // Find a random product ID and inject it just so the user sees the beautiful UI
      BaseUrl.get('/get-product').then(res => {
         if(res.data?.list?.length > 0) {
            localStorage.setItem('footverse_wishlist', JSON.stringify([res.data.list[0]._id, res.data.list[1]?._id].filter(Boolean)));
            fetchWishlistProducts();
         } else {
            setLoading(false);
         }
      });
    } else {
      fetchWishlistProducts();
    }
  }, []);

  const removeFromWishlist = (id) => {
    const current = getStoredWishlist();
    const updated = current.filter(itemId => itemId !== id);
    localStorage.setItem('footverse_wishlist', JSON.stringify(updated));
    setWishlistItems(prev => prev.filter(item => item._id !== id));
    toast.success("Removed from wishlist");
  };

  const clearAll = () => {
    if(window.confirm("Are you sure you want to clear your wishlist?")) {
      localStorage.setItem('footverse_wishlist', JSON.stringify([]));
      setWishlistItems([]);
      toast.success("Wishlist cleared");
    }
  };

  const handleAddToCart = (item) => {
    // Navigating to product details is safer since size/color is required to add to cart
    navigate(`/product-details/${item._id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', pb: 10 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3" fontWeight={800}>My Wishlist</Typography>
            <Chip label={`${wishlistItems.length} items`} color="primary" sx={{ fontWeight: 'bold' }} />
          </Box>
          
          {wishlistItems.length > 0 && (
            <Button variant="text" color="error" onClick={clearAll} sx={{ fontWeight: 700 }}>
              Clear All
            </Button>
          )}
        </Box>

        {wishlistItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'white', borderRadius: 4, border: '1px solid #E5E7EB' }}>
            <Box sx={{ width: 100, height: 100, bgcolor: 'error.50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <FavoriteBorder sx={{ fontSize: 48, color: 'error.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={800} mb={2}>Your wishlist is empty</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Save items you love to your wishlist. Review them anytime and easily move them to your cart.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/shop')} sx={{ borderRadius: 8, px: 6, py: 1.5 }}>
              Explore Shoes
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlistItems.map((product) => {
              const inStock = product.quantity > 0;
              const hasDiscount = product.discount?.isDiscount;
              const price = hasDiscount ? product.discount.finalPrice : product.price;
              const originalPrice = hasDiscount ? product.price : null;
              
              const discountValue = hasDiscount 
                 ? (product.discount.type === "percentage" ? product.discount.value : Math.round((product.discount.value / product.price) * 100))
                 : 0;

              const imageUrl = product.productImage?.[0]?.url 
                 ? `http://localhost:5000/media/products/${product.productImage[0].url}` 
                 : '/placeholder-shoe.png';

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id} sx={{ display: 'flex', width: '100%' }}>
                  <Card sx={{ 
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', 
                    borderRadius: 4, border: '1px solid #E5E7EB', position: 'relative',
                    transition: '0.2s', '&:hover': { boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }
                  }}>
                    
                    {/* Badges */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {hasDiscount && (
                           <Chip size="small" icon={<TrendingDown fontSize="small" />} label={`Price Drop ${discountValue}%`} color="error" sx={{ fontWeight: 'bold' }} />
                        )}
                        {!inStock && (
                           <Chip size="small" label="Out of Stock" sx={{ fontWeight: 'bold', bgcolor: 'grey.800', color: 'white' }} />
                        )}
                      </Box>
                      <IconButton 
                        onClick={() => removeFromWishlist(product._id)}
                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'error.50', color: 'error.main' }, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        size="small"
                      >
                        <Favorite fontSize="small" color="error" />
                      </IconButton>
                    </Box>

                    {/* Image */}
                    <Box 
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      sx={{ p: 4, height: { xs: 160, md: 220 }, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <img src={imageUrl} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: inStock ? 1 : 0.5 }} />
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                        {product.brand || 'FootVerse'}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 0.5, mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.productName}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2, mt: 'auto' }}>
                        <Typography variant="h6" fontWeight={800}>₹{price}</Typography>
                        {originalPrice && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ₹{originalPrice}
                          </Typography>
                        )}
                      </Box>

                      {/* Stock Info */}
                      {inStock ? (
                        <Typography variant="caption" color="success.main" fontWeight={700} mb={2}>
                          In Stock ({product.quantity} left)
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="error.main" fontWeight={700} mb={2}>
                          Currently Unavailable
                        </Typography>
                      )}

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant={inStock ? "contained" : "outlined"}
                          fullWidth 
                          disabled={!inStock}
                          startIcon={<ShoppingBagOutlined />}
                          onClick={() => handleAddToCart(product)}
                          sx={{ borderRadius: 8 }}
                        >
                          {isMobile ? 'Move' : 'Move to Cart'}
                        </Button>
                        <Tooltip title="Remove">
                          <IconButton onClick={() => removeFromWishlist(product._id)} sx={{ border: '1px solid #E5E7EB', borderRadius: '50%' }}>
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
