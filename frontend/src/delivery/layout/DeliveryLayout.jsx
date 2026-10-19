import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Stack, Avatar, IconButton, 
  Typography, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, InputBase, Badge, Tooltip, useTheme, useMediaQuery, 
  Paper, Collapse, Divider
} from '@mui/material';
import {
  DashboardRounded, ListAltRounded, MapRounded,
  AccountBalanceWalletRounded, PersonRounded, NotificationsRounded,
  HeadsetMicRounded, SettingsRounded, SearchRounded, MenuRounded,
  LightModeRounded, DarkModeRounded, LogoutRounded, LocalShippingRounded,
  ChevronLeftRounded
} from '@mui/icons-material';
import { useAuth } from '../../store/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDeliveryThemeContext } from '../../theme/DeliveryThemeContextProvider';

const DRAWER_FULL = 260;
const DRAWER_MINI = 72;

export default function DeliveryLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Mobile: temporary drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  // Tablet/Desktop: collapsed mini sidebar
  const [collapsed, setCollapsed] = useState(false);

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode, mode } = useDeliveryThemeContext();

  const drawerWidth = collapsed ? DRAWER_MINI : DRAWER_FULL;

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/delivery-dashboard', icon: <DashboardRounded />, badge: null },
    { label: 'My Orders', path: '/delivery-orders', icon: <ListAltRounded />, badge: null },
    { label: 'Live Tracking', path: '/delivery-tracking', icon: <MapRounded />, badge: null },
    { label: 'Earnings', path: '/delivery-earnings', icon: <AccountBalanceWalletRounded />, badge: null },
    { label: 'Profile', path: '/delivery-profile', icon: <PersonRounded />, badge: null },
    { label: 'Notifications', path: '/delivery-notifications', icon: <NotificationsRounded />, badge: 3 },
    { label: 'Support', path: '/delivery-support', icon: <HeadsetMicRounded />, badge: null },
    { label: 'Settings', path: '/delivery-settings', icon: <SettingsRounded />, badge: null },
  ];

  const drawer = (mini = false) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2, overflow: 'hidden' }}>
      {/* Logo Area */}
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={1} 
        sx={{ mb: 3, px: mini ? 1 : 2, justifyContent: mini ? 'center' : 'flex-start', minHeight: 48 }}
      >
        <Box sx={{ color: theme.palette.primary.main, display: 'flex', flexShrink: 0 }}>
          <LocalShippingRounded fontSize="large" />
        </Box>
        {!mini && (
          <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            FootVerse
          </Typography>
        )}
      </Stack>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: mini ? 0.5 : 1, overflow: 'hidden' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5, display: 'block' }}>
              <Tooltip title={mini ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => {
                    if (item.path.startsWith('/')) {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: '12px',
                    justifyContent: mini ? 'center' : 'flex-start',
                    px: mini ? 1 : 2,
                    minHeight: 48,
                    backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                    color: isActive ? '#fff' : theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: isActive 
                        ? theme.palette.primary.dark 
                        : (theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'),
                      color: isActive ? '#fff' : theme.palette.primary.main,
                      '& .MuiListItemIcon-root': {
                        color: isActive ? '#fff' : theme.palette.primary.main,
                      }
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: mini ? 0 : 40, 
                    mr: mini ? 0 : 'auto',
                    color: isActive ? '#fff' : theme.palette.text.secondary,
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}>
                    {item.badge ? (
                      <Badge badgeContent={mini ? item.badge : 0} color="error">
                        {item.icon}
                      </Badge>
                    ) : item.icon}
                  </ListItemIcon>
                  {!mini && (
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.95rem',
                        noWrap: true
                      }} 
                    />
                  )}
                  {!mini && item.badge && (
                    <Badge 
                      badgeContent={item.badge} 
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : theme.palette.error.main,
                          color: '#fff',
                          position: 'static',
                          transform: 'none',
                          ml: 1
                        } 
                      }} 
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Motivational Card — hide in mini mode */}
      {!mini && (
        <>
          <Paper elevation={0} sx={{ 
            p: 2, mx: 1,
            borderRadius: 3, 
            backgroundColor: theme.palette.mode === 'light' ? '#F7F4FF' : 'rgba(108,53,255,0.1)',
            mb: 2
          }}>
            <Typography variant="subtitle2" fontWeight="700" color="primary.main" gutterBottom>
              Deliver Smarter<br/>Earn Better!
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Keep going, you're doing great!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <LocalShippingRounded />
              </Avatar>
            </Box>
          </Paper>
          <Typography variant="caption" color="text.disabled" align="center" sx={{ pb: 1 }}>
            © 2025 All rights reserved.
          </Typography>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Header / AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          width: { 
            xs: '100%', 
            md: `calc(100% - ${drawerWidth}px)` 
          }, 
          ml: { md: `${drawerWidth}px` },
          zIndex: (t) => t.zIndex.drawer - 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 }, px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Left side */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Hamburger – mobile only */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary', flexShrink: 0 }}
            >
              <MenuRounded />
            </IconButton>
            
            {/* Search Bar — visible on sm+ */}
            <Paper
              elevation={0}
              sx={{
                p: '4px 12px',
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                width: { sm: 260, md: 360, lg: 420 },
                maxWidth: '100%',
                borderRadius: '50px',
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.mode === 'light' ? '#f8f9fa' : 'background.paper',
                flexShrink: 1,
              }}
            >
              <SearchRounded sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase
                sx={{ flex: 1, fontSize: '0.9rem' }}
                placeholder="Search orders or customer..."
                inputProps={{ 'aria-label': 'search orders' }}
              />
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, px: 1, py: 0.5, bgcolor: 'action.hover', borderRadius: 1, flexShrink: 0 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">Ctrl + K</Typography>
              </Box>
            </Paper>

            {/* Mobile search icon */}
            <IconButton sx={{ display: { xs: 'flex', sm: 'none' }, color: 'text.primary' }}>
              <SearchRounded />
            </IconButton>
          </Stack>

          {/* Right Header Actions */}
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <Tooltip title="Notifications">
              <IconButton 
                sx={{ color: 'text.primary' }}
                onClick={() => navigate('/delivery-notifications')}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsRounded />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
                {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />

            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar 
                sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => navigate('/delivery-profile')}
              >
                {user?.fullName?.charAt(0) || 'D'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  {user?.fullName || 'Delivery Agent'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Delivery Agent
                </Typography>
              </Box>
              <Tooltip title="Log out">
                <IconButton 
                  size="small" 
                  onClick={handleLogout} 
                  sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
                >
                  <LogoutRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile: temporary full drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_FULL,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawer(false)}
        </Drawer>

        {/* Desktop/Tablet: permanent drawer, collapsible */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer(collapsed)}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0, // Prevent flex overflow
          mt: { xs: '64px', md: '72px' },
          overflowX: 'hidden',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
