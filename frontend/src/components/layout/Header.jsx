import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Box, Typography, InputBase, IconButton, 
  Badge, Avatar, Menu, MenuItem, Container, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FavoriteBorder, 
  ShoppingBagOutlined,
  PersonOutlined,
  Logout,
  NotificationsNoneOutlined,
  FiberManualRecord
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import { useAuth } from '../../store/auth';
import { BaseUrl } from '../../axiosInstance';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logoutUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const { data } = await BaseUrl.get('/user/user-profile');
        if (data?.Success && data?.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.log('Error loading header user:', err?.message);
      }
    };
    fetchUser();
  }, [token]);
  
  const notifications = [
    { id: 1, text: "Your order #1234 has been shipped", time: "10 min ago", unread: true },
    { id: 2, text: "New Nike arrivals are here!", time: "2 hours ago", unread: true },
    { id: 3, text: "Your order #1233 has been delivered", time: "1 day ago", unread: false },
    { id: 4, text: "20% OFF on selected running shoes", time: "2 days ago", unread: false }
  ];

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Shop', path: '/shop' },
    { label: 'Brand', path: '/brands' },
    { label: 'Categories', path: '/categories' },
    { label: 'Deals', path: '/deals' },
    { label: 'Track Order', path: '/track-order' },
  ];

  const isItemActive = (item) => {
    const currentPath = location.pathname.toLowerCase();
    if (item.label === 'Shop') {
      return currentPath === '/shop' || currentPath.startsWith('/shop/');
    }
    if (item.label === 'Home') {
      return currentPath === '/home' || currentPath === '/';
    }
    if (item.label === 'Brand') {
      return currentPath === '/brands' || currentPath.startsWith('/brand');
    }
    if (item.label === 'Categories') {
      return currentPath === '/categories' || currentPath.startsWith('/category');
    }
    if (item.label === 'Deals') {
      return currentPath === '/deals';
    }
    if (item.label === 'Track Order') {
      return currentPath === '/track-order' || currentPath === '/my-orders';
    }
    return false;
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <Container maxWidth="xl">
          {/* Main Unified Header: Logo, Nav, Search, User Actions all in ONE Row */}
          <Toolbar 
            disableGutters 
            sx={{ 
              height: 72, 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: { md: 2, lg: 3 }
            }}
          >
            {/* Left Section: Logo + Navigation Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 3, lg: 4 }, height: '100%' }}>
              {/* Logo */}
              <Box 
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: { md: 1, lg: 2 } }} 
                onClick={() => navigate('/home')}
              >
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  FootVerse
                </Typography>
              </Box>

              {/* Navigation Links */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2.5, lg: 3.5 }, height: '100%' }}>
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Box
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        px: 0.5,
                        userSelect: 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { md: '0.92rem', lg: '0.96rem' },
                          fontWeight: active ? 700 : 500,
                          color: active ? '#111827' : '#4B5563',
                          letterSpacing: '-0.01em',
                          transition: 'color 0.15s ease',
                          '&:hover': {
                            color: '#111827',
                          },
                        }}
                      >
                        {item.label}
                      </Typography>
                      {active && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 15,
                            left: 0,
                            right: 0,
                            height: '3.5px',
                            bgcolor: '#111827',
                            borderRadius: '2px',
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Right Section: Search Input + User Action Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 1.5, lg: 2.5 } }}>
              {/* Search Box */}
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  height: 42,
                  width: { md: 230, lg: 310, xl: 360 },
                  px: 1.8,
                  transition: 'all 0.2s ease',
                  '&:focus-within': {
                    bgcolor: '#FFFFFF',
                    borderColor: '#9CA3AF',
                    boxShadow: '0 0 0 2px rgba(156, 163, 175, 0.2)',
                  },
                }}
              >
                <IconButton
                  type="submit"
                  size="small"
                  disableRipple
                  sx={{ p: 0, mr: 1.2, color: '#9CA3AF', '&:hover': { color: '#4B5563' } }}
                >
                  <SearchIcon sx={{ fontSize: 19 }} />
                </IconButton>
                <InputBase
                  placeholder="Search for shoes, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: '100%',
                    fontSize: '0.88rem',
                    color: '#1F2937',
                    '& input': {
                      p: 0,
                    },
                    '& input::placeholder': {
                      color: '#9CA3AF',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* Action Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton color="inherit" onClick={(e) => setNotifAnchorEl(e.currentTarget)}>
                  <Badge badgeContent={2} color="error">
                    <NotificationsNoneOutlined />
                  </Badge>
                </IconButton>
                
                <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
                  <FavoriteBorder />
                </IconButton>
                
                <IconButton color="inherit" onClick={() => navigate('/shop-cart')}>
                  <Badge badgeContent={3} color="error">
                    <ShoppingBagOutlined />
                  </Badge>
                </IconButton>
                
                <Box 
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    display: 'flex', alignItems: 'center', gap: 1, 
                    cursor: 'pointer', ml: 0.5, p: 0.5, pr: 1.5,
                    borderRadius: 8,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar 
                    src={currentUser?.image} 
                    sx={{ width: 32, height: 32, bgcolor: '#111827', fontSize: '0.9rem', color: '#FFFFFF' }}
                  >
                    {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Account'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </Container>
        
        {/* Mobile Header (Hidden on Desktop) */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileHeader />
        </Box>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1, minWidth: 200, borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/account'); }}>
          <PersonOutlined fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          My Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          localStorage.removeItem('token'); 
          navigate('/'); 
        }} sx={{ color: 'error.main' }}>
          <Logout fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1, minWidth: 320, maxWidth: 360, borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={800}>Notifications</Typography>
          <Typography variant="body2" color="primary.main" sx={{ cursor: 'pointer', fontWeight: 600 }}>Mark all as read</Typography>
        </Box>
        <Divider />
        <List disablePadding>
          {notifications.map((notif) => (
            <ListItem 
              button 
              key={notif.id} 
              sx={{ 
                py: 1.5, px: 2, 
                bgcolor: notif.unread ? 'primary.50' : 'transparent',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => {
                setNotifAnchorEl(null);
                navigate('/notifications');
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5, alignSelf: 'flex-start' }}>
                {notif.unread ? <FiberManualRecord sx={{ fontSize: 12, color: 'primary.main' }} /> : <Box sx={{ width: 12 }} />}
              </ListItemIcon>
              <ListItemText 
                primary={notif.text} 
                secondary={notif.time}
                primaryTypographyProps={{ variant: 'body2', fontWeight: notif.unread ? 700 : 500, mb: 0.5 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary.main" 
            sx={{ cursor: 'pointer', fontWeight: 700 }}
            onClick={() => {
              setNotifAnchorEl(null);
              navigate('/notifications');
            }}
          >
            View All Notifications
          </Typography>
        </Box>
      </Menu>
    </>
  );
}
