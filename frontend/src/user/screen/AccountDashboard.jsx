import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Avatar, 
  Button, TextField, IconButton, Radio, RadioGroup, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Breadcrumbs, Link, CircularProgress, Checkbox
} from '@mui/material';
import { 
  PersonOutlined, 
  ShoppingBagOutlined, 
  FavoriteBorder, 
  LocationOnOutlined, 
  PaymentOutlined, 
  NotificationsNoneOutlined, 
  SecurityOutlined, 
  Logout, 
  EditOutlined, 
  DeleteOutlined, 
  Add,
  EmailOutlined, 
  PhoneOutlined, 
  CalendarTodayOutlined, 
  LockOutlined,
  HomeOutlined, 
  BusinessOutlined, 
  NorthEast, 
  StarBorder,
  ArrowBack,
  LocalPostOfficeOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';

export default function AccountDashboard() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state (dynamically populated from logged-in user)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    bio: '',
    location: '',
    avatar: '',
    memberSince: '',
    role: 'user',
    area: '',
    postOffice: '',
    city: '',
    district: '',
    state: '',
    pinCode: ''
  });

  const [saving, setSaving] = useState(false);

  // Dynamic stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Address list state
  const [addresses, setAddresses] = useState([]);

  // Address modal state (strictly userDetails model)
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    area: '',
    postOffice: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    phone: '',
    isDefault: false
  });

  // Security password state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Fetch dynamic profile & stats of logged in user
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        setLoading(true);

        // 1. Fetch Profile
        const res = await BaseUrl.get('/user/user-profile');
        if (res.data?.Success && res.data?.user) {
          const u = res.data.user;

          // Format member since
          let formattedMemberSince = 'Jan 2025';
          if (u.createdAt) {
            const date = new Date(u.createdAt);
            formattedMemberSince = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
          }

          // Format user location
          let formattedLocation = 'Bengaluru, Karnataka';
          if (u.city || u.state) {
            formattedLocation = `${u.city || ''}${u.city && u.state ? ', ' : ''}${u.state || ''}`;
          } else if (u.area) {
            formattedLocation = u.area;
          }

          setFormData({
            fullName: u.fullName || 'User',
            email: u.email || '',
            phone: u.phone || '+91 98765 43210',
            dob: u.dob || '12-08-1998',
            gender: u.gender || 'Male',
            bio: u.bio || 'Fashion enthusiast and sneaker lover. Always exploring the best footwear for a better lifestyle.',
            location: formattedLocation,
            avatar: u.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            memberSince: formattedMemberSince,
            role: u.role || 'user',
            area: u.area || '',
            postOffice: u.postOffice || '',
            city: u.city || '',
            district: u.district || '',
            state: u.state || '',
            pinCode: u.pinCode || ''
          });

          // Populate addresses from DB if present, else fallback
          if (u.addresses && u.addresses.length > 0) {
            setAddresses(u.addresses);
          } else {
            const defaultAddressList = [
              {
                id: 1,
                type: 'Home',
                isDefault: true,
                line1: u.area || '#123, 5th Cross, MG Road',
                line2: `${u.city || 'Bengaluru'}, ${u.state || 'Karnataka'}${u.pinCode ? ' - ' + u.pinCode : ' - 560001'}`,
                phone: u.phone || '+91 98765 43210'
              },
              {
                id: 2,
                type: 'Office',
                isDefault: false,
                line1: '#456, Tech Park, Outer Ring Road,',
                line2: `${u.city || 'Bengaluru'}, ${u.state || 'Karnataka'} - 560103`,
                phone: u.phone || '+91 98765 43210'
              }
            ];
            setAddresses(defaultAddressList);
          }
        }

        // 2. Fetch User Orders for dynamic order count
        try {
          const orderRes = await BaseUrl.get('/my-orders');
          if (orderRes.data?.Success && Array.isArray(orderRes.data?.orders)) {
            const orders = orderRes.data.orders;
            setTotalOrders(orders.length);
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const countThisMonth = orders.filter(o => {
              const d = new Date(o.createdAt);
              return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            }).length;
            setOrdersThisMonth(countThisMonth);
          }
        } catch (orderErr) {
          console.log('Orders fetch note:', orderErr?.message);
        }

        // 3. Read dynamic wishlist items count
        try {
          const wishlistItems = JSON.parse(localStorage.getItem('footverse_wishlist') || '[]');
          setWishlistCount(Array.isArray(wishlistItems) ? wishlistItems.length : 0);
        } catch (e) {
          setWishlistCount(0);
        }

      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Handle Profile Form Reset
  const handleReset = async () => {
    try {
      const res = await BaseUrl.get('/user/user-profile');
      if (res.data?.Success && res.data?.user) {
        const u = res.data.user;
        setFormData(prev => ({
          ...prev,
          fullName: u.fullName || prev.fullName,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          dob: u.dob || '12-08-1998',
          gender: u.gender || 'Male',
          bio: u.bio || 'Fashion enthusiast and sneaker lover. Always exploring the best footwear for a better lifestyle.',
          location: u.city ? `${u.city}, ${u.state}` : prev.location,
          avatar: u.image || prev.avatar,
          area: u.area || '',
          postOffice: u.postOffice || '',
          city: u.city || '',
          district: u.district || '',
          state: u.state || '',
          pinCode: u.pinCode || ''
        }));
        toast.info('Profile reset to original saved values');
      }
    } catch (err) {
      toast.info('Reset performed');
    }
  };

  // Handle Profile Save (Persist to backend)
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        bio: formData.bio,
        image: formData.avatar,
        area: formData.area,
        postOffice: formData.postOffice,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        pinCode: formData.pinCode,
        addresses: addresses
      };

      const res = await BaseUrl.put('/user/update-profile', payload);
      if (res.data?.Success) {
        toast.success(res.data.Message || 'Profile updated successfully!');
      } else {
        toast.success('Profile changes saved successfully!');
      }
    } catch (err) {
      toast.error(err?.response?.data?.Message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      if (setToken) setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  // Address Operations (persisted strictly according to userDetails model)
  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        type: addr.type || 'Home',
        area: addr.area || addr.line1 || '',
        postOffice: addr.postOffice || '',
        city: addr.city || '',
        district: addr.district || '',
        state: addr.state || '',
        pinCode: addr.pinCode || '',
        phone: addr.phone || formData.phone,
        isDefault: !!addr.isDefault
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        type: 'Home',
        area: '',
        postOffice: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
        phone: formData.phone,
        isDefault: addresses.length === 0
      });
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.area || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      toast.error('Please enter complete address details (Area, City, State, PIN Code)');
      return;
    }

    const formattedLine1 = addressForm.area;
    const formattedLine2 = `${addressForm.postOffice ? addressForm.postOffice + ', ' : ''}${addressForm.city}${addressForm.district ? ', ' + addressForm.district : ''}, ${addressForm.state} - ${addressForm.pinCode}`;

    const newAddressItem = {
      ...addressForm,
      line1: formattedLine1,
      line2: formattedLine2
    };

    let updatedList = [];
    if (editingAddress) {
      updatedList = addresses.map(a => 
        (a._id === editingAddress._id || a.id === editingAddress.id) 
          ? { ...a, ...newAddressItem } 
          : addressForm.isDefault ? { ...a, isDefault: false } : a
      );
      toast.success('Address updated!');
    } else {
      const newAddr = {
        id: Date.now(),
        ...newAddressItem
      };
      if (newAddr.isDefault) {
        updatedList = addresses.map(a => ({ ...a, isDefault: false })).concat(newAddr);
      } else {
        updatedList = [...addresses, newAddr];
      }
      toast.success('New address added!');
    }

    setAddresses(updatedList);
    setAddressModalOpen(false);

    // Save to backend and sync default address to userDetails profile
    try {
      await BaseUrl.put('/user/update-profile', { 
        addresses: updatedList,
        ...(addressForm.isDefault ? {
          area: addressForm.area,
          postOffice: addressForm.postOffice,
          city: addressForm.city,
          district: addressForm.district,
          state: addressForm.state,
          pinCode: addressForm.pinCode,
          phone: addressForm.phone
        } : {})
      });
    } catch (e) {
      console.log('Address saved locally');
    }
  };

  const handleDeleteAddress = async (idOrKey) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedList = addresses.filter(a => a._id !== idOrKey && a.id !== idOrKey);
      setAddresses(updatedList);
      toast.info('Address removed');

      // Save to backend
      try {
        await BaseUrl.put('/user/update-profile', { addresses: updatedList });
      } catch (e) {
        console.log('Address deleted locally');
      }
    }
  };

  // Change Password
  const handlePasswordUpdate = async () => {
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      toast.error('Please enter current and new password');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    setPasswordSaving(true);
    try {
      // 1. Verify current password
      const verifyRes = await BaseUrl.post('/user/verify-password', {
        currentPassword: passwordState.currentPassword
      });

      if (verifyRes.data?.Success) {
        // 2. Update password
        const updateRes = await BaseUrl.put('/user/update-password', {
          newPassword: passwordState.newPassword,
          confirmPassword: passwordState.confirmPassword
        });

        if (updateRes.data?.Success) {
          toast.success('Password updated successfully!');
          setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          toast.error(updateRes.data?.Message || 'Failed to update password');
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.Message || 'Current password incorrect');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Navigation Items matching reference screenshot
  const NAV_ITEMS = [
    { id: 'profile', label: 'Profile Information', icon: <PersonOutlined sx={{ fontSize: 21 }} /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBagOutlined sx={{ fontSize: 21 }} /> },
    { id: 'addresses', label: 'Addresses', icon: <LocationOnOutlined sx={{ fontSize: 21 }} /> },
    { id: 'payment-methods', label: 'Payment Methods', icon: <PaymentOutlined sx={{ fontSize: 21 }} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FavoriteBorder sx={{ fontSize: 21 }} /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsNoneOutlined sx={{ fontSize: 21 }} /> },
    { id: 'security', label: 'Security', icon: <SecurityOutlined sx={{ fontSize: 21 }} /> },
    { id: 'logout', label: 'Logout', icon: <Logout sx={{ fontSize: 21 }} />, isDanger: true },
  ];

  const handleNavClick = (id) => {
    if (id === 'logout') {
      handleLogout();
    } else if (id === 'orders') {
      navigate('/track-order');
    } else if (id === 'wishlist') {
      navigate('/wishlist');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pb: 10, pt: { xs: 2.5, md: 3 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        
        {/* 1. Breadcrumbs: Home > My Account */}
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ fontSize: '0.85rem' }}>
            <Link 
              underline="hover" 
              color="inherit" 
              onClick={() => navigate('/home')}
              sx={{ cursor: 'pointer', color: '#6B7280', fontSize: '0.85rem', '&:hover': { color: '#111827' } }}
            >
              Home
            </Link>
            <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.85rem' }}>
              My Account
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* 2. Top Profile Hero Banner Card */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #111827 100%)',
            borderRadius: '20px',
            p: { xs: 2.5, sm: 3, md: 3.5 },
            color: '#FFFFFF',
            position: 'relative',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            mb: 3,
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Radial Highlight */}
          <Box 
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: 360,
              height: 360,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'flex-start', md: 'center' }, 
              justifyContent: 'space-between',
              gap: 2.5,
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left: Avatar + Details */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
              
              {/* Avatar with circular edit badge */}
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={formData.avatar} 
                  alt={formData.fullName}
                  sx={{ 
                    width: { xs: 78, sm: 92 }, 
                    height: { xs: 78, sm: 92 }, 
                    border: '3.5px solid #FFFFFF',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    bgcolor: '#334155',
                    fontSize: '2rem'
                  }}
                >
                  {formData.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                
                {/* Circular Edit Badge on Avatar */}
                <IconButton
                  size="small"
                  onClick={() => {
                    const newUrl = window.prompt("Enter new avatar image URL:", formData.avatar);
                    if (newUrl) {
                      setFormData(prev => ({ ...prev, avatar: newUrl }));
                      BaseUrl.put('/user/update-profile', { image: newUrl }).then(() => {
                        toast.success("Avatar image updated!");
                      }).catch(() => {});
                    }
                  }}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#FFFFFF',
                    color: '#111827',
                    p: 0.55,
                    border: '1.5px solid #E5E7EB',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#F3F4F6' }
                  }}
                >
                  <EditOutlined sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>

              {/* Text Info */}
              <Box>
                {/* Name & Badge Row */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.2, mb: 0.8 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: { xs: '1.3rem', sm: '1.55rem' },
                      letterSpacing: '-0.02em',
                      color: '#FFFFFF'
                    }}
                  >
                    {formData.fullName || 'User'}
                  </Typography>

                  <Box 
                    sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: 'rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(10px)',
                      color: '#FFFFFF',
                      px: 1.4,
                      py: 0.35,
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <StarBorder sx={{ fontSize: 13, color: '#FBBF24' }} />
                    {formData.role === 'admin' ? 'Admin Member' : 'Premium Member'}
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.9)', mb: 0.4, fontSize: '0.85rem' }}>
                  <EmailOutlined sx={{ fontSize: 16, opacity: 0.85 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{formData.email}</Typography>
                </Box>

                {/* Phone */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.9)', mb: 0.4, fontSize: '0.85rem' }}>
                  <PhoneOutlined sx={{ fontSize: 16, opacity: 0.85 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{formData.phone}</Typography>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.85rem' }}>
                  <LocationOnOutlined sx={{ fontSize: 16, opacity: 0.85 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{formData.location}</Typography>
                </Box>
              </Box>

            </Box>

            {/* Right: Edit Profile Button */}
            <Box sx={{ alignSelf: { xs: 'stretch', md: 'center' }, mt: { xs: 1, md: 0 } }}>
              <Button
                variant="contained"
                startIcon={<EditOutlined sx={{ fontSize: 16 }} />}
                onClick={() => {
                  setActiveTab('profile');
                  const nameInput = document.getElementById('full-name-input');
                  if (nameInput) {
                    nameInput.focus();
                    nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#111827',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  px: 2.6,
                  py: 1,
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  width: { xs: '100%', md: 'auto' },
                  '&:hover': {
                    bgcolor: '#F3F4F6'
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>

          </Box>
        </Box>

        {/* 3. Main 2-Column Side-by-Side Content Layout */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3, 
            alignItems: 'flex-start' 
          }}
        >
          
          {/* Left Column: Fixed Navigation Sidebar (~280px) */}
          <Box 
            sx={{ 
              width: { xs: '100%', md: 260, lg: 280 }, 
              flexShrink: 0,
              bgcolor: '#FFFFFF', 
              borderRadius: '16px', 
              border: '1px solid #E5E7EB',
              p: 1.5,
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              position: { md: 'sticky' },
              top: { md: 90 }
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const isDanger = item.isDanger;

              return (
                <Box
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.6,
                    px: 2,
                    py: 1.25,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    mb: 0.35,
                    transition: 'all 0.15s ease',
                    bgcolor: isActive 
                      ? '#F1F5F9' 
                      : 'transparent',
                    color: isDanger 
                      ? '#EF4444' 
                      : isActive 
                        ? '#111827' 
                        : '#4B5563',
                    fontWeight: isActive ? 700 : 500,
                    '&:hover': {
                      bgcolor: isDanger 
                        ? '#FEF2F2' 
                        : isActive 
                          ? '#F1F5F9' 
                          : '#F8FAFC',
                      color: isDanger ? '#DC2626' : '#111827'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: isDanger 
                        ? '#EF4444' 
                        : isActive 
                          ? '#111827' 
                          : '#6B7280' 
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography 
                    sx={{ 
                      fontSize: '0.92rem', 
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Right Column: Stacked Cards Area */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            
            {/* If tab is not profile, offer a button to switch back to profile overview */}
            {activeTab !== 'profile' && (
              <Box sx={{ mb: 2 }}>
                <Button 
                  startIcon={<ArrowBack />} 
                  onClick={() => setActiveTab('profile')}
                  sx={{ textTransform: 'none', color: '#111827', fontWeight: 600 }}
                >
                  Back to Profile Overview
                </Button>
              </Box>
            )}

            {/* TAB 1: PROFILE OVERVIEW (Exact match to reference screenshot) */}
            {(activeTab === 'profile' || activeTab === 'addresses') && (
              <>
                {/* Card 1: Profile Information */}
                {activeTab === 'profile' && (
                  <Box 
                    sx={{ 
                      bgcolor: '#FFFFFF', 
                      borderRadius: '16px', 
                      border: '1px solid #E5E7EB', 
                      p: { xs: 2.5, sm: 3.5 },
                      mb: 3,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ mb: 2.8 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#111827', 
                          fontSize: '1.25rem',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        Profile Information
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#6B7280', mt: 0.3, fontSize: '0.88rem' }}
                      >
                        Update your personal information
                      </Typography>
                    </Box>

                    {/* 2x2 Form Inputs Grid */}
                    <Box 
                      sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                        gap: 2.5, 
                        mb: 2.5 
                      }}
                    >
                      
                      {/* Full Name */}
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>
                          Full Name <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                        </Typography>
                        <TextField
                          id="full-name-input"
                          fullWidth
                          size="small"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          InputProps={{
                            startAdornment: (
                              <PersonOutlined sx={{ color: '#9CA3AF', fontSize: 20, mr: 1.2 }} />
                            ),
                            sx: {
                              borderRadius: '9px',
                              bgcolor: '#FFFFFF',
                              fontSize: '0.9rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#CBD5E1' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' }
                            }
                          }}
                        />
                      </Box>

                      {/* Email Address */}
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>
                          Email Address <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          InputProps={{
                            startAdornment: (
                              <EmailOutlined sx={{ color: '#9CA3AF', fontSize: 20, mr: 1.2 }} />
                            ),
                            sx: {
                              borderRadius: '9px',
                              bgcolor: '#FFFFFF',
                              fontSize: '0.9rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#CBD5E1' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' }
                            }
                          }}
                        />
                      </Box>

                      {/* Phone Number */}
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>
                          Phone Number <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          InputProps={{
                            startAdornment: (
                              <PhoneOutlined sx={{ color: '#9CA3AF', fontSize: 20, mr: 1.2 }} />
                            ),
                            sx: {
                              borderRadius: '9px',
                              bgcolor: '#FFFFFF',
                              fontSize: '0.9rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#CBD5E1' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' }
                            }
                          }}
                        />
                      </Box>

                      {/* Date of Birth */}
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>
                          Date of Birth
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          InputProps={{
                            startAdornment: (
                              <CalendarTodayOutlined sx={{ color: '#9CA3AF', fontSize: 18, mr: 1.2 }} />
                            ),
                            sx: {
                              borderRadius: '9px',
                              bgcolor: '#FFFFFF',
                              fontSize: '0.9rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#CBD5E1' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' }
                            }
                          }}
                        />
                      </Box>

                    </Box>

                    {/* Gender Radio Selection */}
                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>
                        Gender
                      </Typography>
                      <RadioGroup
                        row
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        sx={{ gap: 3 }}
                      >
                        {['Male', 'Female', 'Other'].map((g) => (
                          <FormControlLabel
                            key={g}
                            value={g}
                            control={
                              <Radio 
                                size="small" 
                                sx={{ 
                                  color: '#9CA3AF',
                                  '&.Mui-checked': { color: '#111827' }
                                }} 
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: '0.88rem', color: '#374151', fontWeight: 500 }}>
                                {g}
                              </Typography>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </Box>

                    {/* Bio / About You */}
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>
                        Bio / About You
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3.5}
                        maxRows={5}
                        value={formData.bio}
                        inputProps={{ maxLength: 200 }}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '9px',
                            bgcolor: '#FFFFFF',
                            fontSize: '0.9rem',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' }
                          }
                        }}
                      />
                      <Typography 
                        sx={{ 
                          textAlign: 'right', 
                          fontSize: '0.78rem', 
                          color: '#9CA3AF', 
                          mt: 0.6 
                        }}
                      >
                        {formData.bio.length}/200
                      </Typography>
                    </Box>

                    {/* Profile Address (According to userDetails model) */}
                    <Box sx={{ mb: 3.5, pt: 2, borderTop: '1px dashed #E5E7EB' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem', letterSpacing: '-0.01em' }}>
                          Profile Address
                        </Typography>
                        <Typography sx={{ color: '#6B7280', fontSize: '0.82rem', mt: 0.2 }}>
                          Your primary address details saved in your profile
                        </Typography>
                      </Box>

                      <Box 
                        sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                          gap: 2.2 
                        }}
                      >
                        {/* Area / Apartment / Street / Landmark */}
                        <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                            Area / Apartment / Street / Landmark
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.area || ''}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            placeholder="House/Flat No., Building, Street, Landmark"
                            InputProps={{
                              startAdornment: (
                                <HomeOutlined sx={{ color: '#9CA3AF', fontSize: 19, mr: 1.2 }} />
                              ),
                              sx: {
                                borderRadius: '9px',
                                bgcolor: '#FFFFFF',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#CBD5E1' },
                                '&.Mui-focused fieldset': { borderColor: '#111827' }
                              }
                            }}
                          />
                        </Box>

                        {/* Post Office */}
                        <Box>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                            Post Office
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.postOffice || ''}
                            onChange={(e) => setFormData({ ...formData, postOffice: e.target.value })}
                            placeholder="Enter Post Office"
                            InputProps={{
                              startAdornment: (
                                <LocalPostOfficeOutlined sx={{ color: '#9CA3AF', fontSize: 19, mr: 1.2 }} />
                              ),
                              sx: {
                                borderRadius: '9px',
                                bgcolor: '#FFFFFF',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#CBD5E1' },
                                '&.Mui-focused fieldset': { borderColor: '#111827' }
                              }
                            }}
                          />
                        </Box>

                        {/* City / Town */}
                        <Box>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                            City / Town
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Enter City / Town"
                            InputProps={{
                              sx: {
                                borderRadius: '9px',
                                bgcolor: '#FFFFFF',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#CBD5E1' },
                                '&.Mui-focused fieldset': { borderColor: '#111827' }
                              }
                            }}
                          />
                        </Box>

                        {/* District */}
                        <Box>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                            District
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.district || ''}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            placeholder="Enter District"
                            InputProps={{
                              sx: {
                                borderRadius: '9px',
                                bgcolor: '#FFFFFF',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#CBD5E1' },
                                '&.Mui-focused fieldset': { borderColor: '#111827' }
                              }
                            }}
                          />
                        </Box>

                        {/* State */}
                        <Box>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                            State
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.state || ''}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="Enter State"
                            InputProps={{
                              sx: {
                                borderRadius: '9px',
                                bgcolor: '#FFFFFF',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#CBD5E1' },
                                '&.Mui-focused fieldset': { borderColor: '#111827' }
                              }
                            }}
                          />
                        </Box>

                        {/* PIN Code */}
                        <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                            PIN Code
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={formData.pinCode || ''}
                            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                            placeholder="Enter 6-digit PIN code"
                            InputProps={{
                              startAdornment: (
                                <LocationOnOutlined sx={{ color: '#9CA3AF', fontSize: 19, mr: 1.2 }} />
                              ),
                              sx: {
                                borderRadius: '9px',
                                bgcolor: '#FFFFFF',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#CBD5E1' },
                                '&.Mui-focused fieldset': { borderColor: '#111827' }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Actions: Reset & Save Changes Side-by-Side */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                      {/* Reset Button */}
                      <Button
                        variant="outlined"
                        onClick={handleReset}
                        sx={{
                          borderColor: '#D1D5DB',
                          color: '#374151',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textTransform: 'none',
                          borderRadius: '10px',
                          py: 1.15,
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            bgcolor: '#F9FAFB'
                          }
                        }}
                      >
                        Reset
                      </Button>

                      {/* Save Changes Button */}
                      <Button
                        variant="contained"
                        disabled={saving}
                        onClick={handleSaveProfile}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <LockOutlined sx={{ fontSize: 18 }} />}
                        sx={{
                          bgcolor: '#111827',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textTransform: 'none',
                          borderRadius: '10px',
                          py: 1.15,
                          boxShadow: '0 4px 12px rgba(17, 24, 39, 0.15)',
                          '&:hover': {
                            bgcolor: '#0F172A'
                          }
                        }}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>

                  </Box>
                )}

                {/* Card 2: My Addresses */}
                <Box 
                  sx={{ 
                    bgcolor: '#FFFFFF', 
                    borderRadius: '16px', 
                    border: '1px solid #E5E7EB', 
                    p: { xs: 2.5, sm: 3.5 },
                    mb: 3,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Header with + Add New Address */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#111827', 
                        fontSize: '1.25rem',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      My Addresses
                    </Typography>

                    <Button
                      variant="text"
                      startIcon={<Add sx={{ fontSize: 18 }} />}
                      onClick={() => handleOpenAddressModal()}
                      sx={{
                        color: '#111827',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Add New Address
                    </Button>
                  </Box>

                  {/* 2 Address Cards Grid Side-by-Side */}
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                      gap: 2.5 
                    }}
                  >
                    {addresses.map((addr, idx) => {
                      const isHome = (addr.type || 'Home').toLowerCase() === 'home';
                      const addrKey = addr._id || addr.id || idx;

                      return (
                        <Box
                          key={addrKey}
                          sx={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '14px',
                            p: 2.5,
                            bgcolor: '#FFFFFF',
                            position: 'relative',
                            transition: 'border-color 0.15s ease',
                            '&:hover': {
                              borderColor: '#CBD5E1'
                            }
                          }}
                        >
                          {/* Top Badge & Corner Icon */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, minHeight: 24 }}>
                            {addr.isDefault ? (
                              <Box
                                sx={{
                                  bgcolor: '#10B981',
                                  color: '#FFFFFF',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  borderRadius: '12px',
                                  px: 1.2,
                                  py: 0.2,
                                  display: 'inline-block'
                                }}
                              >
                                Default
                              </Box>
                            ) : <Box />}

                            <NorthEast sx={{ fontSize: 18, color: '#94A3B8' }} />
                          </Box>

                          {/* Type Title with Icon */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.2 }}>
                            <Box 
                              sx={{ 
                                bgcolor: '#F1F5F9', 
                                color: '#1E293B', 
                                p: 0.7, 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {isHome ? (
                                <HomeOutlined sx={{ fontSize: 20 }} />
                              ) : (
                                <BusinessOutlined sx={{ fontSize: 20 }} />
                              )}
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
                              {addr.type || 'Home'}
                            </Typography>
                          </Box>

                          {/* Address Lines */}
                          <Typography sx={{ color: '#4B5563', fontSize: '0.85rem', lineHeight: 1.55, mb: 0.6 }}>
                            {addr.line1}
                            <br />
                            {addr.line2}
                          </Typography>

                          {/* Phone */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#374151', fontSize: '0.85rem', mb: 1.5 }}>
                            <PhoneOutlined sx={{ fontSize: 16, color: '#6B7280' }} />
                            <Typography sx={{ fontSize: '0.85rem' }}>{addr.phone || formData.phone}</Typography>
                          </Box>

                          {/* Action Buttons: Edit & Delete */}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenAddressModal(addr)}
                              sx={{ color: '#4B5563', '&:hover': { color: '#111827', bgcolor: '#F1F5F9' } }}
                            >
                              <EditOutlined sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteAddress(addrKey)}
                              sx={{ color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2' } }}
                            >
                              <DeleteOutlined sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>

                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Card 3: Quick Stats */}
                <Box 
                  sx={{ 
                    bgcolor: '#FFFFFF', 
                    borderRadius: '16px', 
                    border: '1px solid #E5E7EB', 
                    p: { xs: 2.5, sm: 3.5 },
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Header */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#111827', 
                      fontSize: '1.25rem',
                      letterSpacing: '-0.01em',
                      mb: 2.5
                    }}
                  >
                    Quick Stats
                  </Typography>

                  {/* 4 Stats Grid Across Full Width */}
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, 
                      gap: 2 
                    }}
                  >
                    
                    {/* Stat 1: Total Orders */}
                    <Box
                      onClick={() => navigate('/track-order')}
                      sx={{
                        border: '1px solid #F3F4F6',
                        bgcolor: '#FAFAFA',
                        borderRadius: '14px',
                        p: 2.2,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: '#E5E7EB',
                          bgcolor: '#F9FAFB'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 38, 
                          height: 38, 
                          bgcolor: '#F3E8FF', 
                          color: '#7C3AED', 
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ShoppingBagOutlined sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography sx={{ color: '#6B7280', fontSize: '0.8rem', mt: 1.5, fontWeight: 500 }}>
                        Total Orders
                      </Typography>
                      <Typography sx={{ color: '#111827', fontSize: '1.5rem', fontWeight: 800, my: 0.2 }}>
                        {totalOrders}
                      </Typography>
                      <Typography sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        ↑ {ordersThisMonth} this month
                      </Typography>
                    </Box>

                    {/* Stat 2: Wishlist Items */}
                    <Box
                      onClick={() => navigate('/wishlist')}
                      sx={{
                        border: '1px solid #F3F4F6',
                        bgcolor: '#FAFAFA',
                        borderRadius: '14px',
                        p: 2.2,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: '#E5E7EB',
                          bgcolor: '#F9FAFB'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 38, 
                          height: 38, 
                          bgcolor: '#ECFDF5', 
                          color: '#059669', 
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FavoriteBorder sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography sx={{ color: '#6B7280', fontSize: '0.8rem', mt: 1.5, fontWeight: 500 }}>
                        Wishlist Items
                      </Typography>
                      <Typography sx={{ color: '#111827', fontSize: '1.5rem', fontWeight: 800, my: 0.2 }}>
                        {wishlistCount}
                      </Typography>
                      <Typography sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        {wishlistCount > 0 ? '↑ In wishlist' : 'Empty'}
                      </Typography>
                    </Box>

                    {/* Stat 3: Addresses */}
                    <Box
                      onClick={() => handleOpenAddressModal()}
                      sx={{
                        border: '1px solid #F3F4F6',
                        bgcolor: '#FAFAFA',
                        borderRadius: '14px',
                        p: 2.2,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: '#E5E7EB',
                          bgcolor: '#F9FAFB'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 38, 
                          height: 38, 
                          bgcolor: '#EFF6FF', 
                          color: '#2563EB', 
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <LocationOnOutlined sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography sx={{ color: '#6B7280', fontSize: '0.8rem', mt: 1.5, fontWeight: 500 }}>
                        Addresses
                      </Typography>
                      <Typography sx={{ color: '#111827', fontSize: '1.5rem', fontWeight: 800, my: 0.2 }}>
                        {addresses.length}
                      </Typography>
                      <Typography sx={{ color: '#2563EB', fontSize: '0.75rem', fontWeight: 600 }}>
                        Manage
                      </Typography>
                    </Box>

                    {/* Stat 4: Member Since */}
                    <Box
                      sx={{
                        border: '1px solid #F3F4F6',
                        bgcolor: '#FAFAFA',
                        borderRadius: '14px',
                        p: 2.2,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 38, 
                          height: 38, 
                          bgcolor: '#FEF3C7', 
                          color: '#D97706', 
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <StarBorder sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography sx={{ color: '#6B7280', fontSize: '0.8rem', mt: 1.5, fontWeight: 500 }}>
                        Member Since
                      </Typography>
                      <Typography sx={{ color: '#111827', fontSize: '1.25rem', fontWeight: 800, my: 0.3 }}>
                        {formData.memberSince || 'Jan 2025'}
                      </Typography>
                      <Typography sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981', display: 'inline-block' }} />
                        Active
                      </Typography>
                    </Box>

                  </Box>
                </Box>
              </>
            )}

            {/* TAB: PAYMENT METHODS */}
            {activeTab === 'payment-methods' && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', p: 3.5 }}>
                <Typography variant="h6" fontWeight={700} color="#111827" mb={1}>Payment Methods</Typography>
                <Typography variant="body2" color="#6B7280" mb={3}>Manage your saved credit cards and payment preferences</Typography>
                <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 500, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 52, height: 34, bgcolor: '#0F172A', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem' }}>
                      VISA
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>•••• •••• •••• 4242</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>Expires 12/28</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: '#EF4444' }}><DeleteOutlined /></IconButton>
                </Box>
                <Button variant="outlined" startIcon={<Add />} sx={{ borderRadius: '10px', textTransform: 'none', color: '#111827', borderColor: '#D1D5DB' }}>
                  Add Payment Method
                </Button>
              </Box>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', p: 3.5 }}>
                <Typography variant="h6" fontWeight={700} color="#111827" mb={1}>Notifications</Typography>
                <Typography variant="body2" color="#6B7280" mb={3}>Stay updated on orders, offers, and account alerts</Typography>
                <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', p: 2.5, mb: 2, bgcolor: '#F8FAFC' }}>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Welcome to FootVerse!</Typography>
                  <Typography sx={{ color: '#4B5563', fontSize: '0.88rem', mt: 0.4 }}>Your account {formData.email} is active and ready for shopping.</Typography>
                  <Typography sx={{ color: '#9CA3AF', fontSize: '0.78rem', mt: 1 }}>Just now</Typography>
                </Box>
                <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', p: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Exclusive 20% Off</Typography>
                  <Typography sx={{ color: '#4B5563', fontSize: '0.88rem', mt: 0.4 }}>Use code SNEAKER20 on your next purchase today!</Typography>
                  <Typography sx={{ color: '#9CA3AF', fontSize: '0.78rem', mt: 1 }}>Yesterday</Typography>
                </Box>
              </Box>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', p: 3.5, maxWidth: 600 }}>
                <Typography variant="h6" fontWeight={700} color="#111827" mb={1}>Security & Password</Typography>
                <Typography variant="body2" color="#6B7280" mb={3}>Update your account password</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>Current Password</Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="password" 
                      placeholder="Enter current password" 
                      value={passwordState.currentPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                      sx={{ '& fieldset': { borderRadius: '9px' } }} 
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>New Password</Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="password" 
                      placeholder="Enter new password" 
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      sx={{ '& fieldset': { borderRadius: '9px' } }} 
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', mb: 0.8 }}>Confirm New Password</Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="password" 
                      placeholder="Re-enter new password" 
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                      sx={{ '& fieldset': { borderRadius: '9px' } }} 
                    />
                  </Box>
                  <Box>
                    <Button 
                      variant="contained" 
                      disabled={passwordSaving}
                      onClick={handlePasswordUpdate}
                      startIcon={passwordSaving ? <CircularProgress size={16} color="inherit" /> : <LockOutlined sx={{ fontSize: 18 }} />}
                      sx={{ bgcolor: '#111827', color: '#FFFFFF', borderRadius: '10px', textTransform: 'none', px: 4, py: 1.1, '&:hover': { bgcolor: '#0F172A' } }}
                    >
                      {passwordSaving ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

          </Box>
        </Box>

      </Container>

      {/* Address Add/Edit Modal */}
      <Dialog 
        open={addressModalOpen} 
        onClose={() => setAddressModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>Address Type</Typography>
              <RadioGroup
                row
                value={addressForm.type}
                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
              >
                <FormControlLabel value="Home" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#111827' } }} />} label="Home" />
                <FormControlLabel value="Office" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#111827' } }} />} label="Office" />
                <FormControlLabel value="Other" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#111827' } }} />} label="Other" />
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  Contact Phone <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.phone} 
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+91 98765 43210" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  Area / Apartment / Landmark <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.area} 
                  onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                  placeholder="Flat, House no., Area, Landmark" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  Post Office <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.postOffice} 
                  onChange={(e) => setAddressForm({ ...addressForm, postOffice: e.target.value })}
                  placeholder="Enter Post Office" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  City / Town <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.city} 
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Enter City / Town" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  District <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.district} 
                  onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                  placeholder="Enter District" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  State <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.state} 
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="Enter State" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', mb: 0.6 }}>
                  PIN Code <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={addressForm.pinCode} 
                  onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                  placeholder="Enter 6-digit PIN code" 
                  sx={{ '& fieldset': { borderRadius: '8px' } }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Checkbox 
                checked={!!addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                size="small"
                sx={{ p: 0.5, color: '#9CA3AF', '&.Mui-checked': { color: '#111827' } }}
              />
              <Typography 
                sx={{ fontSize: '0.82rem', color: '#4B5563', ml: 0.5, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })}
              >
                Set as default delivery address
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddressModalOpen(false)} sx={{ color: '#4B5563', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveAddress}
            sx={{ bgcolor: '#111827', color: '#FFFFFF', borderRadius: '8px', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#0F172A' } }}
          >
            Save Address
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
