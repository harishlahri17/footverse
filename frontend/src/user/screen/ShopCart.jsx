import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Button, IconButton, 
  Divider, Card, TextField, Collapse
} from '@mui/material';
import { 
  DeleteOutlined, FavoriteBorder, Favorite, Add, Remove, 
  LocalShippingOutlined, SecurityOutlined, ShoppingCartOutlined,
  ArrowForward, LockOutlined, ShoppingBagOutlined,
  AccessTimeOutlined, KeyboardArrowRight,
  AutorenewOutlined, HeadsetMicOutlined, CheckCircle, LocalOfferOutlined,
  WestOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../store/cartContext';
import Breadcrumb from '../../components/common/Breadcrumb';

// Format shoe color variants nicely
const formatVariantColor = (color) => {
  if (!color) return 'White / Black';
  if (Array.isArray(color)) {
    return color.map(c => String(c).charAt(0).toUpperCase() + String(c).slice(1).toLowerCase()).join(' / ');
  }
  const str = String(color).trim();
  if (str.includes(',')) {
    return str.split(',').map(s => s.trim()).map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join(' / ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Safe Product Image Resolver
const resolveProductImage = (product) => {
  if (!product) return '/placeholder-shoe.png';
  if (product.image) return product.image;
  if (Array.isArray(product.productImage) && product.productImage.length > 0) {
    const mainImg = product.productImage.find(img => img.tag === 'main') || product.productImage[0];
    const url = typeof mainImg === 'string' ? mainImg : mainImg?.url;
    if (url) {
      if (url.startsWith('http')) return url;
      return `http://localhost:5000/media/products/${url}`;
    }
  }
  return '/placeholder-shoe.png';
};

// Pricing and discount calculator
const getProductPricing = (product) => {
  if (!product) {
    return { sellingPrice: 0, originalPrice: 0, discountPercent: 0 };
  }

  let original = product.price || 0;
  let selling = original;
  let discountPercent = 0;

  if (product.discount?.isDiscount) {
    if (product.discount.finalPrice) {
      selling = product.discount.finalPrice;
    } else if (product.discount.type === 'percentage') {
      selling = Math.round(original * (1 - product.discount.value / 100));
    } else {
      selling = Math.max(0, original - product.discount.value);
    }

    if (product.discount.type === 'percentage') {
      discountPercent = product.discount.value;
    } else {
      discountPercent = original > 0 ? Math.round(((original - selling) / original) * 100) : 0;
    }
  } else if (original > 0) {
    if (product.originalPrice && product.originalPrice > original) {
      original = product.originalPrice;
      discountPercent = Math.round(((original - selling) / original) * 100);
    } else {
      // Calculate realistic MRP markup (approx 30%) matching sneaker store pricing
      const markupRatio = 1.35;
      original = Math.round((selling * markupRatio) / 100) * 100 - 1;
      if (original <= selling) original = selling + 1000;
      discountPercent = Math.round(((original - selling) / original) * 100);
    }
  }

  return {
    sellingPrice: selling,
    originalPrice: original,
    discountPercent: discountPercent
  };
};

// Payment Brand Badges matching reference screenshot
const PaymentBadges = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
    {/* VISA */}
    <Box sx={{ 
      px: 1.2, py: 0.35, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 24
    }}>
      <Typography sx={{ fontWeight: 900, fontStyle: 'italic', fontSize: '0.8rem', color: '#1A1F71', letterSpacing: 0.5 }}>
        VISA
      </Typography>
    </Box>

    {/* Mastercard */}
    <Box sx={{ 
      px: 1, py: 0.35, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 24, gap: 0.5
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: 20, height: 13 }}>
        <Box sx={{ width: 13, height: 13, borderRadius: '50%', bgcolor: '#EB001B', position: 'absolute', left: 0 }} />
        <Box sx={{ width: 13, height: 13, borderRadius: '50%', bgcolor: '#F79E1B', position: 'absolute', right: 0, opacity: 0.88 }} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '0.62rem', color: '#1F2937' }}>
        mastercard
      </Typography>
    </Box>

    {/* UPI */}
    <Box sx={{ 
      px: 1.2, py: 0.35, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 24, gap: 0.4
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <Box sx={{ width: 0, height: 0, borderTop: '3.5px solid transparent', borderBottom: '3.5px solid transparent', borderLeft: '5.5px solid #097939' }} />
        <Box sx={{ width: 0, height: 0, borderTop: '3.5px solid transparent', borderBottom: '3.5px solid transparent', borderLeft: '5.5px solid #ED7524' }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#1F2937', letterSpacing: 0.5 }}>
        UPI
      </Typography>
    </Box>

    {/* PayPal */}
    <Box sx={{ 
      px: 1.2, py: 0.35, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 24
    }}>
      <Typography sx={{ fontWeight: 800, fontStyle: 'italic', fontSize: '0.75rem', color: '#003087' }}>
        Pay<span style={{ color: '#0079C1' }}>Pal</span>
      </Typography>
    </Box>
  </Box>
);

// 4 Bottom Trust Features Banner (Placed directly under Cart items stack)
const TrustFeaturesBanner = () => (
  <Card sx={{ 
    mt: 2.5, 
    p: { xs: 2, md: 2.2 }, 
    borderRadius: '12px', 
    bgcolor: '#FFFFFF', 
    border: '1px solid #E5E7EB',
    boxShadow: 'none'
  }}>
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
      gap: 2, 
      alignItems: 'center' 
    }}>
      {/* 1. Free Delivery */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LocalShippingOutlined sx={{ fontSize: 24, color: '#1E293B', flexShrink: 0 }} />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', lineHeight: 1.2 }}>
            Free Delivery
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', mt: 0.2 }}>
            Above ₹999
          </Typography>
        </Box>
      </Box>

      {/* 2. Secure Payments */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SecurityOutlined sx={{ fontSize: 24, color: '#1E293B', flexShrink: 0 }} />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', lineHeight: 1.2 }}>
            Secure Payments
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', mt: 0.2 }}>
            Multiple payment options
          </Typography>
        </Box>
      </Box>

      {/* 3. Easy Returns */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AutorenewOutlined sx={{ fontSize: 24, color: '#1E293B', flexShrink: 0 }} />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', lineHeight: 1.2 }}>
            Easy Returns
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', mt: 0.2 }}>
            Hassle free returns
          </Typography>
        </Box>
      </Box>

      {/* 4. 24/7 Support */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HeadsetMicOutlined sx={{ fontSize: 24, color: '#1E293B', flexShrink: 0 }} />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', lineHeight: 1.2 }}>
            24/7 Support
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', mt: 0.2 }}>
            We're here to help
          </Typography>
        </Box>
      </Box>
    </Box>
  </Card>
);

export default function ShopCart() {
  const navigate = useNavigate();
  const { cart, fetchCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  // Wishlist local storage state
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('footverse_wishlist')) || [];
    } catch {
      return [];
    }
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponExpanded, setCouponExpanded] = useState(false);

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const handleToggleWishlist = (productId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('footverse_wishlist')) || [];
      let updated;
      if (stored.includes(productId)) {
        updated = stored.filter(id => id !== productId);
        toast.info("Removed from Wishlist");
      } else {
        updated = [...stored, productId];
        toast.success("Added to Wishlist!");
      }
      localStorage.setItem('footverse_wishlist', JSON.stringify(updated));
      setWishlist(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.warning('Please enter a coupon code');
      return;
    }
    if (code === 'FOOTVERSE10' || code === 'SAVE10') {
      setAppliedCoupon({ code, percent: 10 });
      toast.success('Coupon applied: 10% Extra Discount!');
    } else if (code === 'WELCOME20') {
      setAppliedCoupon({ code, percent: 20 });
      toast.success('Coupon applied: 20% Extra Discount!');
    } else if (code === 'SAVE500') {
      setAppliedCoupon({ code, flat: 500 });
      toast.success('Coupon applied: ₹500 Flat Discount!');
    } else {
      toast.error('Invalid coupon code. Try FOOTVERSE10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  // Financial Calculations
  let subtotalMRP = 0;
  let subtotalSelling = 0;
  let totalItems = 0;

  cart.forEach(item => {
    const product = item.productId;
    if (product) {
      const qty = item.qty || 1;
      const { sellingPrice, originalPrice } = getProductPricing(product);
      subtotalMRP += originalPrice * qty;
      subtotalSelling += sellingPrice * qty;
      totalItems += qty;
    }
  });

  // Calculate product discount savings
  let productSavings = Math.max(0, subtotalMRP - subtotalSelling);

  // Calculate coupon extra savings
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.percent) {
      couponDiscount = Math.round((subtotalSelling * appliedCoupon.percent) / 100);
    } else if (appliedCoupon.flat) {
      couponDiscount = Math.min(appliedCoupon.flat, subtotalSelling);
    }
  }

  const totalDiscount = productSavings + couponDiscount;
  const shippingFee = subtotalSelling >= 999 ? 0 : (subtotalSelling > 0 ? 99 : 0);
  const finalTotal = Math.max(0, subtotalSelling - couponDiscount + shippingFee);

  // Empty Cart Screen
  if (cart.length === 0) {
    return (
      <Box sx={{ bgcolor: '#F8FAFC', minHeight: '85vh', py: 4 }}>
        <Container maxWidth={false} sx={{ maxWidth: 1380, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumb items={[{ label: 'Cart' }]} />
          
          <Box sx={{ 
            bgcolor: '#FFFFFF', 
            borderRadius: '16px', 
            border: '1px solid #E5E7EB', 
            p: { xs: 4, md: 8 }, 
            textAlign: 'center',
            my: 3
          }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#F1F5F9', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mx: 'auto', 
              mb: 3 
            }}>
              <ShoppingCartOutlined sx={{ fontSize: 40, color: '#64748B' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 1.5 }}>
              Your cart is empty
            </Typography>
            <Typography sx={{ color: '#6B7280', maxWidth: 440, mx: 'auto', mb: 4, fontSize: '0.95rem' }}>
              Looks like you haven't added anything to your cart yet. Discover trending sneakers and deals!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/shop')}
              sx={{ 
                bgcolor: '#0F172A', 
                color: '#FFFFFF', 
                borderRadius: '8px', 
                px: 5, 
                py: 1.4, 
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1E293B', boxShadow: 'none' } 
              }}
            >
              Start Shopping
            </Button>
          </Box>

          <TrustFeaturesBanner />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 10, pt: 3 }}>
      <Container maxWidth={false} sx={{ maxWidth: 1380, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        
        {/* Breadcrumb: Home > Cart */}
        <Breadcrumb items={[{ label: 'Cart' }]} />

        {/* Main Side-by-Side Flex Layout (Left Stack + Right Order Summary) */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: { xs: 3, md: 3.5, lg: 4 }, 
          alignItems: 'flex-start' 
        }}>
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Your Cart Header + Cart Items + Trust Banner */}
          {/* ======================================================== */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            
            {/* Header: "Your Cart" on Left, "← Continue Shopping" on Right */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              mb: 2.5 
            }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Your Cart
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500, mt: 0.4 }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </Typography>
              </Box>

              {/* Continue Shopping Link aligned right */}
              <Button
                onClick={() => navigate('/shop')}
                startIcon={<WestOutlined sx={{ fontSize: 15 }} />}
                sx={{
                  color: '#4B5563',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  p: 0,
                  mt: 0.5,
                  minWidth: 0,
                  '&:hover': { color: '#111827', bgcolor: 'transparent' }
                }}
              >
                Continue Shopping
              </Button>
            </Box>

            {/* Cart Items Stack */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cart.map((item, index) => {
                const product = item.productId;
                if (!product) return null;

                const imgUrl = resolveProductImage(product);
                const { sellingPrice, originalPrice, discountPercent } = getProductPricing(product);
                const isWishlisted = wishlist.includes(product._id);
                const itemTotal = sellingPrice * (item.qty || 1);

                return (
                  
                  <Card 
                    key={`${product._id}-${item.size}-${index}`}
                    sx={{ 
                      p: { xs: 2, sm: 2.2 },
                      borderRadius: '12px',
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#D1D5DB',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: { xs: 2, sm: 2 }
                    }}>
                      
                      {/* Left: Product Thumbnail & Text Information */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.2, flex: 1, minWidth: 0 }}>
                        {/* Shoe Image Box */}
                        <Box 
                          onClick={() => navigate(`/product-details/${product._id}`)}
                          sx={{ 
                            width: { xs: 90, sm: 125 },
                            height: { xs: 75, sm: 95 },
                            bgcolor: '#F9FAFB',
                            border: '1px solid #F1F5F9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: 'pointer',
                            p: 0.8,
                            overflow: 'hidden',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.02)'
                            }
                          }}
                        >
                          <img 
                            src={imgUrl} 
                            alt={product.productName} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-shoe.png'; }}
                          />
                        </Box>

                        {/* Product Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Title */}
                          <Typography 
                            onClick={() => navigate(`/product-details/${product._id}`)}
                            sx={{ 
                              fontWeight: 700, 
                              fontSize: { xs: '0.95rem', sm: '1.02rem' }, 
                              color: '#111827',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: 1.25,
                              '&:hover': { color: '#2563EB' }
                            }}
                          >
                            {product.productName || 'Sneaker'}
                          </Typography>

                          {/* Variant Line: White / Black | Size: 8 */}
                          <Typography sx={{ fontSize: '0.82rem', color: '#6B7280', my: 0.35 }}>
                            {formatVariantColor(product.color)} &nbsp;|&nbsp; Size: {item.size || 8}
                          </Typography>

                          {/* Stock Status: Green Dot + In Stock */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.7 }}>
                            <Box sx={{ width: 6.5, height: 6.5, borderRadius: '50%', bgcolor: '#10B981' }} />
                            <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#059669' }}>
                              In Stock
                            </Typography>
                          </Box>

                          {/* Price Row: Selling Price, MRP strikethrough, Discount badge */}
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.9, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.15rem' }, color: '#111827' }}>
                              ₹{sellingPrice.toLocaleString()}
                            </Typography>

                            {originalPrice > sellingPrice && (
                              <Typography sx={{ color: '#9CA3AF', textDecoration: 'line-through', fontSize: '0.82rem', fontWeight: 500 }}>
                                ₹{originalPrice.toLocaleString()}
                              </Typography>
                            )}

                            {discountPercent > 0 && (
                              <Box sx={{ 
                                bgcolor: '#FEE2E2', 
                                color: '#EF4444', 
                                fontWeight: 700, 
                                fontSize: '0.7rem', 
                                borderRadius: '4px', 
                                px: 0.7, 
                                py: 0.12 
                              }}>
                                -{discountPercent}%
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {/* Right: Actions (Heart & Delete at Top) + Controls (- 1 + and Item Total at Bottom) */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'flex-start', sm: 'flex-end' }, 
                        justifyContent: 'space-between',
                        gap: 1.8,
                        width: { xs: '100%', sm: 'auto' },
                        borderTop: { xs: '1px solid #F1F5F9', sm: 'none' },
                        pt: { xs: 1.5, sm: 0 },
                        minHeight: { sm: 80 }
                      }}>
                        
                        {/* Top: Wishlist & Delete Icons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton 
                            size="small"
                            onClick={() => handleToggleWishlist(product._id)}
                            sx={{ 
                              color: isWishlisted ? '#EF4444' : '#6B7280',
                              p: 0.6,
                              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }
                            }}
                            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                          >
                            {isWishlisted ? <Favorite sx={{ fontSize: 19 }} /> : <FavoriteBorder sx={{ fontSize: 19 }} />}
                          </IconButton>

                          <IconButton 
                            size="small"
                            onClick={async () => {
                              try {
                                await removeFromCart(product._id, item.size);
                                toast.info('Item removed from cart');
                              } catch (err) {
                                toast.error('Could not remove item');
                              }
                            }}
                            sx={{ 
                              color: '#6B7280',
                              p: 0.6,
                              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }
                            }}
                            title="Remove from cart"
                          >
                            <DeleteOutlined sx={{ fontSize: 19 }} />
                          </IconButton>
                        </Box>

                        {/* Bottom: Quantity Selector & Total Price */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: { xs: 2.5, sm: 3.5 },
                          width: { xs: '100%', sm: 'auto' },
                          justifyContent: { xs: 'space-between', sm: 'flex-end' }
                        }}>
                          {/* Quantity Selector: - 1 + */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '6px', 
                            bgcolor: '#FFFFFF',
                            overflow: 'hidden',
                            height: 34
                          }}>
                            <IconButton 
                              onClick={() => decreaseQty(product._id, item.size)} 
                              disabled={item.qty <= 1}
                              size="small" 
                              sx={{ 
                                borderRadius: 0, 
                                width: 32, 
                                height: 34, 
                                color: item.qty <= 1 ? '#D1D5DB' : '#374151',
                                '&:hover': { bgcolor: '#F3F4F6' } 
                              }}
                            >
                              <Remove sx={{ fontSize: 15 }} />
                            </IconButton>
                            
                            <Typography sx={{ 
                              minWidth: 32, 
                              textAlign: 'center', 
                              fontWeight: 600, 
                              fontSize: '0.85rem',
                              color: '#111827'
                            }}>
                              {item.qty}
                            </Typography>
                            
                            <IconButton 
                              onClick={() => increaseQty(product._id, item.size)} 
                              size="small" 
                              sx={{ 
                                borderRadius: 0, 
                                width: 32, 
                                height: 34, 
                                color: '#374151',
                                '&:hover': { bgcolor: '#F3F4F6' } 
                              }}
                            >
                              <Add sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Box>

                          {/* Item Total Price */}
                          <Typography sx={{ 
                            fontWeight: 800, 
                            fontSize: { xs: '1.05rem', sm: '1.2rem' }, 
                            color: '#111827',
                            minWidth: 85,
                            textAlign: 'right'
                          }}>
                            ₹{itemTotal.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                    </Box>
                  </Card>
                );
              })}
            </Box>

            {/* Bottom Trust Features Banner (Directly under the Cart Items) */}
            <TrustFeaturesBanner />
          </Box>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Sticky Order Summary Card                  */}
          {/* ======================================================== */}
          <Box sx={{ 
            width: { xs: '100%', md: 360, lg: 375 }, 
            flexShrink: 0, 
            position: { md: 'sticky' }, 
            top: 24 
          }}>
            <Card sx={{ 
              p: { xs: 2.5, md: 3 }, 
              borderRadius: '16px', 
              bgcolor: '#FFFFFF', 
              border: '1px solid #E5E7EB',
              boxShadow: 'none'
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#111827', mb: 2.5 }}>
                Order Summary
              </Typography>

              {/* Subtotal */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
                <Typography sx={{ fontSize: '0.88rem', color: '#4B5563' }}>
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </Typography>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                  ₹{subtotalMRP.toLocaleString()}
                </Typography>
              </Box>

              {/* Discount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
                <Typography sx={{ fontSize: '0.88rem', color: '#4B5563' }}>
                  Discount
                </Typography>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#10B981' }}>
                  - ₹{totalDiscount.toLocaleString()}
                </Typography>
              </Box>

              {/* Shipping */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ fontSize: '0.88rem', color: '#4B5563' }}>
                  Shipping
                </Typography>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: shippingFee === 0 ? '#4B5563' : '#111827' }}>
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2.2, borderColor: '#F1F5F9' }} />

              {/* Total Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2.5 }}>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                  Total Amount
                </Typography>
                <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: '#111827' }}>
                  ₹{finalTotal.toLocaleString()}
                </Typography>
              </Box>

              {/* Savings Green Alert Box */}
              {totalDiscount > 0 && (
                <Box sx={{ 
                  p: 1.8, 
                  mb: 2.5, 
                  bgcolor: '#F0FDF4', 
                  border: '1px solid #DCFCE7', 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.2
                }}>
                  <LocalOfferOutlined sx={{ color: '#10B981', fontSize: 19, mt: 0.15 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#065F46', lineHeight: 1.3 }}>
                      You saved ₹{totalDiscount.toLocaleString()} on this order!
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#047857', mt: 0.25 }}>
                      Great choice! You got extra discount.
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Proceed to Checkout Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/checkout')}
                startIcon={<LockOutlined sx={{ fontSize: 16 }} />}
                endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: '#0F172A',
                  color: '#FFFFFF',
                  height: 48,
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: 'none',
                  mb: 1.8,
                  '&:hover': {
                    bgcolor: '#1E293B',
                    boxShadow: 'none'
                  }
                }}
              >
                Proceed to Checkout
              </Button>

              {/* OR Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 1.8 }}>
                <Divider sx={{ flex: 1, borderColor: '#E5E7EB' }} />
                <Typography sx={{ px: 2, fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF' }}>
                  OR
                </Typography>
                <Divider sx={{ flex: 1, borderColor: '#E5E7EB' }} />
              </Box>

              {/* Continue Shopping Button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/shop')}
                startIcon={<ShoppingBagOutlined sx={{ fontSize: 18 }} />}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#1E293B',
                  borderColor: '#CBD5E1',
                  height: 44,
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                    borderColor: '#94A3B8'
                  }
                }}
              >
                Continue Shopping
              </Button>

              {/* Coupon Accordion */}
              <Box sx={{ mt: 2.5, border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <Box 
                  onClick={() => setCouponExpanded(!couponExpanded)}
                  sx={{ 
                    p: 1.5, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    bgcolor: '#FFFFFF',
                    '&:hover': { bgcolor: '#F8FAFC' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <AccessTimeOutlined sx={{ color: '#4B5563', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827' }}>
                        Have a Coupon?
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        {appliedCoupon ? `Code "${appliedCoupon.code}" applied` : 'Apply coupon code for additional discount'}
                      </Typography>
                    </Box>
                  </Box>
                  <KeyboardArrowRight sx={{ 
                    color: '#9CA3AF', 
                    fontSize: 18,
                    transform: couponExpanded ? 'rotate(90deg)' : 'none', 
                    transition: 'transform 0.2s' 
                  }} />
                </Box>

                <Collapse in={couponExpanded}>
                  <Box sx={{ p: 1.8, pt: 0, bgcolor: '#FFFFFF' }}>
                    {appliedCoupon ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F0FDF4', p: 1.2, borderRadius: '6px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#10B981', fontSize: 17 }} />
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#065F46' }}>
                            {appliedCoupon.code} (-₹{couponDiscount.toLocaleString()})
                          </Typography>
                        </Box>
                        <Button size="small" color="error" onClick={handleRemoveCoupon} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.76rem' }}>
                          Remove
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField 
                          size="small" 
                          placeholder="e.g. FOOTVERSE10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.82rem', height: 36 } }}
                        />
                        <Button 
                          variant="contained" 
                          onClick={handleApplyCoupon}
                          sx={{ 
                            bgcolor: '#1E293B', 
                            color: '#FFFFFF', 
                            borderRadius: '6px', 
                            px: 2, 
                            height: 36,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' } 
                          }}
                        >
                          Apply
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>

              {/* Security and Trust Footer */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <SecurityOutlined sx={{ color: '#4B5563', fontSize: 19, mt: 0.15 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1F2937' }}>
                      100% Secure Checkout
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#6B7280' }}>
                      Your information is safe and secure
                    </Typography>
                  </Box>
                </Box>

                <PaymentBadges />
              </Box>
            </Card>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
