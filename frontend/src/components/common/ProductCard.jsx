import React, { useState } from 'react';
import { Card, CardMedia, Typography, Box, IconButton, Button, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, Star, ShoppingCartOutlined, VisibilityOutlined } from '@mui/icons-material';

// Helper to resolve color strings/names to display hex
const resolveColor = (color) => {
  if (!color) return '#111827';
  const c = String(color).toLowerCase().trim();
  const map = {
    black: '#111827',
    white: '#FFFFFF',
    grey: '#64748B',
    gray: '#64748B',
    blue: '#1D4ED8',
    red: '#EF4444',
    green: '#10B981',
    yellow: '#F59E0B',
    orange: '#F97316',
    navy: '#0F172A',
    brown: '#78350F'
  };
  return map[c] || c;
};

export default function ProductCard({ product, onLike, onClick, onAddToCart, onQuickView }) {
  const {
    id, 
    name, 
    brand, 
    image, 
    hoverImage, 
    rating, 
    reviewsCount, 
    price, 
    originalPrice, 
    discountPercent = 0, 
    colors = [],
    isFeatured = false
  } = product || {};

  const [isHovered, setIsHovered] = useState(false);
  
  // Track wishlist state locally for immediate visual feedback
  const [isLiked, setIsLiked] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('footverse_wishlist')) || [];
      return stored.includes(id);
    } catch {
      return false;
    }
  });

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(prev => !prev);
    if (onLike) {
      onLike(id);
    }
  };

  // Prepare color swatches: use product's colors, or default 3+ colors matching reference
  const displayColors = React.useMemo(() => {
    if (Array.isArray(colors) && colors.length > 0) {
      if (colors.length === 1) {
        return [colors[0], '#64748B', '#1D4ED8', '#10B981', '#F59E0B'];
      }
      return colors;
    }
    return ['#111827', '#64748B', '#1D4ED8', '#10B981', '#F59E0B'];
  }, [colors]);

  const visibleSwatches = displayColors.slice(0, 3);
  const remainingColorCount = Math.max(0, displayColors.length - 3);

  const displayRating = rating && rating > 0 ? rating : 4.8;
  const displayReviews = reviewsCount && reviewsCount > 0 ? reviewsCount : 124;

  const badge = product?.badge
    ? product.badge
    : isFeatured
    ? { text: 'Best Seller', bg: '#F59E0B' }
    : product?.isNew
    ? { text: 'New', bg: '#10B981' }
    : discountPercent > 0
    ? { text: `-${discountPercent}%`, bg: '#EF4444' }
    : null;

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick && onClick(id)}
      elevation={0}
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          borderColor: '#D1D5DB'
        }
      }}
    >
      {/* Product Image Container */}
      <Box 
        sx={{ 
          width: '100%',
          height: 220, 
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0
        }}
      >
        <CardMedia
          component="img"
          image={isHovered && hoverImage ? hoverImage : (image || '/placeholder-shoe.png')}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-shoe.png';
          }}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Top Left Badge */}
        {badge && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              zIndex: 2,
              bgcolor: badge.bg, 
              color: '#FFFFFF', 
              fontWeight: 700, 
              fontSize: '0.72rem', 
              borderRadius: '4px', 
              px: 0.9, 
              py: 0.25, 
              lineHeight: 1.2
            }}
          >
            {badge.text}
          </Box>
        )}

        {/* Top Right: Outline Heart Icon */}
        <IconButton 
          onClick={handleLike}
          sx={{ 
            position: 'absolute', 
            top: 6, 
            right: 6, 
            zIndex: 2,
            p: 0.6,
            color: isLiked ? '#EF4444' : '#1F2937',
            bgcolor: 'transparent',
            transition: 'transform 0.2s ease',
            '&:hover': { 
              transform: 'scale(1.15)',
              bgcolor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          {isLiked ? (
            <Favorite sx={{ fontSize: 22, color: '#EF4444' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 22, color: '#1F2937' }} />
          )}
        </IconButton>

        {/* Quick View Icon Overlay */}
        {onQuickView && (
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 6, 
              right: 6, 
              opacity: isHovered ? 1 : 0, 
              transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
              transition: 'all 0.2s ease'
            }}
          >
            <Tooltip title="Quick View">
              <IconButton 
                size="small"
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                sx={{ 
                  bgcolor: '#FFFFFF', 
                  color: '#1E293B',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  '&:hover': { bgcolor: '#F8FAFC' }
                }}
              >
                <VisibilityOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Card Content Area */}
      <Box sx={{ p: 1.75, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Title and Rating Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: '0.96rem', 
              color: '#111827',
              lineHeight: 1.25,
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              maxWidth: '65%'
            }}
          >
            {name || 'Shoe'}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexShrink: 0 }}>
            <Star sx={{ color: '#F59E0B', fontSize: 16 }} />
            <Typography sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.825rem' }}>
              {displayRating}
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '0.78rem', fontWeight: 500 }}>
              ({displayReviews})
            </Typography>
          </Box>
        </Box>

        {/* Brand Name */}
        <Typography 
          sx={{ 
            color: '#6B7280', 
            fontWeight: 500, 
            fontSize: '0.82rem', 
            mb: 1.2 
          }}
        >
          {brand || 'FootVerse'}
        </Typography>

        {/* Color Swatches */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 1.3, minHeight: 18 }}>
          {visibleSwatches.map((col, idx) => (
            <Box 
              key={idx}
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: resolveColor(col),
                border: col === '#FFFFFF' || col === 'white' ? '1px solid #D1D5DB' : 'none',
                flexShrink: 0
              }} 
            />
          ))}
          {remainingColorCount > 0 && (
            <Typography sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 500, ml: 0.2 }}>
              +{remainingColorCount}
            </Typography>
          )}
        </Box>

        {/* Price Row: Current Price, Original Price, Discount Pill */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75, flexWrap: 'wrap', minHeight: 28 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
            ₹{Number(price || 0).toLocaleString()}
          </Typography>

          {originalPrice && originalPrice > price && (
            <Typography sx={{ color: '#9CA3AF', textDecoration: 'line-through', fontSize: '0.78rem', fontWeight: 500 }}>
              ₹{originalPrice?.toLocaleString()}
            </Typography>
          )}

          {discountPercent > 0 && (
            <Box 
              sx={{ 
                bgcolor: '#FEE2E2', 
                color: '#EF4444', 
                fontWeight: 700, 
                fontSize: '0.72rem', 
                borderRadius: '4px', 
                px: 0.6, 
                py: 0.15,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              -{discountPercent}%
            </Box>
          )}
        </Box>

        {/* Full-width Add to Cart Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart && onAddToCart(product);
          }}
          startIcon={<ShoppingCartOutlined sx={{ fontSize: 17 }} />}
          sx={{
            mt: 'auto',
            bgcolor: '#1E293B',
            color: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            borderRadius: '6px',
            py: 0.85,
            boxShadow: 'none',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: '#0F172A',
              boxShadow: 'none'
            }
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
}

