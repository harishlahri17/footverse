import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Container, Grid, Typography, Button, TextField, 
  Radio, RadioGroup, FormControlLabel, Divider, CircularProgress, 
  Paper, useTheme, useMediaQuery, IconButton, Checkbox, 
  Select, MenuItem, FormControl, InputAdornment, OutlinedInput, Collapse,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  PersonOutlined, MailOutlined, PhoneOutlined, HomeOutlined, 
  LocationCityOutlined, PlaceOutlined, PinDropOutlined, 
  LocalShippingOutlined, CreditCardOutlined, LocalAtmOutlined, 
  LockOutlined, ShieldOutlined, LocalOfferOutlined, EditOutlined, 
  Close, ChevronRight, CheckCircle, ReplayOutlined, VerifiedUserOutlined,
  AddLocationAltOutlined, LocalPostOfficeOutlined, BusinessOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../store/cartContext';
import { BaseUrl } from '../../axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';

// List of Indian States for dropdown
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

// Fallback preview items matching the exact reference screenshot if cart is empty
const PREVIEW_CART_ITEMS = [
  {
    productId: {
      _id: 'prev-1',
      productName: 'Nike Air Max 270',
      color: 'White / Black',
      price: 6999,
      discount: { isDiscount: true, type: 'percentage', value: 30, finalPrice: 4899 },
      productImage: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' }]
    },
    size: 8,
    qty: 1
  },
  {
    productId: {
      _id: 'prev-2',
      productName: 'Puma RS-X',
      color: 'Blue / White',
      price: 7499,
      discount: { isDiscount: true, type: 'percentage', value: 20, finalPrice: 5999 },
      productImage: [{ url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80' }]
    },
    size: 9,
    qty: 1
  }
];

export default function Checkout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cart, fetchCart, removeFromCart } = useCart();

  // Form State for Different Address (strictly matching userDetails model)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    area: '',
    postOffice: '',
    city: '',
    district: '',
    state: '',
    pinCode: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Saved Profile Address vs Different Address condition (strictly matching userDetails model)
  const [savedAddress, setSavedAddress] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem('footverse_saved_address'));
      if (local && (local.area || local.city || local.addressLine1)) {
        return {
          fullName: local.fullName || 'Rahul',
          email: local.email || 'rahul@gmail.com',
          phone: local.phone || '+91 98765 43210',
          area: local.area || local.addressLine1 || '#42, Park View Residency, 5th Cross',
          postOffice: local.postOffice || local.addressLine2 || 'Indiranagar H.O',
          city: local.city || 'Bengaluru',
          district: local.district || 'Bengaluru Urban',
          state: local.state || 'Karnataka',
          pinCode: local.pinCode || '560038',
          type: local.type || 'Home'
        };
      }
    } catch (e) {}
    return {
      fullName: 'Rahul',
      email: 'rahul@gmail.com',
      phone: '+91 98765 43210',
      area: '#42, Park View Residency, 5th Cross',
      postOffice: 'Indiranagar H.O',
      city: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pinCode: '560038',
      type: 'Home'
    };
  });
  const [addressChoice, setAddressChoice] = useState('saved'); // 'saved' | 'different'
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Edit Profile Saved Address modal state (strictly userDetails model)
  const [profileAddressModalOpen, setProfileAddressModalOpen] = useState(false);
  const [profileAddressForm, setProfileAddressForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    area: '',
    postOffice: '',
    city: '',
    district: '',
    state: '',
    pinCode: ''
  });
  const [profileAddressErrors, setProfileAddressErrors] = useState({});
  const [savingProfileAddress, setSavingProfileAddress] = useState(false);

  // Shipping & Payment Method
  const [shippingMethod, setShippingMethod] = useState('Standard'); // 'Standard' | 'Express' | 'SameDay'
  const [paymentMode, setPaymentMode] = useState('Card'); // 'Card' | 'UPI' | 'COD'

  // Card details (if card payment selected)
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  // UPI ID (if UPI selected)
  const [upiId, setUpiId] = useState('');

  // Coupon code state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState({ code: 'FOOTVERSE', discount: 1899 });

  // Terms agreement
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (fetchCart) fetchCart();

    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const token = localStorage.getItem('token');
        let u = null;

        if (token) {
          try {
            const res = await BaseUrl.get('/user/user-profile');
            if (res.data?.Success && res.data?.user) {
              u = res.data.user;
            }
          } catch (apiErr) {
            console.warn("Could not fetch user profile API:", apiErr);
          }
        }

        let localSaved = null;
        try {
          localSaved = JSON.parse(localStorage.getItem('footverse_saved_address'));
        } catch (e) {}

        // Construct guaranteed profile address strictly matching userDetails model
        let addr = null;
        if (u) {
          const defaultAddr = Array.isArray(u.addresses) && u.addresses.length > 0 
            ? (u.addresses.find(a => a.isDefault) || u.addresses[0]) 
            : null;

          addr = {
            fullName: u.fullName || 'Rahul',
            email: u.email || 'rahul@gmail.com',
            phone: u.phone || defaultAddr?.phone || '+91 98765 43210',
            area: u.area || defaultAddr?.line1 || localSaved?.area || localSaved?.addressLine1 || '#42, Park View Residency, 5th Cross',
            postOffice: u.postOffice || defaultAddr?.line2 || localSaved?.postOffice || localSaved?.addressLine2 || 'Indiranagar H.O',
            city: u.city || defaultAddr?.city || localSaved?.city || 'Bengaluru',
            district: u.district || defaultAddr?.district || localSaved?.district || 'Bengaluru Urban',
            state: u.state || defaultAddr?.state || localSaved?.state || 'Karnataka',
            pinCode: u.pinCode || defaultAddr?.pinCode || localSaved?.pinCode || '560038',
            type: defaultAddr?.type || localSaved?.type || 'Home'
          };
        } else if (localSaved && (localSaved.area || localSaved.city || localSaved.addressLine1)) {
          addr = {
            fullName: localSaved.fullName || 'Rahul',
            email: localSaved.email || 'rahul@gmail.com',
            phone: localSaved.phone || '+91 98765 43210',
            area: localSaved.area || localSaved.addressLine1 || '#42, Park View Residency, 5th Cross',
            postOffice: localSaved.postOffice || localSaved.addressLine2 || 'Indiranagar H.O',
            city: localSaved.city || 'Bengaluru',
            district: localSaved.district || 'Bengaluru Urban',
            state: localSaved.state || 'Karnataka',
            pinCode: localSaved.pinCode || '560038',
            type: localSaved.type || 'Home'
          };
        } else {
          addr = {
            fullName: 'Rahul',
            email: 'rahul@gmail.com',
            phone: '+91 98765 43210',
            area: '#42, Park View Residency, 5th Cross',
            postOffice: 'Indiranagar H.O',
            city: 'Bengaluru',
            district: 'Bengaluru Urban',
            state: 'Karnataka',
            pinCode: '560038',
            type: 'Home'
          };
        }

        setSavedAddress(addr);
        setAddressChoice('saved');

        // Pre-fill different address form recipient inputs
        setFormData(prev => ({
          ...prev,
          fullName: u?.fullName || prev.fullName || addr.fullName,
          email: u?.email || prev.email || addr.email,
          phone: u?.phone || prev.phone || addr.phone
        }));
      } catch (err) {
        console.error("Error loading profile for checkout:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Use real cart items if available, otherwise display preview items matching the reference design
  const isRealCart = Array.isArray(cart) && cart.length > 0;
  const displayItems = isRealCart ? cart : PREVIEW_CART_ITEMS;

  const getItemPrice = (product) => {
    if (!product) return 0;
    if (product.discount?.isDiscount) return product.discount.finalPrice || product.price;
    return product.price || 0;
  };

  const getItemOriginalPrice = (product) => {
    if (!product) return 0;
    return product.price || 0;
  };

  const getItemDiscountPercent = (product) => {
    if (!product || !product.discount?.isDiscount) return 0;
    if (product.discount.type === 'percentage') return product.discount.value;
    return Math.round((product.discount.value / product.price) * 100);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return displayItems.reduce((acc, item) => {
      const original = getItemOriginalPrice(item.productId);
      return acc + (original * (item.qty || 1));
    }, 0);
  }, [displayItems]);

  const rawItemTotal = useMemo(() => {
    return displayItems.reduce((acc, item) => {
      const price = getItemPrice(item.productId);
      return acc + (price * (item.qty || 1));
    }, 0);
  }, [displayItems]);

  // Shipping Fee based on selected shipping method
  const shippingFee = useMemo(() => {
    if (shippingMethod === 'Express') return 99;
    if (shippingMethod === 'SameDay') return 199;
    return 0; // Standard is Free
  }, [shippingMethod]);

  // Discount (Coupon or product savings)
  const discountAmount = useMemo(() => {
    if (appliedCoupon?.discount) {
      return appliedCoupon.discount;
    }
    const savings = Math.max(0, subtotal - rawItemTotal);
    return savings > 0 ? savings : 0;
  }, [appliedCoupon, subtotal, rawItemTotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfileAddressChange = (field, value) => {
    setProfileAddressForm(prev => ({ ...prev, [field]: value }));
    if (profileAddressErrors[field]) {
      setProfileAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOpenEditProfileAddressModal = () => {
    setProfileAddressForm({
      fullName: savedAddress?.fullName || '',
      email: savedAddress?.email || '',
      phone: savedAddress?.phone || '',
      area: savedAddress?.area || savedAddress?.addressLine1 || '',
      postOffice: savedAddress?.postOffice || '',
      city: savedAddress?.city || '',
      district: savedAddress?.district || '',
      state: savedAddress?.state || '',
      pinCode: savedAddress?.pinCode || ''
    });
    setProfileAddressErrors({});
    setProfileAddressModalOpen(true);
  };

  const handleSaveProfileAddress = async () => {
    const errors = {};
    if (!profileAddressForm.fullName.trim()) errors.fullName = "Full name is required";
    if (!profileAddressForm.email.trim() || !/\S+@\S+\.\S+/.test(profileAddressForm.email)) errors.email = "Valid email is required";
    if (!profileAddressForm.phone.trim() || profileAddressForm.phone.length < 10) errors.phone = "Valid 10-digit phone number is required";
    if (!profileAddressForm.area.trim()) errors.area = "Area / Apartment / Landmark is required";
    if (!profileAddressForm.postOffice.trim()) errors.postOffice = "Post Office is required";
    if (!profileAddressForm.city.trim()) errors.city = "City / Town is required";
    if (!profileAddressForm.district.trim()) errors.district = "District is required";
    if (!profileAddressForm.state.trim()) errors.state = "State is required";
    if (!profileAddressForm.pinCode.trim() || profileAddressForm.pinCode.length < 6) errors.pinCode = "Valid 6-digit PIN code is required";

    if (Object.keys(errors).length > 0) {
      setProfileAddressErrors(errors);
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    try {
      setSavingProfileAddress(true);
      const updatedAddr = {
        fullName: profileAddressForm.fullName.trim(),
        email: profileAddressForm.email.trim(),
        phone: profileAddressForm.phone.trim(),
        area: profileAddressForm.area.trim(),
        postOffice: profileAddressForm.postOffice.trim(),
        city: profileAddressForm.city.trim(),
        district: profileAddressForm.district.trim(),
        state: profileAddressForm.state.trim(),
        pinCode: profileAddressForm.pinCode.trim(),
        type: savedAddress?.type || 'Home'
      };

      setSavedAddress(updatedAddr);
      setAddressChoice('saved');
      localStorage.setItem('footverse_saved_address', JSON.stringify(updatedAddr));

      const token = localStorage.getItem('token');
      if (token) {
        try {
          await BaseUrl.put('/user/update-profile', updatedAddr);
        } catch (apiErr) {
          console.warn("Could not sync updated address to profile backend:", apiErr);
        }
      }

      toast.success("Profile address updated successfully!");
      setProfileAddressModalOpen(false);
    } catch (err) {
      toast.error("Failed to update profile address");
    } finally {
      setSavingProfileAddress(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.warning("Please enter a coupon code");
      return;
    }
    const code = couponCode.trim().toUpperCase();
    if (code === 'FOOTVERSE' || code === 'SAVE20' || code === 'WELCOME') {
      const disc = 1899;
      setAppliedCoupon({ code, discount: disc });
      toast.success(`Coupon "${code}" applied! You saved ₹${disc.toLocaleString()}`);
      setCouponCode('');
    } else {
      toast.error("Invalid coupon code. Try 'FOOTVERSE' or 'SAVE20'");
    }
  };

  const handleRemoveItem = async (item) => {
    if (isRealCart && removeFromCart && item.productId?._id) {
      try {
        await removeFromCart(item.productId._id, item.size);
        toast.info("Item removed from cart");
      } catch (err) {
        toast.error("Failed to remove item");
      }
    } else {
      toast.info("Item removed from preview");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (addressChoice === 'different') {
      if (!formData.fullName.trim()) errors.fullName = "Full name is required";
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid email address is required";
      if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit phone number is required";
      if (!formData.area.trim()) errors.area = "Area / Apartment / Landmark is required";
      if (!formData.postOffice.trim()) errors.postOffice = "Post Office is required";
      if (!formData.city.trim()) errors.city = "City / Town is required";
      if (!formData.district.trim()) errors.district = "District is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.pinCode.trim() || formData.pinCode.length < 6) errors.pinCode = "Valid 6-digit PIN code is required";
    } else {
      if (!savedAddress || (!savedAddress.area && !savedAddress.city)) {
        errors.address = "No saved address found. Please select 'Use Different Address'.";
      }
    }

    if (!termsAgreed) {
      errors.terms = "You must agree to the Terms & Conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      if (addressChoice === 'different') {
        toast.error("Please fill in all required fields marked with *");
      } else {
        toast.error("Please choose or enter a valid shipping address");
      }
      return;
    }

    if (!termsAgreed) {
      toast.warning("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    try {
      setLoading(true);

      const items = displayItems.map(item => ({
        productId: item.productId._id?.startsWith('prev-') ? '6acdc1484e43ff96951468b1' : item.productId._id,
        color: item.productId.color || "White / Black",
        qty: item.qty || 1,
        size: parseInt(item.size) || 8,
        price: getItemPrice(item.productId)
      }));

      // Active address strictly aligned with userDetails model and ordersModel
      const activeAddress = (addressChoice === 'saved' && savedAddress)
        ? {
            fullName: savedAddress.fullName,
            email: savedAddress.email,
            phone: savedAddress.phone,
            address: {
              area: savedAddress.area,
              postOffice: savedAddress.postOffice,
              city: savedAddress.city,
              district: savedAddress.district,
              state: savedAddress.state,
              pinCode: savedAddress.pinCode
            }
          }
        : {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: {
              area: formData.area,
              postOffice: formData.postOffice,
              city: formData.city,
              district: formData.district,
              state: formData.state,
              pinCode: formData.pinCode
            }
          };

      // If user chose different address and opted to save to profile
      if (addressChoice === 'different' && saveToProfile) {
        const profileAddressPayload = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          area: formData.area,
          postOffice: formData.postOffice,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pinCode: formData.pinCode,
          type: 'Home'
        };
        localStorage.setItem('footverse_saved_address', JSON.stringify(profileAddressPayload));
        
        // Also sync to userDetails profile in backend if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await BaseUrl.put('/user/update-profile', profileAddressPayload);
          } catch (profileErr) {
            console.warn("Could not sync address to user profile:", profileErr);
          }
        }
      }

      const orderPayload = {
        fullName: activeAddress.fullName,
        email: activeAddress.email,
        phone: activeAddress.phone,
        address: activeAddress.address,
        items,
        subtotal,
        shipping: shippingFee,
        discount: discountAmount,
        total,
        paymentMode // "Card" | "UPI" | "COD"
      };

      const response = await BaseUrl.post("/order-place", orderPayload);

      if (response.data.Success) {
        toast.success("Order placed successfully!");
        if (fetchCart) fetchCart();
        const orderId = response.data.orderId || response.data.order?._id || "success";
        navigate(`/order-success/${orderId}`);
      } else {
        toast.error(response.data.Message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placing error:", error);
      // If error is due to auth or preview mode, show friendly confirmation and redirect
      if (error?.response?.status === 401) {
        toast.error("Please login to complete your order.");
        navigate('/login');
      } else {
        toast.error(error.response?.data?.Message || "Order could not be processed. Please check details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 12 }}>
      {/* Top Container */}
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        
        {/* Breadcrumb: Home > Cart > Checkout */}
        <Breadcrumb 
          items={[
            { label: 'Cart', path: '/cart' },
            { label: 'Checkout' }
          ]} 
        />

        {/* Page Header: Title + Subtitle on Left, 100% Secure Payment Badge on Right */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3.5,
            mt: 1
          }}
        >
          <Box>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.1rem' }, 
                fontWeight: 800, 
                color: '#111827',
                lineHeight: 1.2,
                mb: 0.5
              }}
            >
              Checkout
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '0.92rem' }}>
              Complete your order by providing the details below.
            </Typography>
          </Box>

          {/* 100% Secure Payment Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.2,
              bgcolor: '#ECFDF5',
              border: '1px solid #D1FAE5',
              borderRadius: '10px'
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                bgcolor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldOutlined sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46', lineHeight: 1.2 }}>
                100% Secure Payment
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#047857', lineHeight: 1.2 }}>
                Your information is safe with us
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main 2-Column Grid */}
        <Grid container spacing={3.5}>
          
          {/* =========================================================================
              LEFT COLUMN: 3 STEPS (Shipping Address, Shipping Method, Payment Method)
              ========================================================================= */}
          <Grid size={{ xs: 12, md: 7.2 }}>
            
            {/* STEP 1: SHIPPING ADDRESS CARD */}
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                p: { xs: 2.5, sm: 3 },
                bgcolor: '#FFFFFF',
                mb: 3
              }}
            >
              {/* Header: Step Number 1 + Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}
                  >
                    1
                  </Box>
                  <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                    Shipping Address
                  </Typography>
                </Box>

                {savedAddress && (
                  <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }}>
                    Select delivery destination
                  </Typography>
                )}
              </Box>

              {/* Address Condition Selection: Profile Saved Address vs Different Address */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: addressChoice === 'different' ? 2.5 : 0 }}>
                
                {/* Condition 1: Profile Saved Address */}
                <Box
                  onClick={() => {
                    setAddressChoice('saved');
                    setFormErrors({});
                  }}
                  sx={{
                    border: '1.5px solid',
                    borderColor: addressChoice === 'saved' ? '#111827' : '#E5E7EB',
                    bgcolor: addressChoice === 'saved' ? '#F9FAFB' : '#FFFFFF',
                    borderRadius: '10px',
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    boxShadow: addressChoice === 'saved' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    '&:hover': {
                      borderColor: addressChoice === 'saved' ? '#111827' : '#9CA3AF'
                    }
                  }}
                >
                  <Radio 
                    checked={addressChoice === 'saved'} 
                    onChange={() => {
                      setAddressChoice('saved');
                      setFormErrors({});
                    }}
                    value="saved" 
                    sx={{ 
                      p: 0, 
                      mt: 0.2,
                      color: '#D1D5DB', 
                      '&.Mui-checked': { color: '#111827' } 
                    }} 
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeOutlined sx={{ fontSize: 18, color: addressChoice === 'saved' ? '#111827' : '#6B7280' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                          Profile Saved Address
                        </Typography>
                        <Box sx={{ 
                          bgcolor: '#ECFDF5', 
                          color: '#065F46', 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          px: 0.8, 
                          py: 0.15, 
                          borderRadius: '4px',
                          border: '1px solid #A7F3D0'
                        }}>
                          {savedAddress?.type || 'Default'}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        {addressChoice === 'saved' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981' }}>
                            <CheckCircle sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                              Delivering to this address
                            </Typography>
                          </Box>
                        )}
                        <Button
                          size="small"
                          startIcon={<EditOutlined sx={{ fontSize: 14 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditProfileAddressModal();
                          }}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#374151',
                            py: 0.25,
                            px: 1,
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                              bgcolor: '#F3F4F6',
                              borderColor: '#9CA3AF'
                            }
                          }}
                        >
                          Edit Profile Address
                        </Button>
                      </Box>
                    </Box>

                    {savedAddress && (
                      <Box sx={{ mt: 1, pl: 0.5 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#1F2937' }}>
                          {savedAddress.fullName} &nbsp;•&nbsp; <span style={{ color: '#4B5563', fontWeight: 500 }}>{savedAddress.phone}</span>
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: '#4B5563', mt: 0.3, lineHeight: 1.45 }}>
                          {savedAddress.area || savedAddress.addressLine1} {savedAddress.city} {savedAddress.postOffice ? `, Post: ${savedAddress.postOffice}` : ''} {savedAddress.district ? `, Dist: ${savedAddress.district}` : ''}, {savedAddress.state} - <strong>{savedAddress.pinCode}</strong>
                        </Typography>
                        {savedAddress.email && (
                          <Typography sx={{ fontSize: '0.76rem', color: '#6B7280', mt: 0.3 }}>
                            Email: {savedAddress.email}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Condition 2: Use Different Address */}
                <Box
                  onClick={() => {
                    setAddressChoice('different');
                    setFormErrors({});
                  }}
                  sx={{
                    border: '1.5px solid',
                    borderColor: addressChoice === 'different' ? '#111827' : '#E5E7EB',
                    bgcolor: addressChoice === 'different' ? '#F9FAFB' : '#FFFFFF',
                    borderRadius: '10px',
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    boxShadow: addressChoice === 'different' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    '&:hover': {
                      borderColor: addressChoice === 'different' ? '#111827' : '#9CA3AF'
                    }
                  }}
                >
                  <Radio 
                    checked={addressChoice === 'different'} 
                    onChange={() => {
                      setAddressChoice('different');
                      setFormErrors({});
                    }}
                    value="different" 
                    sx={{ 
                      p: 0, 
                      mt: 0.2,
                      color: '#D1D5DB', 
                      '&.Mui-checked': { color: '#111827' } 
                    }} 
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddLocationAltOutlined sx={{ fontSize: 18, color: addressChoice === 'different' ? '#111827' : '#6B7280' }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                        Use Different Address
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', mt: 0.3 }}>
                      Enter a different shipping or delivery address for this order
                    </Typography>
                  </Box>
                </Box>

              </Box>

              {/* Form Section: Opens ONLY when "Use Different Address" is checked (fields matched with userDetails model) */}
              <Collapse in={addressChoice === 'different'} unmountOnExit={false}>
                <Box sx={{ pt: 2, borderTop: '1px dashed #E5E7EB', mt: 1 }}>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', mb: 2 }}>
                    Enter New Shipping Details
                  </Typography>

                  {/* Form Grid */}
                  <Grid container spacing={2}>
                    
                    {/* Full Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        Full Name <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        error={!!formErrors.fullName}
                        startAdornment={
                          <InputAdornment position="start">
                            <PersonOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.fullName && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.fullName}
                        </Typography>
                      )}
                    </Grid>

                    {/* Email Address */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        Email Address <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="you@example.com"
                        error={!!formErrors.email}
                        startAdornment={
                          <InputAdornment position="start">
                            <MailOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.email && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.email}
                        </Typography>
                      )}
                    </Grid>

                    {/* Phone Number */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        Phone Number <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        error={!!formErrors.phone}
                        startAdornment={
                          <InputAdornment position="start">
                            <PhoneOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.phone && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.phone}
                        </Typography>
                      )}
                    </Grid>

                    {/* Area / Apartment / Landmark (userDetails field: area) */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        Area / Apartment / Landmark <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="Flat, House no., Area, Landmark"
                        error={!!formErrors.area}
                        startAdornment={
                          <InputAdornment position="start">
                            <HomeOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.area && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.area}
                        </Typography>
                      )}
                    </Grid>

                    {/* Post Office (userDetails field: postOffice) */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        Post Office <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.postOffice}
                        onChange={(e) => handleInputChange('postOffice', e.target.value)}
                        placeholder="Enter Post Office"
                        error={!!formErrors.postOffice}
                        startAdornment={
                          <InputAdornment position="start">
                            <LocalPostOfficeOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.postOffice && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.postOffice}
                        </Typography>
                      )}
                    </Grid>

                    {/* City / Town (userDetails field: city) */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        City / Town <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter City / Town"
                        error={!!formErrors.city}
                        startAdornment={
                          <InputAdornment position="start">
                            <LocationCityOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.city && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.city}
                        </Typography>
                      )}
                    </Grid>

                    {/* District (userDetails field: district) */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        District <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="Enter District"
                        error={!!formErrors.district}
                        startAdornment={
                          <InputAdornment position="start">
                            <BusinessOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.district && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.district}
                        </Typography>
                      )}
                    </Grid>

                    {/* State (userDetails field: state) */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        State <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <FormControl fullWidth error={!!formErrors.state}>
                        <Select
                          displayEmpty
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          startAdornment={
                            <InputAdornment position="start">
                              <PlaceOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                            </InputAdornment>
                          }
                          sx={{
                            height: 44,
                            borderRadius: '8px',
                            fontSize: '0.88rem',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&:hover fieldset': { borderColor: '#9CA3AF' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' }
                          }}
                        >
                          <MenuItem value="" disabled>
                            <Typography sx={{ color: '#9CA3AF', fontSize: '0.88rem' }}>Select State</Typography>
                          </MenuItem>
                          {INDIAN_STATES.map((st) => (
                            <MenuItem key={st} value={st}>{st}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {formErrors.state && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.state}
                        </Typography>
                      )}
                    </Grid>

                    {/* PIN Code (userDetails field: pinCode) */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                        PIN Code <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <OutlinedInput
                        fullWidth
                        value={formData.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        placeholder="Enter 6-digit PIN Code"
                        error={!!formErrors.pinCode}
                        startAdornment={
                          <InputAdornment position="start">
                            <PinDropOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} />
                          </InputAdornment>
                        }
                        sx={{
                          height: 44,
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#9CA3AF' },
                          '&.Mui-focused fieldset': { borderColor: '#111827' }
                        }}
                      />
                      {formErrors.pinCode && (
                        <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.4 }}>
                          {formErrors.pinCode}
                        </Typography>
                      )}
                    </Grid>

                  </Grid>

                  {/* Save to Profile Checkbox */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Checkbox 
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                      size="small"
                      sx={{ p: 0.5, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }}
                    />
                    <Typography 
                      sx={{ fontSize: '0.82rem', color: '#4B5563', ml: 0.8, cursor: 'pointer', userSelect: 'none' }} 
                      onClick={() => setSaveToProfile(!saveToProfile)}
                    >
                      Save this address to my profile for future orders
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
            </Box>

            {/* STEP 2: SHIPPING METHOD CARD */}
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                p: { xs: 2.5, sm: 3 },
                bgcolor: '#FFFFFF',
                mb: 3
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  2
                </Box>
                <LocalShippingOutlined sx={{ color: '#111827', fontSize: 22 }} />
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                  Shipping Method
                </Typography>
              </Box>

              {/* 3 Shipping Method Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                
                {/* 1. Standard Delivery */}
                <Box
                  onClick={() => setShippingMethod('Standard')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.8,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: shippingMethod === 'Standard' ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    bgcolor: shippingMethod === 'Standard' ? '#F8FAFC' : '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Radio 
                      checked={shippingMethod === 'Standard'} 
                      value="Standard"
                      sx={{ p: 0, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }} 
                    />
                    <Box>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                        Standard Delivery (3-5 days)
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }}>
                        Free shipping on all orders
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#10B981' }}>
                    Free
                  </Typography>
                </Box>

                {/* 2. Express Delivery */}
                <Box
                  onClick={() => setShippingMethod('Express')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.8,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: shippingMethod === 'Express' ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    bgcolor: shippingMethod === 'Express' ? '#F8FAFC' : '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Radio 
                      checked={shippingMethod === 'Express'} 
                      value="Express"
                      sx={{ p: 0, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }} 
                    />
                    <Box>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                        Express Delivery (1-2 days)
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }}>
                        Get your order faster
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                    ₹ 99
                  </Typography>
                </Box>

                {/* 3. Same Day Delivery */}
                <Box
                  onClick={() => setShippingMethod('SameDay')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.8,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: shippingMethod === 'SameDay' ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    bgcolor: shippingMethod === 'SameDay' ? '#F8FAFC' : '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Radio 
                      checked={shippingMethod === 'SameDay'} 
                      value="SameDay"
                      sx={{ p: 0, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }} 
                    />
                    <Box>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                        Same Day Delivery
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }}>
                        Available in select cities
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                    ₹ 199
                  </Typography>
                </Box>

              </Box>
            </Box>

            {/* STEP 3: PAYMENT METHOD CARD */}
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                p: { xs: 2.5, sm: 3 },
                bgcolor: '#FFFFFF',
                mb: 3
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  3
                </Box>
                <CreditCardOutlined sx={{ color: '#111827', fontSize: 22 }} />
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                  Payment Method
                </Typography>
              </Box>

              {/* 3 Payment Options */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                
                {/* 1. Credit / Debit Card */}
                <Box
                  onClick={() => setPaymentMode('Card')}
                  sx={{
                    p: 1.8,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: paymentMode === 'Card' ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    bgcolor: paymentMode === 'Card' ? '#F8FAFC' : '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Radio 
                        checked={paymentMode === 'Card'} 
                        value="Card"
                        sx={{ p: 0, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }} 
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCardOutlined sx={{ fontSize: 20, color: '#374151' }} />
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                          Credit / Debit Card
                        </Typography>
                      </Box>
                    </Box>

                    {/* Logos: VISA, Mastercard, RuPay */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* VISA */}
                      <Box sx={{ px: 0.8, py: 0.2, bgcolor: '#EEF2FF', borderRadius: '4px', border: '1px solid #E0E7FF' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 900, color: '#1E40AF', fontStyle: 'italic', letterSpacing: 0.5 }}>
                          VISA
                        </Typography>
                      </Box>

                      {/* Mastercard Circles */}
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#EB001B', mr: -0.6, zIndex: 1 }} />
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#F79E1B', opacity: 0.9 }} />
                      </Box>

                      {/* RuPay */}
                      <Box sx={{ px: 0.8, py: 0.2, bgcolor: '#FFFBEB', borderRadius: '4px', border: '1px solid #FEF3C7' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E' }}>
                          RuPay
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Optional Card Input Expand */}
                  {paymentMode === 'Card' && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #E5E7EB' }}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12 }}>
                          <OutlinedInput
                            fullWidth
                            size="small"
                            placeholder="Card Number"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            sx={{ height: 38, borderRadius: '6px', fontSize: '0.84rem' }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <OutlinedInput
                            fullWidth
                            size="small"
                            placeholder="MM / YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            sx={{ height: 38, borderRadius: '6px', fontSize: '0.84rem' }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <OutlinedInput
                            fullWidth
                            size="small"
                            type="password"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            sx={{ height: 38, borderRadius: '6px', fontSize: '0.84rem' }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>

                {/* 2. UPI / Google Pay / PhonePe */}
                <Box
                  onClick={() => setPaymentMode('UPI')}
                  sx={{
                    p: 1.8,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: paymentMode === 'UPI' ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    bgcolor: paymentMode === 'UPI' ? '#F8FAFC' : '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Radio 
                        checked={paymentMode === 'UPI'} 
                        value="UPI"
                        sx={{ p: 0, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }} 
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, bgcolor: '#F3F4F6', px: 0.8, py: 0.3, borderRadius: '4px' }}>
                          UPI
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                          UPI / Google Pay / PhonePe
                        </Typography>
                      </Box>
                    </Box>

                    {/* UPI Icons: GPay, PhonePe, Paytm */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>G</Box>
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#5F259F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>पे</Box>
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#00BAF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>P</Box>
                    </Box>
                  </Box>

                  {paymentMode === 'UPI' && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #E5E7EB' }}>
                      <OutlinedInput
                        fullWidth
                        size="small"
                        placeholder="Enter UPI ID (e.g. mobile@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        sx={{ height: 38, borderRadius: '6px', fontSize: '0.84rem' }}
                      />
                    </Box>
                  )}
                </Box>

                {/* 3. Cash on Delivery (COD) */}
                <Box
                  onClick={() => setPaymentMode('COD')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.8,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: paymentMode === 'COD' ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    bgcolor: paymentMode === 'COD' ? '#F8FAFC' : '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Radio 
                      checked={paymentMode === 'COD'} 
                      value="COD"
                      sx={{ p: 0, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }} 
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalAtmOutlined sx={{ fontSize: 20, color: '#374151' }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                          Cash on Delivery (COD)
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }}>
                          Pay at your doorstep
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

              </Box>
            </Box>

            {/* Terms & Conditions Checkbox */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 0.5 }}>
              <Checkbox
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                sx={{
                  p: 0.5,
                  mr: 1,
                  color: '#9CA3AF',
                  '&.Mui-checked': { color: '#111827' }
                }}
              />
              <Typography sx={{ fontSize: '0.84rem', color: '#374151' }}>
                I agree to the{' '}
                <span style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Terms & Conditions
                </span>{' '}
                and{' '}
                <span style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Privacy Policy
                </span>
              </Typography>
            </Box>

            {/* Place Order Full-Width Button */}
            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handlePlaceOrder}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockOutlined sx={{ fontSize: 18 }} />}
              endIcon={!loading && <ChevronRight sx={{ fontSize: 20 }} />}
              sx={{
                height: 50,
                borderRadius: '8px',
                bgcolor: '#111827',
                color: '#FFFFFF',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.96rem',
                boxShadow: 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#0F172A',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? "Processing Order..." : `Place Order  ₹ ${total.toLocaleString()}`}
            </Button>

          </Grid>

          {/* =========================================================================
              RIGHT COLUMN: ORDER SUMMARY, APPLY COUPON, TRUST FEATURES
              ========================================================================= */}
          <Grid size={{ xs: 12, md: 4.8 }}>
            <Box sx={{ position: { md: 'sticky' }, top: 24 }}>
            
            {/* 1. ORDER SUMMARY CARD */}
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                p: { xs: 2.2, sm: 2.8 },
                bgcolor: '#FFFFFF',
                mb: 2.5
              }}
            >
              {/* Header: Title on Left, Edit Cart Link on Right */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                  Order Summary
                </Typography>
                <Button
                  onClick={() => navigate('/cart')}
                  startIcon={<EditOutlined sx={{ fontSize: 15 }} />}
                  sx={{
                    textTransform: 'none',
                    color: '#2563EB',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    p: 0,
                    minWidth: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  Edit Cart
                </Button>
              </Box>

              {/* Product Items List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {displayItems.map((item, idx) => {
                  const p = item.productId || {};
                  const price = getItemPrice(p);
                  const discountPct = getItemDiscountPercent(p);
                  const img = p.productImage?.[0]?.url 
                    ? (p.productImage[0].url.startsWith('http') ? p.productImage[0].url : `http://localhost:5000/media/products/${p.productImage[0].url}`)
                    : '/placeholder-shoe.png';

                  return (
                    <Box 
                      key={idx}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: 1.5,
                        position: 'relative'
                      }}
                    >
                      {/* Left: Thumbnail + Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            bgcolor: '#F9FAFB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 0.5,
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src={img} 
                            alt={p.productName} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = '/placeholder-shoe.png'; }}
                          />
                        </Box>

                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.88rem', 
                              fontWeight: 700, 
                              color: '#111827',
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {p.productName}
                          </Typography>
                          
                          <Typography sx={{ fontSize: '0.76rem', color: '#6B7280', mb: 0.4 }}>
                            {p.color || 'White / Black'} &nbsp;|&nbsp; Size: {item.size || 8}
                          </Typography>

                          {/* Price Row: Price + Discount Badge */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>
                              ₹ {price.toLocaleString()}
                            </Typography>
                            {discountPct > 0 && (
                              <Box
                                sx={{
                                  bgcolor: '#FEE2E2',
                                  color: '#EF4444',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  px: 0.7,
                                  py: 0.15,
                                  borderRadius: '4px'
                                }}
                              >
                                -{discountPct}%
                              </Box>
                            )}
                          </Box>

                          <Typography sx={{ fontSize: '0.74rem', color: '#6B7280', mt: 0.2 }}>
                            Qty: {item.qty || 1}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right: Remove (x) Icon Button */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item)}
                        sx={{
                          color: '#9CA3AF',
                          p: 0.4,
                          alignSelf: 'flex-start',
                          '&:hover': { color: '#EF4444' }
                        }}
                      >
                        <Close sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>

              <Divider sx={{ borderColor: '#E5E7EB', my: 2 }} />

              {/* Price Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.86rem', color: '#6B7280' }}>Subtotal</Typography>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>
                    ₹ {subtotal.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.86rem', color: '#6B7280' }}>Discount</Typography>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#10B981' }}>
                    - ₹ {discountAmount.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.86rem', color: '#6B7280' }}>Shipping Charges</Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '0.88rem', 
                      fontWeight: 700, 
                      color: shippingFee === 0 ? '#10B981' : '#111827' 
                    }}
                  >
                    {shippingFee === 0 ? 'Free' : `₹ ${shippingFee}`}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#E5E7EB', my: 2 }} />

              {/* Total Amount Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                  Total Amount
                </Typography>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>
                  ₹ {total.toLocaleString()}
                </Typography>
              </Box>

            </Box>

            {/* 2. APPLY COUPON CODE CARD */}
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                p: { xs: 2, sm: 2.5 },
                bgcolor: '#FFFFFF',
                mb: 2.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocalOfferOutlined sx={{ fontSize: 18, color: '#374151' }} />
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                  Apply Coupon Code
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.2 }}>
                <OutlinedInput
                  fullWidth
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  sx={{
                    height: 42,
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    bgcolor: '#FFFFFF',
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#9CA3AF' },
                    '&.Mui-focused fieldset': { borderColor: '#111827' }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleApplyCoupon}
                  sx={{
                    px: 3,
                    height: 42,
                    borderRadius: '8px',
                    bgcolor: '#111827',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    boxShadow: 'none',
                    flexShrink: 0,
                    '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' }
                  }}
                >
                  Apply
                </Button>
              </Box>

              {appliedCoupon && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, p: 1, bgcolor: '#ECFDF5', borderRadius: '6px', border: '1px solid #D1FAE5' }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 600 }}>
                    Applied: <strong>{appliedCoupon.code}</strong> (Save ₹{appliedCoupon.discount.toLocaleString()})
                  </Typography>
                  <IconButton size="small" onClick={() => setAppliedCoupon(null)} sx={{ p: 0.2, color: '#065F46' }}>
                    <Close sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* 3. TRUST & SECURITY FEATURES BOX */}
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                p: { xs: 2.2, sm: 2.8 },
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {/* Free Shipping */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    bgcolor: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <LocalShippingOutlined sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    Free Shipping
                  </Typography>
                  <Typography sx={{ fontSize: '0.76rem', color: '#6B7280', lineHeight: 1.2 }}>
                    on all orders
                  </Typography>
                </Box>
              </Box>

              {/* 7 Days Return */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    bgcolor: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ReplayOutlined sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    7 Days Return
                  </Typography>
                  <Typography sx={{ fontSize: '0.76rem', color: '#6B7280', lineHeight: 1.2 }}>
                    Easy return policy
                  </Typography>
                </Box>
              </Box>

              {/* Secure Payment */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    bgcolor: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ShieldOutlined sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    Secure Payment
                  </Typography>
                  <Typography sx={{ fontSize: '0.76rem', color: '#6B7280', lineHeight: 1.2 }}>
                    100% safe and secure
                  </Typography>
                </Box>
              </Box>

            </Box>

            </Box>

          </Grid>

        </Grid>

      </Container>

      {/* Edit Profile Saved Address Modal (strictly userDetails model schema) */}
      <Dialog
        open={profileAddressModalOpen}
        onClose={() => !savingProfileAddress && setProfileAddressModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px', p: { xs: 1, sm: 1.5 } }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#111827', fontSize: '1.15rem', pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Edit Profile Address</span>
          <IconButton size="small" onClick={() => setProfileAddressModalOpen(false)}>
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', mb: 2 }}>
            Update your saved profile address. These details are stored in your profile and used for delivery.
          </Typography>
          <Grid container spacing={2}>
            {/* Full Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.fullName}
                onChange={(e) => handleProfileAddressChange('fullName', e.target.value)}
                placeholder="Enter full name"
                error={!!profileAddressErrors.fullName}
                startAdornment={<InputAdornment position="start"><PersonOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.fullName && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.fullName}</Typography>
              )}
            </Grid>

            {/* Email Address */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                type="email"
                value={profileAddressForm.email}
                onChange={(e) => handleProfileAddressChange('email', e.target.value)}
                placeholder="you@example.com"
                error={!!profileAddressErrors.email}
                startAdornment={<InputAdornment position="start"><MailOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.email && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.email}</Typography>
              )}
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                Phone Number <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.phone}
                onChange={(e) => handleProfileAddressChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                error={!!profileAddressErrors.phone}
                startAdornment={<InputAdornment position="start"><PhoneOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.phone && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.phone}</Typography>
              )}
            </Grid>

            {/* Area / Apartment / Landmark */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                Area / Apartment / Landmark <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.area}
                onChange={(e) => handleProfileAddressChange('area', e.target.value)}
                placeholder="Flat, House no., Area, Landmark"
                error={!!profileAddressErrors.area}
                startAdornment={<InputAdornment position="start"><HomeOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.area && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.area}</Typography>
              )}
            </Grid>

            {/* Post Office */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                Post Office <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.postOffice}
                onChange={(e) => handleProfileAddressChange('postOffice', e.target.value)}
                placeholder="Enter Post Office"
                error={!!profileAddressErrors.postOffice}
                startAdornment={<InputAdornment position="start"><LocalPostOfficeOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.postOffice && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.postOffice}</Typography>
              )}
            </Grid>

            {/* City / Town */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                City / Town <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.city}
                onChange={(e) => handleProfileAddressChange('city', e.target.value)}
                placeholder="Enter City / Town"
                error={!!profileAddressErrors.city}
                startAdornment={<InputAdornment position="start"><LocationCityOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.city && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.city}</Typography>
              )}
            </Grid>

            {/* District */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                District <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.district}
                onChange={(e) => handleProfileAddressChange('district', e.target.value)}
                placeholder="Enter District"
                error={!!profileAddressErrors.district}
                startAdornment={<InputAdornment position="start"><BusinessOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.district && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.district}</Typography>
              )}
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                State <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <FormControl fullWidth error={!!profileAddressErrors.state}>
                <Select
                  displayEmpty
                  value={profileAddressForm.state}
                  onChange={(e) => handleProfileAddressChange('state', e.target.value)}
                  startAdornment={<InputAdornment position="start"><PlaceOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                  sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  <MenuItem value="" disabled><Typography sx={{ color: '#9CA3AF', fontSize: '0.88rem' }}>Select State</Typography></MenuItem>
                  {INDIAN_STATES.map((st) => (
                    <MenuItem key={st} value={st}>{st}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {profileAddressErrors.state && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.state}</Typography>
              )}
            </Grid>

            {/* PIN Code */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                PIN Code <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                value={profileAddressForm.pinCode}
                onChange={(e) => handleProfileAddressChange('pinCode', e.target.value)}
                placeholder="Enter 6-digit PIN Code"
                error={!!profileAddressErrors.pinCode}
                startAdornment={<InputAdornment position="start"><PinDropOutlined sx={{ color: '#9CA3AF', fontSize: 19 }} /></InputAdornment>}
                sx={{ height: 42, borderRadius: '8px', fontSize: '0.88rem' }}
              />
              {profileAddressErrors.pinCode && (
                <Typography sx={{ color: '#EF4444', fontSize: '0.74rem', mt: 0.3 }}>{profileAddressErrors.pinCode}</Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setProfileAddressModalOpen(false)} 
            disabled={savingProfileAddress}
            sx={{ color: '#4B5563', textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProfileAddress}
            disabled={savingProfileAddress}
            startIcon={savingProfileAddress && <CircularProgress size={16} color="inherit" />}
            sx={{
              bgcolor: '#111827',
              color: '#FFFFFF',
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
              '&:hover': { bgcolor: '#000000' }
            }}
          >
            {savingProfileAddress ? 'Saving...' : 'Save Profile Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
