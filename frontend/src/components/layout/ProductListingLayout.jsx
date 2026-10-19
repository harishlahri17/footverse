import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, Container, Grid, Typography, Button, IconButton, 
  Drawer, useTheme, useMediaQuery, Divider, Slider, 
  Checkbox, FormGroup, FormControlLabel, Select, MenuItem, 
  Pagination, ToggleButton, ToggleButtonGroup, TextField,
  Collapse, InputBase
} from '@mui/material';
import { 
  FilterList, Close, ViewModule, ViewList, Sort as SortIcon, ShoppingCartOutlined, Star,
  KeyboardArrowUp, KeyboardArrowDown, Check, GridView, ViewHeadline
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../axiosInstance';
import ProductCard from '../../components/common/ProductCard';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import QuickViewModal from '../../components/common/QuickViewModal';
import { useCompare } from '../../store/CompareContext';
import { useCart } from '../../store/cartContext';
import { toast } from 'react-toastify';

// Color mapping helper
const colorMap = {
  '#000000': 'black',
  'black': '#000000',
  '#ffffff': 'white',
  'white': '#ffffff',
  '#ef4444': 'red',
  'red': '#ef4444',
  '#3b82f6': 'blue',
  'blue': '#3b82f6',
  '#10b981': 'green',
  'green': '#10b981',
  '#854d0e': 'brown',
  'brown': '#854d0e',
  '#6b7280': 'grey',
  'grey': '#6b7280',
  'gray': '#6b7280',
  '#eab308': 'yellow',
  'yellow': '#eab308'
};

// Map backend data to UI format
const mapProductData = (item) => {
  const mainImage = item.productImage?.find((img) => img.tag === "main")?.url || item.productImage?.[0]?.url;
  const hoverImage = item.productImage?.find((img) => img.tag === "hover")?.url || item.productImage?.[1]?.url || mainImage;
  
  let discountPercent = 0;
  if (item.discount?.isDiscount) {
    if (item.discount.type === "percentage") {
      discountPercent = item.discount.value;
    } else {
      discountPercent = Math.round((item.discount.value / (item.price || 1)) * 100);
    }
  }

  const sizeArray = item.size ? (Array.isArray(item.size) ? item.size.map(String) : String(item.size).split(',').map(s => s.trim())) : ['8', '9', '10'];
  const colorsArray = item.color ? (Array.isArray(item.color) ? item.color : String(item.color).split(',').map(c => c.trim())) : ['#000000', '#ffffff'];

  return {
    id: item._id,
    name: item.productName,
    image: mainImage ? `http://localhost:5000/media/products/${mainImage}` : '/placeholder-shoe.png',
    hoverImage: hoverImage ? `http://localhost:5000/media/products/${hoverImage}` : null,
    rating: item.rating || 0,
    reviewsCount: item.reviewsCount || 0,
    price: item.discount?.isDiscount && item.discount.finalPrice ? item.discount.finalPrice : item.price,
    originalPrice: item.discount?.isDiscount ? item.price : null,
    discountPercent,
    category: item.category || 'Mens',
    brand: item.brand || 'FootVerse',
    sizes: sizeArray,
    colors: colorsArray,
    date: item.createdAt || new Date().toISOString(),
    isAvailable: item.quantity !== undefined ? item.quantity > 0 : true,
    productType: item.type || item.productType || 'casual',
    isFeatured: Boolean(item.isFeatured)
  };
};

export default function ProductListingLayout({ 
  title = "Men's Sneakers",
  baseFilters = {},
  topContent = null,
  breadcrumbItems = [],
  hideCategoryFilter = false,
  hideBrandFilter = false,
  emptyStateTitle = "No products found",
  emptyStateDesc = "Try adjusting your filters or search criteria."
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sortMobileOpen, setSortMobileOpen] = useState(false);
  const [view, setView] = useState('grid');
  
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToCompare } = useCompare();
  // Assume useCart exposes a method to add items
  // If not, we'll just log it or rely on existing implementation
  const cartContext = useCart ? useCart() : null;
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await BaseUrl.get("/get-product");
        setProducts(data?.list?.map(mapProductData) || []);
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const activeCategory = searchParams.getAll('category');
  const activeBrands = searchParams.getAll('brand');
  const activeSizes = searchParams.getAll('size');
  const activeColors = searchParams.getAll('color');
  
  // Calculate dynamic maximum price ceiling from fetched products
  const maxPriceLimit = useMemo(() => {
    if (!products || products.length === 0) return 100000;
    const highest = Math.max(...products.map(p => p.price || 0));
    return Math.max(Math.ceil(highest / 10000) * 10000, 100000);
  }, [products]);

  const hasMinParam = searchParams.has('minPrice');
  const hasMaxParam = searchParams.has('maxPrice');
  const currentMinPrice = hasMinParam ? Number(searchParams.get('minPrice')) : 0;
  const currentMaxPrice = hasMaxParam ? Number(searchParams.get('maxPrice')) : 20000;
  const priceRange = [currentMinPrice, currentMaxPrice];

  const [sliderPrice, setSliderPrice] = useState([0, 20000]);

  useEffect(() => {
    setSliderPrice([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  const sort = searchParams.get('sort') || 'popularity';
  const activeProductTypes = searchParams.getAll('productType');
  const activeAvailability = searchParams.get('availability');
  const searchQuery = searchParams.get('q') || '';

  const categoryFilterItems = [
    { label: 'Casual Shoes', value: 'casual', count: 42 },
    { label: 'Sports Shoes', value: 'sports', count: 36 },
    { label: 'Running Shoes', value: 'running', count: 28 },
    { label: 'Sneakers', value: 'sneakers', count: 52 },
    { label: 'Formal Shoes', value: 'formal', count: 18 },
    { label: 'Sandals', value: 'sandals', count: 24 },
    { label: 'Boots', value: 'boots', count: 16 },
  ];

  const genderFilterItems = [
    { label: 'Men', value: 'Men', count: 78 },
    { label: 'Women', value: 'Women', count: 64 },
    { label: 'Kids', value: 'Kids', count: 22 },
  ];

  const brandFilterItems = [
    { label: 'Nike', value: 'Nike', count: 28 },
    { label: 'Adidas', value: 'Adidas', count: 24 },
    { label: 'Puma', value: 'Puma', count: 18 },
    { label: 'Reebok', value: 'Reebok', count: 12 },
    { label: 'New Balance', value: 'New Balance', count: 10 },
    { label: 'Skechers', value: 'Skechers', count: 15 },
    { label: 'Converse', value: 'Converse', count: 14 },
    { label: 'Asics', value: 'Asics', count: 8 },
  ];

  const sizeOptions = ['6', '7', '8', '9', '10', '11', '12', '13'];

  const colorOptions = [
    { label: 'Black', hex: '#000000', name: 'black' },
    { label: 'White', hex: '#FFFFFF', name: 'white' },
    { label: 'Blue', hex: '#3B82F6', name: 'blue' },
    { label: 'Red', hex: '#EF4444', name: 'red' },
    { label: 'Green', hex: '#10B981', name: 'green' },
    { label: 'Brown', hex: '#854D0E', name: 'brown' },
    { label: 'Grey', hex: '#6B7280', name: 'grey' },
    { label: 'Yellow', hex: '#EAB308', name: 'yellow' },
  ];

  const [showAllBrands, setShowAllBrands] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    gender: false,
    brand: false,
    price: false,
    color: false,
  });

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Base Filters (hardcoded from props)
      if (baseFilters.category && product.category?.toLowerCase() !== baseFilters.category.toLowerCase()) return false;
      if (baseFilters.brand && product.brand?.toLowerCase() !== baseFilters.brand.toLowerCase()) return false;
      if (baseFilters.isDeal && product.discountPercent === 0) return false;
      if (baseFilters.q && !product.name.toLowerCase().includes(baseFilters.q.toLowerCase())) return false;
      
      // Category / Product Type Filter
      if (activeProductTypes.length > 0) {
        const matchesType = activeProductTypes.some(type => {
          const t = type.toLowerCase().replace(/ shoes$/, '').replace(/s$/, '');
          const prodType = (product.productType || '').toLowerCase();
          const prodName = (product.name || '').toLowerCase();
          const prodCat = (product.category || '').toLowerCase();
          return prodType.includes(t) || prodName.includes(t) || prodCat.includes(t);
        });
        if (!matchesType) return false;
      }

      // Gender / Category Filter
      const combinedGender = [...searchParams.getAll('gender'), ...activeCategory];
      if (combinedGender.length > 0) {
        const matchesGender = combinedGender.some(cat => {
          const c = cat.toLowerCase().replace(/s$/, '');
          const prodCat = (product.category || '').toLowerCase().replace(/s$/, '');
          return prodCat === c || (c === 'men' && prodCat === 'mens') || (c === 'women' && prodCat === 'womens');
        });
        if (!matchesGender) return false;
      }

      // Brand Filter
      if (activeBrands.length > 0 && !activeBrands.some(b => b.toLowerCase() === product.brand?.toLowerCase())) return false;
      
      // Size Filter
      if (activeSizes.length > 0 && (!product.sizes || !product.sizes.some(s => activeSizes.map(String).includes(String(s))))) return false;

      // Color Filter
      if (activeColors.length > 0) {
        const matchesColor = activeColors.some(selectedColor => {
          const sel = selectedColor.toLowerCase();
          return product.colors && product.colors.some(pc => {
            const prodColor = pc.toLowerCase();
            return prodColor === sel || colorMap[sel] === prodColor || colorMap[prodColor] === sel || prodColor.includes(sel);
          });
        });
        if (!matchesColor) return false;
      }

      // Availability & Search
      if (activeAvailability === 'instock' && !product.isAvailable) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Price Filter
      if (hasMinParam && product.price < currentMinPrice) return false;
      if (hasMaxParam && product.price > currentMaxPrice) return false;
      return true;
    }).sort((a, b) => {
      // Base sorting override
      if (baseFilters.sort === 'newest' && !searchParams.get('sort')) return new Date(b.date) - new Date(a.date);

      if (sort === 'price-low-high') return a.price - b.price;
      if (sort === 'price-high-low') return b.price - a.price;
      if (sort === 'newest') return new Date(b.date) - new Date(a.date);
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeCategory, activeBrands, activeSizes, activeColors, activeProductTypes, activeAvailability, searchQuery, hasMinParam, hasMaxParam, currentMinPrice, currentMaxPrice, sort, baseFilters, searchParams]);

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const updateParams = (key, value, isArray = true) => {
    const current = new URLSearchParams(searchParams);
    if (isArray) {
      const existing = current.getAll(key);
      const valLower = String(value).toLowerCase();
      const matchIndex = existing.findIndex(v => String(v).toLowerCase() === valLower);
      if (matchIndex >= 0) {
        current.delete(key);
        existing.filter((_, idx) => idx !== matchIndex).forEach(v => current.append(key, v));
      } else {
        current.append(key, value);
      }
    } else {
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }
    current.set('page', '1');
    setPage(1);
    setSearchParams(current);
  };

  const handlePriceChange = (event, newValue) => {
    const current = new URLSearchParams(searchParams);
    current.set('minPrice', newValue[0]);
    current.set('maxPrice', newValue[1]);
    current.set('page', '1');
    setPage(1);
    setSearchParams(current);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const handleToggleWishlist = (productId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('footverse_wishlist')) || [];
      const exists = stored.includes(productId);
      const updated = exists ? stored.filter(id => id !== productId) : [...stored, productId];
      localStorage.setItem('footverse_wishlist', JSON.stringify(updated));
      toast.success(exists ? 'Removed from Wishlist' : 'Added to Wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const SidebarContent = () => {
    const displayedBrands = showAllBrands ? brandFilterItems : brandFilterItems.slice(0, 5);

    return (
      <Box sx={{ width: { xs: 280, md: '100%' }, p: { xs: 3, md: 0 } }}>
        {/* Filters Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
            Filters
          </Typography>
          <Typography
            onClick={clearFilters}
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#2563EB',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Clear All
          </Typography>
        </Box>
        <Divider sx={{ mb: 2.5, borderColor: '#E5E7EB' }} />

        {/* 1. Category Section */}
        <Box sx={{ mb: 2.5 }}>
          <Box 
            onClick={() => toggleSection('category')}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 1.2 }}
          >
            <Typography sx={{ fontSize: '0.96rem', fontWeight: 700, color: '#111827' }}>
              Category
            </Typography>
            {collapsedSections.category ? (
              <KeyboardArrowDown sx={{ fontSize: 20, color: '#111827' }} />
            ) : (
              <KeyboardArrowUp sx={{ fontSize: 20, color: '#111827' }} />
            )}
          </Box>

          <Collapse in={!collapsedSections.category}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {categoryFilterItems.map(item => {
                const isChecked = activeProductTypes.some(t => t.toLowerCase() === item.value.toLowerCase());
                return (
                  <Box
                    key={item.label}
                    onClick={() => updateParams('productType', item.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.6,
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover .filter-label': { color: '#2563EB' },
                      '&:hover .filter-checkbox': { borderColor: '#2563EB' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        className="filter-checkbox"
                        sx={{
                          width: 17,
                          height: 17,
                          borderRadius: '3px',
                          border: isChecked ? 'none' : '1.5px solid #D1D5DB',
                          bgcolor: isChecked ? '#2563EB' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                          flexShrink: 0
                        }}
                      >
                        {isChecked && <Check sx={{ fontSize: 13, color: '#FFFFFF', stroke: '#FFFFFF', strokeWidth: 1 }} />}
                      </Box>
                      <Typography
                        className="filter-label"
                        sx={{
                          fontSize: '0.875rem',
                          color: isChecked ? '#111827' : '#374151',
                          fontWeight: isChecked ? 600 : 400,
                          transition: 'color 0.15s ease'
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.825rem', color: '#9CA3AF' }}>
                      ({item.count})
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
          <Divider sx={{ mt: 2.2, borderColor: '#E5E7EB' }} />
        </Box>

        {/* 2. Gender Section */}
        <Box sx={{ mb: 2.5 }}>
          <Box 
            onClick={() => toggleSection('gender')}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 1.2 }}
          >
            <Typography sx={{ fontSize: '0.96rem', fontWeight: 700, color: '#111827' }}>
              Gender
            </Typography>
            {collapsedSections.gender ? (
              <KeyboardArrowDown sx={{ fontSize: 20, color: '#111827' }} />
            ) : (
              <KeyboardArrowUp sx={{ fontSize: 20, color: '#111827' }} />
            )}
          </Box>

          <Collapse in={!collapsedSections.gender}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {genderFilterItems.map(item => {
                const isChecked = activeCategory.some(c => c.toLowerCase() === item.value.toLowerCase() || c.toLowerCase() === (item.value + 's').toLowerCase());
                return (
                  <Box
                    key={item.label}
                    onClick={() => updateParams('category', item.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.6,
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover .filter-label': { color: '#2563EB' },
                      '&:hover .filter-checkbox': { borderColor: '#2563EB' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        className="filter-checkbox"
                        sx={{
                          width: 17,
                          height: 17,
                          borderRadius: '3px',
                          border: isChecked ? 'none' : '1.5px solid #D1D5DB',
                          bgcolor: isChecked ? '#2563EB' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                          flexShrink: 0
                        }}
                      >
                        {isChecked && <Check sx={{ fontSize: 13, color: '#FFFFFF', stroke: '#FFFFFF', strokeWidth: 1 }} />}
                      </Box>
                      <Typography
                        className="filter-label"
                        sx={{
                          fontSize: '0.875rem',
                          color: isChecked ? '#111827' : '#374151',
                          fontWeight: isChecked ? 600 : 400,
                          transition: 'color 0.15s ease'
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.825rem', color: '#9CA3AF' }}>
                      ({item.count})
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
          <Divider sx={{ mt: 2.2, borderColor: '#E5E7EB' }} />
        </Box>

        {/* 3. Brand Section */}
        <Box sx={{ mb: 2.5 }}>
          <Box 
            onClick={() => toggleSection('brand')}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 1.2 }}
          >
            <Typography sx={{ fontSize: '0.96rem', fontWeight: 700, color: '#111827' }}>
              Brand
            </Typography>
            {collapsedSections.brand ? (
              <KeyboardArrowDown sx={{ fontSize: 20, color: '#111827' }} />
            ) : (
              <KeyboardArrowUp sx={{ fontSize: 20, color: '#111827' }} />
            )}
          </Box>

          <Collapse in={!collapsedSections.brand}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {displayedBrands.map(item => {
                const isChecked = activeBrands.some(b => b.toLowerCase() === item.value.toLowerCase());
                return (
                  <Box
                    key={item.label}
                    onClick={() => updateParams('brand', item.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.6,
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover .filter-label': { color: '#2563EB' },
                      '&:hover .filter-checkbox': { borderColor: '#2563EB' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        className="filter-checkbox"
                        sx={{
                          width: 17,
                          height: 17,
                          borderRadius: '3px',
                          border: isChecked ? 'none' : '1.5px solid #D1D5DB',
                          bgcolor: isChecked ? '#2563EB' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                          flexShrink: 0
                        }}
                      >
                        {isChecked && <Check sx={{ fontSize: 13, color: '#FFFFFF', stroke: '#FFFFFF', strokeWidth: 1 }} />}
                      </Box>
                      <Typography
                        className="filter-label"
                        sx={{
                          fontSize: '0.875rem',
                          color: isChecked ? '#111827' : '#374151',
                          fontWeight: isChecked ? 600 : 400,
                          transition: 'color 0.15s ease'
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.825rem', color: '#9CA3AF' }}>
                      ({item.count})
                    </Typography>
                  </Box>
                );
              })}
              <Typography
                onClick={() => setShowAllBrands(!showAllBrands)}
                sx={{
                  color: '#2563EB',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  mt: 1,
                  userSelect: 'none'
                }}
              >
                {showAllBrands ? '- Show Less' : '+ Show More'}
              </Typography>
            </Box>
          </Collapse>
          <Divider sx={{ mt: 2.2, borderColor: '#E5E7EB' }} />
        </Box>

        {/* 4. Price Range Section */}
        <Box sx={{ mb: 2.5 }}>
          <Box 
            onClick={() => toggleSection('price')}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 1.2 }}
          >
            <Typography sx={{ fontSize: '0.96rem', fontWeight: 700, color: '#111827' }}>
              Price Range
            </Typography>
            {collapsedSections.price ? (
              <KeyboardArrowDown sx={{ fontSize: 20, color: '#111827' }} />
            ) : (
              <KeyboardArrowUp sx={{ fontSize: 20, color: '#111827' }} />
            )}
          </Box>

          <Collapse in={!collapsedSections.price}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937', mb: 1.5 }}>
              ₹{sliderPrice[0]?.toLocaleString()} – ₹{sliderPrice[1]?.toLocaleString()}
            </Typography>

            <Slider
              value={sliderPrice}
              onChange={(e, val) => setSliderPrice(val)}
              onChangeCommitted={handlePriceChange}
              min={0}
              max={maxPriceLimit}
              step={500}
              sx={{
                color: '#2563EB',
                height: 4,
                py: 1.5,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  bgcolor: '#2563EB',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  bgcolor: '#2563EB',
                  border: 'none',
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  bgcolor: '#CBD5E1',
                  opacity: 1,
                  height: 4,
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.6,
                  bgcolor: '#FFFFFF',
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mr: 0.8 }}>₹</Typography>
                <InputBase
                  value={sliderPrice[0]}
                  onChange={(e) => {
                    const val = Number(e.target.value.replace(/\D/g, ''));
                    setSliderPrice([val, sliderPrice[1]]);
                  }}
                  onBlur={() => handlePriceChange(null, sliderPrice)}
                  sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1F2937', width: '100%' }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.6,
                  bgcolor: '#FFFFFF',
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mr: 0.8 }}>₹</Typography>
                <InputBase
                  value={sliderPrice[1]}
                  onChange={(e) => {
                    const val = Number(e.target.value.replace(/\D/g, ''));
                    setSliderPrice([sliderPrice[0], val]);
                  }}
                  onBlur={() => handlePriceChange(null, sliderPrice)}
                  sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1F2937', width: '100%' }}
                />
              </Box>
            </Box>
          </Collapse>
          <Divider sx={{ mt: 2.2, borderColor: '#E5E7EB' }} />
        </Box>

        {/* 5. Size Section */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.96rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
            Size
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 235 }}>
            {sizeOptions.map(size => {
              const isSelected = activeSizes.includes(size);
              return (
                <Box
                  key={size}
                  onClick={() => updateParams('size', size)}
                  sx={{
                    width: 37,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                    bgcolor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    color: isSelected ? '#2563EB' : '#374151',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: '#2563EB',
                    },
                  }}
                >
                  {size}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ my: 2.2, borderColor: '#E5E7EB' }} />

        {/* 6. Color Section */}
        <Box sx={{ mb: 2.5 }}>
          <Box 
            onClick={() => toggleSection('color')}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 1.5 }}
          >
            <Typography sx={{ fontSize: '0.96rem', fontWeight: 700, color: '#111827' }}>
              Color
            </Typography>
            {collapsedSections.color ? (
              <KeyboardArrowDown sx={{ fontSize: 20, color: '#111827' }} />
            ) : (
              <KeyboardArrowUp sx={{ fontSize: 20, color: '#111827' }} />
            )}
          </Box>

          <Collapse in={!collapsedSections.color}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, pt: 0.5 }}>
              {colorOptions.map(color => {
                const isColorActive = activeColors.some(c => 
                  c.toLowerCase() === color.name.toLowerCase() || 
                  c.toLowerCase() === color.hex.toLowerCase()
                );
                return (
                  <Box
                    key={color.name}
                    onClick={() => updateParams('color', color.name)}
                    title={color.label}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: 0.5,
                      userSelect: 'none',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: color.hex,
                        border: color.name === 'white' ? '1.5px solid #D1D5DB' : '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isColorActive ? '0 0 0 2.5px #2563EB' : '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {isColorActive && (
                        <Check sx={{ fontSize: 16, color: color.name === 'white' ? '#111827' : '#FFFFFF' }} />
                      )}
                    </Box>
                    <Typography sx={{ fontSize: '0.72rem', color: isColorActive ? '#2563EB' : '#6B7280', fontWeight: isColorActive ? 700 : 500 }}>
                      {color.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>

        {isMobile && (
          <Button variant="contained" fullWidth onClick={() => setMobileOpen(false)} sx={{ mt: 2 }}>
            Apply Filters
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {topContent}
      
      <Container maxWidth="xl" sx={{ pt: topContent ? 2 : 4 }}>
        {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
        
        <Box sx={{ display: 'flex', gap: { md: 3, lg: 3.5 }, alignItems: 'flex-start', mt: 1 }}>
          {/* Left Sidebar: Fixed width 225px matching reference image */}
          <Box 
            sx={{ 
              width: 225, 
              minWidth: 225, 
              maxWidth: 225, 
              flexShrink: 0, 
              display: { xs: 'none', md: 'block' }, 
              pr: 2.5, 
              borderRight: '1px solid #E5E7EB' 
            }}
          >
            <SidebarContent />
          </Box>

          {/* Right Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3.5, gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.85rem' }, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500, mt: 0.5 }}>
                  {filteredProducts.length} products
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: { sm: 'auto' }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                {isMobile && (
                  <Button variant="outlined" startIcon={<FilterList />} onClick={() => setMobileOpen(true)} sx={{ borderRadius: 2 }}>
                    Filters
                  </Button>
                )}

                {isMobile ? (
                  <Button variant="outlined" startIcon={<SortIcon />} onClick={() => setSortMobileOpen(true)} sx={{ borderRadius: 2, ml: 1 }}>
                    Sort
                  </Button>
                ) : (
                  <Select
                    size="small"
                    value={sort}
                    onChange={(e) => updateParams('sort', e.target.value, false)}
                    displayEmpty
                    renderValue={(selected) => {
                      const labels = {
                        popularity: 'Popularity',
                        'price-low-high': 'Price: Low to High',
                        'price-high-low': 'Price: High to Low',
                        newest: 'Newest Arrivals',
                        rating: 'Top Rated'
                      };
                      return `Sort by: ${labels[selected] || 'Popularity'}`;
                    }}
                    sx={{ 
                      borderRadius: '8px', 
                      bgcolor: '#FFFFFF', 
                      minWidth: 175,
                      height: 38,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#CBD5E1',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563EB',
                      }
                    }}
                  >
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                    <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                    <MenuItem value="newest">Newest Arrivals</MenuItem>
                    <MenuItem value="rating">Top Rated</MenuItem>
                  </Select>
                )}

                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={(e, val) => val && setView(val)}
                  size="small"
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' }, 
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    height: 38,
                    overflow: 'hidden',
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 0,
                      px: 1.1,
                      color: '#4B5563',
                      '&.Mui-selected': {
                        bgcolor: '#F3F4F6',
                        color: '#111827'
                      }
                    }
                  }}
                >
                  <ToggleButton value="grid" title="Grid View">
                    <GridView sx={{ fontSize: 18 }} />
                  </ToggleButton>
                  <ToggleButton value="list" title="List View">
                    <ViewHeadline sx={{ fontSize: 18 }} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {loading ? (
              <LoadingSkeleton type="product" count={8} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState title={emptyStateTitle} description={emptyStateDesc} actionLabel="Clear Filters" onAction={clearFilters} />
            ) : (
              <>
                <Grid container spacing={2}>
                  {paginatedProducts.map((item) => (
                    <Grid 
                      key={item.id}
                      size={{ 
                        xs: 12, 
                        sm: view === 'grid' ? 6 : 12, 
                        md: view === 'grid' ? 4 : 12, 
                        lg: view === 'grid' ? 4 : 12, 
                        xl: view === 'grid' ? 3 : 12 
                      }}
                      sx={{ 
                        display: 'flex',
                        width: {
                          xs: '100%',
                          sm: view === 'grid' ? 'calc(50% - 8px)' : '100%',
                          md: view === 'grid' ? 'calc(33.333% - 11px)' : '100%',
                          lg: view === 'grid' ? 'calc(33.333% - 11px)' : '100%',
                          xl: view === 'grid' ? 'calc(25% - 12px)' : '100%'
                        }
                      }}
                    >
                      <ProductCard 
                        product={item} 
                        onClick={() => navigate(`/product-details/${item.id}`)} 
                        onLike={() => handleToggleWishlist(item.id)}
                        onAddToCart={(p) => {
                           if (cartContext && cartContext.addToCart) {
                               cartContext.addToCart(p);
                           } else {
                               toast.info('Added to cart');
                           }
                        }}
                        onQuickView={(p) => setQuickViewProduct(p)}
                        onCompare={(p) => addToCompare(p)}
                      />
                    </Grid>
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <Pagination count={totalPages} page={page} onChange={(e, val) => { setPage(val); window.scrollTo(0,0); }} color="primary" shape="rounded" />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>

      <Drawer anchor="bottom" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Box>
        <SidebarContent />
      </Drawer>

      <Drawer anchor="bottom" open={sortMobileOpen} onClose={() => setSortMobileOpen(false)} PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 4 } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={800}>Sort By</Typography>
          <IconButton onClick={() => setSortMobileOpen(false)}><Close /></IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {[
            { value: 'popularity', label: 'Popularity' },
            { value: 'price-low-high', label: 'Price: Low to High' },
            { value: 'price-high-low', label: 'Price: High to Low' },
            { value: 'newest', label: 'Newest Arrivals' },
            { value: 'rating', label: 'Top Rated' }
          ].map((option) => (
            <Box 
              key={option.value}
              onClick={() => {
                updateParams('sort', option.value, false);
                setSortMobileOpen(false);
              }}
              sx={{ 
                py: 1.5, 
                px: 2,
                cursor: 'pointer',
                borderRadius: 2,
                bgcolor: sort === option.value ? 'primary.50' : 'transparent',
                color: sort === option.value ? 'primary.main' : 'text.primary',
                fontWeight: sort === option.value ? 700 : 500,
                mb: 1
              }}
            >
              {option.label}
            </Box>
          ))}
        </Box>
      </Drawer>
      
      <QuickViewModal 
        open={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        product={quickViewProduct} 
        onAddToCart={(p) => {
            if (cartContext && cartContext.addToCart) {
                cartContext.addToCart(p);
            } else {
                toast.info('Added to cart from Quick View');
            }
        }} 
      />
    </Box>
  );
}
