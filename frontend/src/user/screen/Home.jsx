import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Container, Grid, Typography, Button, IconButton, 
  Card, useTheme, useMediaQuery, Chip, Tooltip
} from '@mui/material';
import { 
  LocalShippingOutlined, KeyboardReturnOutlined, 
  SecurityOutlined, SupportAgentOutlined, 
  ArrowBackIosNew, ArrowForwardIos, Star,
  TrendingUp, FlashOn, VerifiedOutlined, ShoppingBagOutlined,
  PlayArrow, Pause, VolumeUp, VolumeOff
} from '@mui/icons-material';
import { BaseUrl } from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useCart } from '../../store/cartContext';
import { toast } from 'react-toastify';

// Map backend product data to ProductCard props format
const mapProductData = (item) => {
  const mainImage = item.productImage?.find((img) => img.tag === "main")?.url || item.productImage?.[0]?.url;
  const hoverImage = item.productImage?.find((img) => img.tag === "hover")?.url || item.productImage?.[1]?.url || mainImage;
  
  let discountPercent = 0;
  if (item.discount?.isDiscount) {
    if (item.discount.type === "percentage") {
      discountPercent = item.discount.value;
    } else {
      discountPercent = Math.round((item.discount.value / item.price) * 100);
    }
  }

  return {
    id: item._id,
    name: item.productName,
    image: mainImage ? `http://localhost:5000/media/products/${mainImage}` : '/placeholder-shoe.png',
    hoverImage: hoverImage ? `http://localhost:5000/media/products/${hoverImage}` : null,
    rating: item.rating || 4.8,
    reviewsCount: item.reviewsCount || 124,
    price: item.discount?.isDiscount ? item.discount.finalPrice : item.price,
    originalPrice: item.discount?.isDiscount ? item.price : null,
    discountPercent,
    colors: item.color ? (Array.isArray(item.color) ? item.color : String(item.color).split(',').map(c => c.trim())) : [],
    category: item.category,
    brand: item.brand || 'FootVerse',
    countInStock: item.quantity || 0,
    priceDrop: discountPercent > 20
  };
};

// HD Video Carousel Component (Full-Width Rectangle Shape)
const VideoHeroCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      video: "/video/category-formal.mp4",
      badgeTop: "• HD CINEMATIC",
      badgeSub: "⚡ PRO ATHLETIC SERIES",
      title: "Unleash Pure",
      highlight: "Speed & Power",
      highlightGradient: "linear-gradient(90deg, #60A5FA 0%, #818CF8 100%)",
      desc: "Aerodynamic support, responsive cushioning, and elite grip crafted for athletes on track and court.",
      ctaPrimary: "Explore Sports →",
      ctaSecondary: "Browse All Drops",
      linkPrimary: "/shop",
      linkSecondary: "/shop",
      discount: "40% OFF",
      discountSub: "LIMITED TIME"
    },
    {
      id: 2,
      video: "/video/category-casual.mp4",
      badgeTop: "• HD CINEMATIC",
      badgeSub: "🔥 STREETWEAR ICONS",
      title: "Step Into",
      highlight: "Better Style",
      highlightGradient: "linear-gradient(90deg, #FBBF24 0%, #F87171 100%)",
      desc: "Discover the latest footwear collection from top brands with unmatched comfort and street aesthetics.",
      ctaPrimary: "Shop Casual →",
      ctaSecondary: "View New Drops",
      linkPrimary: "/shop",
      linkSecondary: "/shop",
      discount: "50% OFF",
      discountSub: "UP TO"
    },
    {
      id: 3,
      video: "/video/category-mens.mp4",
      badgeTop: "• HD CINEMATIC",
      badgeSub: "✨ PERFORMANCE EDITIONS",
      title: "Engineered For",
      highlight: "Maximum Agility",
      highlightGradient: "linear-gradient(90deg, #34D399 0%, #38BDF8 100%)",
      desc: "Next-generation energy return, dynamic arch support, and featherweight cushioning for marathon strides.",
      ctaPrimary: "Explore Collection →",
      ctaSecondary: "Check Best Sellers",
      linkPrimary: "/shop",
      linkSecondary: "/shop",
      discount: "35% OFF",
      discountSub: "EXCLUSIVE"
    }
  ];

  const handlePrev = () => setActiveSlide((p) => (p === 0 ? slides.length - 1 : p - 1));
  const handleNext = () => setActiveSlide((p) => (p === slides.length - 1 ? 0 : p + 1));

  // Auto-advance slide every 7 seconds if playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(handleNext, 7000);
    return () => clearInterval(timer);
  }, [isPlaying, activeSlide]);

  // Video element play/pause control
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeSlide]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const slide = slides[activeSlide];

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%',
        height: { xs: 460, sm: 520, md: 580 },
        borderRadius: 0, // Explicit rectangle shape as requested
        overflow: 'hidden', 
        bgcolor: '#0F172A',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Background HD Video */}
      <video
        ref={videoRef}
        key={slide.video}
        src={slide.video}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      />

      {/* Cinematic Dark Gradient Overlay */}
      <Box 
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.78) 45%, rgba(15, 23, 42, 0.35) 75%, rgba(15, 23, 42, 0.2) 100%)',
          zIndex: 1
        }}
      />

      {/* Content Layer */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ maxWidth: { xs: '100%', md: 620 }, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
          
          {/* Badges Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              label={slide.badgeTop}
              size="small"
              sx={{ 
                bgcolor: 'rgba(239, 68, 68, 0.25)', 
                color: '#F87171', 
                fontWeight: 800, 
                fontSize: '0.75rem',
                letterSpacing: '0.04em',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                backdropFilter: 'blur(8px)',
                px: 0.5
              }}
            />
            <Chip 
              label={slide.badgeSub}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                color: '#FFFFFF', 
                fontWeight: 700, 
                fontSize: '0.75rem',
                letterSpacing: '0.04em',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                px: 0.5
              }}
            />
          </Box>

          {/* Headline */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.4rem', sm: '3.3rem', md: '4rem' },
              lineHeight: 1.08, 
              mb: 2.2,
              letterSpacing: '-0.03em',
              color: '#FFFFFF'
            }}
          >
            {slide.title} <br />
            <Box 
              component="span" 
              sx={{ 
                background: slide.highlightGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {slide.highlight}
            </Box>
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              maxWidth: 520, 
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.6
            }}
          >
            {slide.desc}
          </Typography>

          {/* CTA Buttons Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => navigate(slide.linkPrimary)}
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.45)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(79, 70, 229, 0.55)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {slide.ctaPrimary}
            </Button>

            <Button 
              variant="outlined"
              onClick={() => navigate(slide.linkSecondary)}
              sx={{ 
                px: 3.5, 
                py: 1.4, 
                borderRadius: '12px',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  bgcolor: 'rgba(255, 255, 255, 0.16)'
                }
              }}
            >
              {slide.ctaSecondary}
            </Button>
          </Box>

        </Box>

        {/* Floating Circular Discount Badge (matching reference design) */}
        <Box 
          sx={{ 
            position: 'absolute', 
            right: { xs: '6%', sm: '12%', md: '18%' }, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 2,
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', 
              color: '#FFFFFF', 
              width: { sm: 90, md: 104 }, 
              height: { sm: 90, md: 104 }, 
              borderRadius: '50%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 15px 35px rgba(79, 70, 229, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.06)' }
            }}
          >
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>
              {slide.discountSub}
            </Typography>
            <Typography sx={{ fontSize: { sm: '1.2rem', md: '1.35rem' }, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
              {slide.discount}
            </Typography>
          </Box>
        </Box>
      </Container>
      
      {/* Slider Left Arrow */}
      <IconButton 
        onClick={handlePrev}
        sx={{ 
          position: 'absolute', 
          left: { xs: 8, md: 24 }, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          bgcolor: 'rgba(255, 255, 255, 0.12)', 
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': { bgcolor: '#FFFFFF', color: '#111827' },
          zIndex: 4,
          transition: 'all 0.2s ease',
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 }
        }}
      >
        <ArrowBackIosNew fontSize="small" />
      </IconButton>
      
      {/* Slider Right Arrow */}
      <IconButton 
        onClick={handleNext}
        sx={{ 
          position: 'absolute', 
          right: { xs: 8, md: 24 }, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          bgcolor: 'rgba(255, 255, 255, 0.12)', 
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': { bgcolor: '#FFFFFF', color: '#111827' },
          zIndex: 4,
          transition: 'all 0.2s ease',
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 }
        }}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>
      
      {/* Slider Dots Indicator */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 22, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          alignItems: 'center',
          gap: 1.2, 
          zIndex: 4 
        }}
      >
        {slides.map((_, idx) => (
          <Box 
            key={idx} 
            onClick={() => setActiveSlide(idx)}
            sx={{ 
              width: activeSlide === idx ? 32 : 8, 
              height: 8, 
              borderRadius: 4, 
              bgcolor: activeSlide === idx ? '#6366F1' : 'rgba(255, 255, 255, 0.45)',
              cursor: 'pointer', 
              transition: 'all 0.3s ease'
            }} 
          />
        ))}
      </Box>

      {/* Bottom-Right Play/Pause and Mute/Unmute Controls */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 18, 
          right: { xs: 16, md: 32 }, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          zIndex: 4 
        }}
      >
        <Tooltip title={isPlaying ? "Pause Video" : "Play Video"}>
          <IconButton
            size="small"
            onClick={togglePlay}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            {isPlaying ? <Pause sx={{ fontSize: 18 }} /> : <PlayArrow sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isMuted ? "Unmute Audio" : "Mute Audio"}>
          <IconButton
            size="small"
            onClick={toggleMute}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            {isMuted ? <VolumeOff sx={{ fontSize: 18 }} /> : <VolumeUp sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

// Main Home Component
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await BaseUrl.get("/get-product");
        setProducts(data?.list?.map(mapProductData) || []);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, "8");
      toast.success(`${product.name || 'Shoe'} added to cart!`);
    } catch (err) {
      toast.info(`${product.name || 'Shoe'} added to cart!`);
    }
  };

  const handleLike = (id) => {
    try {
      const stored = JSON.parse(localStorage.getItem('footverse_wishlist')) || [];
      let updated;
      if (stored.includes(id)) {
        updated = stored.filter(item => item !== id);
        toast.info("Removed from wishlist");
      } else {
        updated = [...stored, id];
        toast.success("Added to wishlist!");
      }
      localStorage.setItem('footverse_wishlist', JSON.stringify(updated));
    } catch {
      toast.success("Wishlist updated");
    }
  };

  // Uniform Responsive Product Grid Section
  const ProductSection = ({ title, subtitle, items, icon }) => (
    <Box sx={{ mb: 8 }}>
      
      {/* Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {icon}
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.88rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Button 
          onClick={() => navigate('/shop')} 
          sx={{ 
            fontWeight: 700, 
            color: '#111827',
            textTransform: 'none',
            fontSize: '0.88rem',
            borderRadius: '8px',
            px: 2,
            py: 0.8,
            '&:hover': {
              bgcolor: '#F3F4F6'
            }
          }}
        >
          View All &rarr;
        </Button>
      </Box>

      {/* Grid of Product Cards */}
      {loading ? (
        <LoadingSkeleton type="product" count={4} />
      ) : (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))'
            },
            gap: 3
          }}
        >
          {items.slice(0, 8).map(item => (
            <Box key={item.id} sx={{ width: '100%' }}>
              <ProductCard 
                product={item} 
                onClick={(id) => navigate(`/product-details/${id}`)}
                onAddToCart={handleAddToCart}
                onQuickView={(p) => navigate(`/product-details/${p.id}`)}
                onLike={handleLike}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      
      {/* 1. Full-Width HD Video Carousel in Clean Rectangle Shape */}
      <VideoHeroCarousel />

      <Container maxWidth="xl" sx={{ pt: 6, pb: 8 }}>
        
        {/* 2. Benefits Feature Bar (Theme-aligned with slate charcoal highlights) */}
        <Grid container spacing={2.5} sx={{ mb: 8 }}>
        {[
          { icon: <LocalShippingOutlined sx={{ fontSize: 28 }} />, title: "Free Express Shipping", subtitle: "On all orders above ₹999" },
          { icon: <KeyboardReturnOutlined sx={{ fontSize: 28 }} />, title: "7-Day Easy Return", subtitle: "Hassle-free instant exchanges" },
          { icon: <SecurityOutlined sx={{ fontSize: 28 }} />, title: "100% Authentic Guarantee", subtitle: "Verified certified shoes" },
          { icon: <SupportAgentOutlined sx={{ fontSize: 28 }} />, title: "24/7 Premium Support", subtitle: "Dedicated footwear experts" },
        ].map((benefit, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card 
              elevation={0}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2.5, 
                borderRadius: '16px', 
                border: '1px solid #E5E7EB', 
                bgcolor: '#FFFFFF',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#CBD5E1',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '12px', 
                  bgcolor: '#F1F5F9', 
                  color: '#1E293B', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}
              >
                {benefit.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                  {benefit.title}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  {benefit.subtitle}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 3. Featured Categories */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', mb: 0.5 }}>
              Featured Categories
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.88rem' }}>
              Explore handpicked styles for every walk of life
            </Typography>
          </Box>
          <Button 
            onClick={() => navigate('/shop')} 
            sx={{ fontWeight: 700, color: '#111827', textTransform: 'none', fontSize: '0.88rem' }}
          >
            All Categories &rarr;
          </Button>
        </Box>

        <Grid container spacing={3}>
          {[
            { title: "Running Shoes", sub: "Speed & Distance", img: "/img/product/sport.jpg" },
            { title: "Casual Sneakers", sub: "Daily Street Style", img: "/img/product/casual.jpg" },
            { title: "Sports & Training", sub: "Gym & Court Power", img: "/img/product/sneaker.jpg" },
            { title: "Formal Classics", sub: "Timeless Elegance", img: "/img/product/formal.jpg" }
          ].map((cat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: '16px', 
                  p: 2.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer', 
                  border: '1px solid #E5E7EB',
                  bgcolor: '#FFFFFF',
                  transition: 'all 0.25s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 12px 25px rgba(0,0,0,0.06)', 
                    borderColor: '#111827' 
                  }
                }}
                onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.title)}`)}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827', mb: 0.3 }}>
                    {cat.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500 }}>
                    {cat.sub}
                  </Typography>
                </Box>
                <Box 
                  component="img" 
                  src={cat.img} 
                  onError={(e) => { e.target.src = '/placeholder-shoe.png'; }}
                  sx={{ 
                    width: 76, 
                    height: 76, 
                    objectFit: 'contain', 
                    borderRadius: '8px',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.08)' }
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 4. Trending Products Grid */}
      <ProductSection 
        title="Trending Products" 
        subtitle="Most loved silhouettes making waves right now"
        icon={<TrendingUp sx={{ color: '#111827' }} />}
        items={products} 
      />

      {/* 5. New Arrivals Grid */}
      <ProductSection 
        title="New Arrivals" 
        subtitle="Fresh drops and latest colorways added this week"
        icon={<FlashOn sx={{ color: '#F59E0B' }} />}
        items={[...products].reverse()} 
      />

      {/* 6. Promotional Banner (Theme-matched to slate/dark with golden accents) */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #111827 100%)',
          borderRadius: '20px', 
          p: { xs: 4, md: 6 }, 
          mb: 8, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'relative', 
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)'
        }}
      >
        <Box sx={{ zIndex: 2, color: 'white', maxWidth: 540 }}>
          <Chip 
            label="LIMITED TIME DROP" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(245, 158, 11, 0.2)', 
              color: '#FBBF24', 
              fontWeight: 800, 
              fontSize: '0.75rem', 
              mb: 2, 
              border: '1px solid rgba(245, 158, 11, 0.3)' 
            }} 
          />
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-0.02em', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            End of Season Clearance
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3.5, fontSize: '1rem', lineHeight: 1.6 }}>
            Grab your dream pair with an extra 25% off on selected running & streetwear shoes.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/shop')}
            sx={{ 
              bgcolor: '#FFFFFF', 
              color: '#0F172A', 
              fontWeight: 700,
              fontSize: '0.95rem',
              px: 4, 
              py: 1.4, 
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#F3F4F6' } 
            }}
          >
            Claim Offer Now &rarr;
          </Button>
        </Box>

        <Box 
          component="img" 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
          alt="Sale Sneaker"
          onError={(e) => { e.target.src = '/img/product/slider.jpg'; }}
          sx={{ 
            height: { md: 280, lg: 320 }, 
            objectFit: 'contain', 
            zIndex: 2, 
            display: { xs: 'none', md: 'block' }, 
            transform: 'rotate(-15deg)',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'
          }}
        />

        {/* Ambient Orb */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -60, 
            right: -60, 
            width: 380, 
            height: 380, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.04)', 
            zIndex: 1, 
            pointerEvents: 'none' 
          }} 
        />
      </Box>

      {/* 7. Best Sellers Grid */}
      <ProductSection 
        title="Best Sellers" 
        subtitle="Top-rated footwear consistently chosen by our customers"
        icon={<ShoppingBagOutlined sx={{ color: '#111827' }} />}
        items={products} 
      />

      {/* 8. Popular Brands */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', mb: 0.5 }}>
            Popular Brands
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.88rem' }}>
            Shop authentic pairs directly from official brand collections
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {["Nike", "Adidas", "Puma", "Skechers", "Converse", "New Balance"].map((brand, i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <Card 
                elevation={0}
                onClick={() => navigate(`/shop?brand=${encodeURIComponent(brand)}`)}
                sx={{ 
                  p: 2.5, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '14px', 
                  height: 90,
                  border: '1px solid #E5E7EB',
                  bgcolor: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#111827',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E293B', letterSpacing: '-0.01em' }}>
                  {brand}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF', mt: 0.2 }}>
                  Official Stock
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 9. Customer Testimonials */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', mb: 0.5 }}>
            What Our Customers Say
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.88rem' }}>
            Real reviews from verified sneakerheads across India
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            { 
              name: "Sarah J.", 
              city: "Mumbai",
              text: "The quality and cushioning of these sneakers is unbelievable. Authentic packaging and delivered in 2 days!", 
              rating: 5 
            },
            { 
              name: "Mike T.", 
              city: "Bengaluru",
              text: "Best online sneaker store in India. Exactly as described, perfectly true to size, and great customer care.", 
              rating: 5 
            },
            { 
              name: "Emily R.", 
              city: "Delhi",
              text: "The return process for sizing exchange was so effortless. Super impressed with FootVerse!", 
              rating: 5 
            }
          ].map((review, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card 
                elevation={0}
                sx={{ 
                  p: 3.5, 
                  borderRadius: '16px', 
                  height: '100%', 
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E5E7EB'
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.4, mb: 1.8, color: '#F59E0B' }}>
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} sx={{ fontSize: 18 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ color: '#374151', fontSize: '0.92rem', lineHeight: 1.6, mb: 2.5 }}>
                  "{review.text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                      {review.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      {review.city}
                    </Typography>
                  </Box>
                  <Chip 
                    icon={<VerifiedOutlined sx={{ fontSize: '14px !important' }} />}
                    label="Verified Buyer" 
                    size="small" 
                    sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 600, fontSize: '0.7rem' }} 
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Container>
  </Box>
  );
}
